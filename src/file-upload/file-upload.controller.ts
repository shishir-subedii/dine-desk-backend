import {
    Controller,
    Post,
    UseInterceptors,
    UploadedFile,
    Req,
    Body,
    UseFilters,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileUploadService } from '../file-upload/file-upload.service';

import {
    ApiTags,
    ApiConsumes,
    ApiBody,
    ApiResponse,
    ApiOperation,
} from '@nestjs/swagger';
import { MulterExceptionFilter } from 'src/common/filters/multer-exception.filter';
import { getDiskStorage, getFileInterceptor } from './file-upload.utils';
import { UploadFolder } from 'src/common/enums/file-upload.enum';

@ApiTags('File Upload') // groups endpoints in Swagger
@Controller('file-upload')
export class FileuploadController {
    constructor(private readonly fileUploadService: FileUploadService) { }

    @Post('profile')
    @UseInterceptors(getFileInterceptor(UploadFolder.PROFILE))
    @UseFilters(MulterExceptionFilter) // handles Multer errors
    @ApiConsumes('multipart/form-data')
    @ApiOperation({ summary: 'Upload profile picture' })
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                userId: { type: 'string', example: '123' },
                file: {
                    type: 'string',
                    format: 'binary',
                },
            },
            required: ['userId', 'file'],
        },
    })
    async uploadProfile(
        @UploadedFile() file: Express.Multer.File,
        @Req() req,
        @Body('userId') userId: string,
    ) {
        const fileUrl = this.fileUploadService.getFileUrl(req, file, UploadFolder.PROFILE);

        return {
            success: true,
            statusCode: 201,
            message: 'Profile uploaded successfully',
            data: {
                userId,
                originalName: file.originalname,
                storedName: file.filename,
                mimeType: file.mimetype,
                size: file.size,
                url: fileUrl,
            },
        };
    }

    @Post('application')
    @UseInterceptors(getFileInterceptor(UploadFolder.APPLICATIONS))
    @UseFilters(MulterExceptionFilter) // handles Multer errors
    @ApiConsumes('multipart/form-data')
    @ApiOperation({ summary: 'Upload application document' })
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                userId: { type: 'string', example: '123' },
                file: {
                    type: 'string',
                    format: 'binary',
                },
            },
            required: ['userId', 'file'],
        },
    })
    async uploadApplication(
        @UploadedFile() file: Express.Multer.File,
        @Req() req,
        @Body('userId') userId: string,
    ) {
        const fileUrl = this.fileUploadService.getFileUrl(req, file, UploadFolder.APPLICATIONS);

        return {
            success: true,
            statusCode: 201,
            message: 'Application uploaded successfully',
            data: {
                userId,
                originalName: file.originalname,
                storedName: file.filename,
                mimeType: file.mimetype,
                size: file.size,
                url: fileUrl,
            },
        };
    }
}
