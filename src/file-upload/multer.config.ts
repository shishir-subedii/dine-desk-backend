import { diskStorage } from 'multer';
import { extname } from 'path';
import { Request } from 'express';
import * as fs from 'fs';

export const multerConfig = {
    storage: diskStorage({
        destination: (req: Request, file: Express.Multer.File, cb) => {
            const folder = req.body.folder || 'default';
            const uploadPath = `./uploads/${folder}`;

            // ensure folder exists
            fs.mkdirSync(uploadPath, { recursive: true });

            cb(null, uploadPath);
        },
        filename: (req: Request, file: Express.Multer.File, cb) => {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
            cb(null, `${file.fieldname}-${uniqueSuffix}${extname(file.originalname)}`);
        },
    }),

    // 5 MB max file size
    limits: {
        fileSize: 5 * 1024 * 1024,
    },

    // Allowed file types
    fileFilter: (req: Request, file: Express.Multer.File, cb: (error: Error | null, acceptFile: boolean) => void) => {
        const allowedTypes = /jpeg|jpg|png|pdf/; // you can add more
        const ext = extname(file.originalname).toLowerCase();
        const mime = file.mimetype;

        if (allowedTypes.test(ext) && allowedTypes.test(mime)) {
            cb(null, true);
        } else {
            cb(new Error('Only .jpg, .jpeg, .png, .pdf files are allowed!'), false);
        }
    },
};
