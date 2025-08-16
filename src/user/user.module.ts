
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { JwtModule } from '@nestjs/jwt';
import { Restaurant } from 'src/restaurant/entities/restaurant.entity';

@Module({
    imports: [TypeOrmModule.forFeature([User, Restaurant]), JwtModule.register({})],
    providers: [UserService],
    controllers: [UserController],
    exports: [UserService]
})
export class UsersModule { }
