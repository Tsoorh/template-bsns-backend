import type { Request, Response } from 'express';
import { storageService } from '../../services/storage.service';
import { loggerService } from '../../services/logger.service';

export async function uploadMedia(req: Request, res: Response): Promise<void> {
    try {
        const file = req.file;
        if (!file) {
            res.status(400).send({ error: 'No file provided in request' });
            return;
        }

        const folder = (req.body.folder as 'products' | 'brand' | 'media' | 'general') || 'general';
        const siteId = (req.body.siteId as string) || 'template-store';
        const customFilename = req.body.customFilename as string | undefined;

        const result = await storageService.uploadBuffer(
            file.buffer,
            file.originalname,
            file.mimetype,
            { siteId, folder, customFilename }
        );

        res.send(result);
    } catch (err) {
        loggerService.error("Upload media failed:", err);
        res.status(500).send({ error: "Failed to upload file", message: err instanceof Error ? err.message : String(err) });
    }
}
