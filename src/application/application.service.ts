import { Injectable } from '@nestjs/common';
import { CreateApplicationDto } from './dto/create-application.dto';
import { UpdateApplicationDto } from './dto/update-application.dto';

@Injectable()
export class ApplicationService {
  async createApplication(createApplicationDto: CreateApplicationDto) {
    // Logic to create a new application
    return 'New application created';
  }
  
}
