// file-upload.utils.ts
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { join } from 'path';
import { existsSync, mkdirSync } from 'fs';
import { BadRequestException } from '@nestjs/common';
import { allowedMimeTypes, MAX_FILE_SIZE } from './file-upload.config';
import { UploadFolder } from 'src/common/enums/file-upload.enum';

export const getDiskStorage = (folder: UploadFolder) =>
    diskStorage({
        destination: (req, file, cb) => {
            const uploadPath = join(__dirname, '../../uploads', folder);
            if (!existsSync(uploadPath)) mkdirSync(uploadPath, { recursive: true });
            cb(null, uploadPath);
        },
        filename: (req, file, cb) => {
            cb(null, `${Date.now()}-${file.originalname}`);
        },
    });

export const getFileInterceptor = (folder: UploadFolder) =>
    FileInterceptor('file', {
        storage: getDiskStorage(folder),
        fileFilter: (req, file, cb) => {
            const allowed = allowedMimeTypes[folder];
            if (!allowed.includes(file.mimetype)) {
                return cb(
                    new BadRequestException(
                        `Invalid file type for ${folder}. Allowed: ${allowed.join(', ')}`,
                    ),
                    false,
                );
            }
            cb(null, true);
        },
        limits: { fileSize: MAX_FILE_SIZE }, // 5MB
    });
