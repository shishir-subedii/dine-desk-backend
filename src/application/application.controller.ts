import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Req,
  UploadedFile,
  UploadedFiles,
  UseFilters,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApplicationService } from './application.service';
import { CreateApplicationDto } from './dto/create-application.dto';
import { FileUploadService } from 'src/file-upload/file-upload.service';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { MulterExceptionFilter } from 'src/common/filters/multer-exception.filter';
import { UploadFolder } from 'src/common/enums/file-upload.enum';
import { userPayloadType } from 'src/common/types/auth.types';
import { defaultFileName } from 'src/common/types/default.type';
import { JwtAuthGuard } from 'src/common/auth/AuthGuard';
import { Roles } from 'src/common/auth/AuthRoles';
import { getFilesInterceptor } from 'src/file-upload/file-upload.utils';
import { Pagination, PaginationParams } from 'src/common/pagination/pagination.decorator';
import { paginateResponse } from 'src/common/pagination/pagination.helper';

@ApiTags('Applications')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@Controller('applications')
export class ApplicationController {
  constructor(
    private readonly applicationService: ApplicationService,
    private readonly fileUploadService: FileUploadService,
  ) { }


  @Roles('user')
  @Post()
    @UseInterceptors(
      getFilesInterceptor([
        { name: 'requiredDocuments', folder: UploadFolder.APPLICATIONS },
        { name: 'logo', folder: UploadFolder.LOGOS },
      ]),
    )
  @UseFilters(MulterExceptionFilter)
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Submit new application with documents & logo' })
  //There can be a better way to document this in swagger. Research later
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        restaurantName: { type: 'string', example: 'Pizza Palace' },
        description: { type: 'string', example: 'Best pizza in town' },
        contactPersonName: { type: 'string', example: 'John Doe' },
        contactEmail: { type: 'string', example: 'owner@pizzapalace.com' },
        contactNumber: { type: 'string', example: '+977-9812345678' },
        registeredCountry: { type: 'string', example: 'Nepal' },
        registeredAddress: { type: 'string', example: 'Pokhara-17' },
        companyEmail: { type: 'string', example: 'info@pizzapalace.com' },
        companyPhone: { type: 'string', example: '+977-9800000000' },
        city: { type: 'string', example: 'Pokhara' },

        requiredDocuments: { type: 'string', format: 'binary', description: 'PDF file' },
        logo: { type: 'string', format: 'binary', description: 'JPG/PNG logo' },
      },
      required: [
        'restaurantName',
        'contactPersonName',
        'contactEmail',
        'contactNumber',
        'registeredCountry',
        'registeredAddress',
        'companyEmail',
        'companyPhone',
        'city',
        'requiredDocuments',
      ],
    },
  })

  async createApplication(
    @UploadedFiles()
    files: {
      requiredDocuments?: Express.Multer.File[];
      logo?: Express.Multer.File[];
    },
    @Req() req,
    @Body() dto: CreateApplicationDto,
  ) {
    const user = req['user'] as userPayloadType;

    const fileUrl = files.requiredDocuments
      ? this.fileUploadService.getFileUrl(req, files.requiredDocuments[0], UploadFolder.APPLICATIONS)
      : defaultFileName;

    const logoUrl = files.logo
      ? this.fileUploadService.getFileUrl(req, files.logo[0], UploadFolder.LOGOS)
      : defaultFileName;

    const application = await this.applicationService.create(
      user.id,
      dto,
      fileUrl,
      logoUrl,
    );

    return {
      success: true,
      statusCode: 201,
      message: 'Application submitted successfully',
      data: application,
    };
  }

  //get all applications
  @Get()
  @ApiOperation({ summary: 'Get all applications with pagination' })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  @ApiResponse({ status: 200, description: 'Applications retrieved successfully' })
  async findAll(
    @Pagination() pagination: PaginationParams,
    @Req() req,
  ) {
    const { page, limit } = pagination;
    const { data, total } = await this.applicationService.findAll(page, limit);

    const paginated = paginateResponse(data, total, page, limit, req);

    return {
      success: true,
      statusCode: 200,
      message: 'Applications retrieved successfully',
      data: paginated,
    };
  }

  //get single application by id
  @Get(':id')
  @ApiOperation({ summary: 'Get a single application by ID' })
  @ApiParam({ name: 'id', type: 'string', description: 'Application UUID' })
  @ApiResponse({ status: 200, description: 'Application retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Application not found' })
  async findOne(@Param('id') id: string) {
    const application = await this.applicationService.findOne(id);

    return {
      success: true,
      statusCode: 200,
      message: 'Application retrieved successfully',
      data: application,
    };
  }

  // TODO: get applications of logged in user


}
