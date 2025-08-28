import { Global, Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { multerConfig } from './multer.config';
import { FileUploadService } from './file-upload.service';

@Global()
@Module({
  imports: [MulterModule.register(multerConfig)],
  providers: [FileUploadService],
  exports: [FileUploadService, MulterModule], // export so other modules can use
})
export class FileUploadModule { }
//TODO: REFACTORY WHOLE FILE UPLOAD MODULE AND SERVICES
