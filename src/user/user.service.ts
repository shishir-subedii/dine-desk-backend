import {
    BadRequestException,
    forwardRef,
    Inject,
    Injectable,
    InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entity/user.entity';
import { UserRegisterDto } from 'src/auth/dto/UserRegisterDto';
import * as bcrypt from 'bcrypt';
import { changePasswordDto } from 'src/auth/dto/ChangePasswordDto';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
        private jwtService: JwtService,
        @Inject(forwardRef(() => AuthService))
        private authService: AuthService
    ) { }

    async generateOtp(): Promise<string> {
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        return otp;
    }

    async register(userData: UserRegisterDto) {
        const existingUser = await this.findOneByEmail(userData.email);
        if (existingUser) {
            throw new BadRequestException('User with this email already exists');
        }

        const hashedPassword = await bcrypt.hash(userData.password, 10);

        const otp = await this.generateOtp();

        const newUser = this.usersRepository.create({
            name: userData.name,
            email: userData.email,
            password: hashedPassword,
            accessTokens: [], // initialize empty token list
            otp, 
            otpExpiry: new Date(Date.now() + 10 * 60000), // 10 minutes from now
            isVerified: false
        });

        const token = await this.authService.genTokens(newUser.id, newUser.email, newUser.role);

        await this.usersRepository.save(newUser);
        return token;
    }

    async verifySignupOtp(email: string, otp: string) {
        const user = await this.usersRepository.findOne({ where: { email, isVerified: false } });
        if (!user) {
            throw new BadRequestException('User not found');
        }
        if (user.otp !== otp) {
            throw new BadRequestException('Invalid OTP');
        }
        if (!user.otpExpiry || user.otpExpiry < new Date()) {
            throw new BadRequestException('OTP expired');
        }

        user.isVerified = true;
        user.otp = null;
        user.otpExpiry = null;
        await this.usersRepository.save(user);
        return true;
    }

    async findAll() {
        return this.usersRepository.find();
    }

    async findVerifiedUsers() {
        return this.usersRepository.find({ where: { isVerified: true } });
    }

    async checkVerificationStatus(email: string) {
        const user = await this.findOneByEmail(email);
        if (!user) {
            throw new BadRequestException('User not found');
        }
        if(user.isVerified) {
            return true;
        }
        return false;
    }

    async findOneById(id: string) {
        return this.usersRepository.findOne({ where: { id } });
    }

    async findOneByEmail(email: string) {
        return this.usersRepository.findOne({ where: { email, isVerified: true }, relations: { restaurantsOwned: true } });
    }

    async findCompleteProfileByEmail(email: string) {
        return this.usersRepository
            .createQueryBuilder('user')
            .addSelect('user.password')
            .addSelect('user.accessTokens')
            .where('user.email = :email', { email })
            .getOne();
    }

    // ✅ Add token to user's token array
    async addAccessToken(email: string, newToken: string) {
        const user = await this.findCompleteProfileByEmail(email);
        if (!user) throw new BadRequestException('User not found');

        user.accessTokens = [...(user.accessTokens || []), newToken];
        await this.usersRepository.save(user);
    }

    // ✅ Remove a specific token (logout from one device)
    async removeAccessToken(email: string, tokenToRemove: string) {
        const user = await this.findCompleteProfileByEmail(email);
        if (!user) throw new BadRequestException('User not found');

        user.accessTokens = (user.accessTokens || []).filter(
            token => token !== tokenToRemove,
        );
        await this.usersRepository.save(user);
    }

    // ✅ Optional: remove all tokens (logout from all devices)
    async removeAllAccessTokens(email: string) {
        await this.usersRepository.update({ email }, { accessTokens: [] });
    }

    async getUserProfile(email: string) {
        const user = await this.findOneByEmail(email);
        if (!user) {
            throw new BadRequestException('User not found');
        }
        return user;
    }

    async changePassword(email: string, body: changePasswordDto) {
        const user = await this.findCompleteProfileByEmail(email);
        if (!user) {
            throw new BadRequestException('User not found');
        }

        if (body.newPassword !== body.confirmNewPassword) {
            throw new BadRequestException(
                'New password and confirm password do not match',
            );
        }

        if(!user.password) {
            throw new BadRequestException('User not found');
        }

        const isOldPasswordValid = await bcrypt.compare(
            body.oldPassword,
            user.password,
        );
        if (!isOldPasswordValid) {
            throw new BadRequestException('Old password is incorrect');
        }

        const hashedPassword = await bcrypt.hash(body.newPassword, 10);
        user.password = hashedPassword;
        user.accessTokens = []; // logout from all devices after password change

        try {
            return await this.usersRepository.save(user);
        } catch (error) {
            throw new InternalServerErrorException('Failed to change password');
        }
    }
}
