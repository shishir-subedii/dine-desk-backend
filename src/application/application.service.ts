import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateApplicationDto } from './dto/create-application.dto';
import { User } from 'src/user/entity/user.entity';
import { Application } from './entities/application.entity';

@Injectable()
export class ApplicationService {
  constructor(
    @InjectRepository(Application)
    private readonly applicationRepo: Repository<Application>,

    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) { }

  //TODO: Maybe pass the whole multer file to service and let service handle the file naming. 
  async create(userId: string, dto: CreateApplicationDto, fileUrl: string, logoUrl: string): Promise<Application> {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
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
      requiredDocuments: fileUrl, // file upload
    });

    return await this.applicationRepo.save(application);
  }

  async findOne(id: string) {
    // fetch application + applicant safely
    const application = await this.applicationRepo.findOne({
      where: { id },
      relations: ['applicant'],
    });

    if (!application) throw new NotFoundException('Application not found');

    // sanitize applicant
    const { applicant, ...rest } = application;
    return {
      ...rest,
      applicant: {
        id: applicant.id,
        name: applicant.name,
        email: applicant.email,
        role: applicant.role,
      },
    };
  }
  
}
