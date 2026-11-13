import express from 'express';
import multer from 'multer';
import { uploadMedia } from './upload.controller';
import { requireAdmin } from '../../middlewares/requireAuth.middleware';

const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 30 * 1024 * 1024 } // 30MB
});

const routes = express.Router();

routes.post('/', requireAdmin, upload.single('file'), uploadMedia);

export const uploadRoutes = routes;
