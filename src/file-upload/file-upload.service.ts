import { Injectable } from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class FileUploadService {
  getFileUrl(file: Express.Multer.File, req: Request): string {
    return `${req.protocol}://${req.get('host')}/uploads/${file.filename}`;
  }
}
