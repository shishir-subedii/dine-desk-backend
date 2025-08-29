// file-upload.utils.ts
import { diskStorage } from 'multer';
import { join } from 'path';
import { existsSync, mkdirSync } from 'fs';

export const getDiskStorage = (folder: string) =>
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
