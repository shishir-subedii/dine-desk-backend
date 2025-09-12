import { BadRequestException, forwardRef, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, In, Repository } from 'typeorm';
import { CreateApplicationDto } from './dto/create-application.dto';
import { User } from 'src/user/entity/user.entity';
import { Application } from './entities/application.entity';
import { ApplicationStatus } from 'src/common/enums/application-status.enum';
import { RestaurantService } from 'src/restaurant/restaurant.service';
import { CreateRestaurantDto } from 'src/restaurant/dto/create-restaurant.dto';
import { UserRole } from 'src/common/enums/auth-roles.enum';
import { MailService } from 'src/common/mail/mail.service';

@Injectable()
export class ApplicationService {
  constructor(
    @InjectRepository(Application)
    private readonly applicationRepo: Repository<Application>,

    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    private readonly dataSource: DataSource,
    private readonly restaurantService: RestaurantService,
    private readonly mailService: MailService
  ) { }

  //TODO: Maybe pass the whole multer file to service and let service handle the file naming. 
  async create(userId: string, dto: CreateApplicationDto, fileUrl: string, logoUrl: string): Promise<Application> {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    //check if user already has a pending, approved or hold application
    const existingApplication = await this.applicationRepo.findOne({
      where: {
        applicant: { id: userId },
        status: In([
          ApplicationStatus.PENDING,
          ApplicationStatus.HOLD,
          ApplicationStatus.APPROVED,
        ]),
      },
    });

    if (existingApplication) {
      throw new BadRequestException(
        'You already have an application in either pending, hold, or approved status'
      );
    }

    const application = this.applicationRepo.create({
      applicant: user,
      restaurantName: dto.restaurantName,
      description: dto.description,
      logo: logoUrl,
      contactPersonName: dto.contactPersonName,
      contactEmail: dto.contactEmail,
      contactNumber: dto.contactNumber,
      registeredCountry: dto.registeredCountry,
      registeredAddress: dto.registeredAddress,
      companyEmail: dto.companyEmail,
      companyPhone: dto.companyPhone,
      city: dto.city,
      requiredDocuments: fileUrl,
    });

    return await this.applicationRepo.save(application);
  }

  //TODO
  async findOne(id: string) {
    // fetch application + applicant safely
    const application = await this.applicationRepo.findOne({
      where: { id },
      relations: ['applicant'],
    });

    if (!application) throw new NotFoundException('Application not found');

    return application;
  }

  async findByUserId(userId: string) {
    const applications = await this.applicationRepo.find({
      where: { applicant: { id: userId } },
      relations: ['applicant'],
      order: { appliedAt: 'DESC' },
    });
    if(!applications || applications.length === 0) {
      throw new NotFoundException('No applications found for this user');
    }
    return applications;
  }

  async findAll(
    page = 1,
    limit = 10,
  ) {
    const [applications, total] = await this.applicationRepo.findAndCount({
      relations: ['applicant'],
      skip: (page - 1) * limit,
      take: limit,
      order: { appliedAt: 'DESC' },
    });

    return {
      data: applications,
      total,
      page,
      limit,
    };
  }

  async approveApplication(id: string, staffId: string) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const application = await queryRunner.manager.findOne(Application, {
        where: { id, status: ApplicationStatus.PENDING },
        relations: ['applicant'],
      });
      if (!application) throw new NotFoundException('Application not found or already processed');

      // update application status
      application.status = ApplicationStatus.APPROVED;
      application.reviewedBy = staffId;
      application.reviewedAt = new Date();
      await queryRunner.manager.save(application);

      // 🔑 update applicant role to restaurant_owner
      const applicant = application.applicant;
      applicant.role = UserRole.RESTAURANT_OWNER;
      await queryRunner.manager.save(applicant);

      // build restaurant DTO from application
      const createRestaurantDto: CreateRestaurantDto = {
        name: application.restaurantName,
        description: application.description!,
        logo: application.logo,
        requiredDocuments: application.requiredDocuments,
        registeredCountry: application.registeredCountry,
        registeredAddress: application.registeredAddress,
        companyEmail: application.companyEmail,
        companyPhone: application.companyPhone,
      };

      // use RestaurantService to create restaurant
      const restaurant = await this.restaurantService.create(
        createRestaurantDto,
        applicant,
        application,
      );

      await queryRunner.commitTransaction();

      await this.mailService.sendCustomMail(
        applicant.email,
        'Congratulations! Your Restaurant has been Approved 🎉',
        `<p>Dear ${applicant.name || 'Applicant'},</p>
   <p>We are excited to let you know that your application 
   for <b>${restaurant.name}</b> has been <b>approved</b>! 🎉</p>
   <p>You can now manage your restaurant via the DineDesk Restaurant dashboard.</p>
   <p>Welcome aboard! 🚀</p>`
      );

      return { application, restaurant, applicant };
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }



}
