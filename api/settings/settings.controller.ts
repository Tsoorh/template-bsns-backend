import type { Request, Response } from 'express';
import { settingsService } from './settings.service';
import { loggerService } from '../../services/logger.service';

export async function getSiteSettings(_req: Request, res: Response): Promise<void> {
    try {
        const settings = await settingsService.getSettings();
        res.send(settings);
    } catch (err) {
        loggerService.error("Failed to get site settings:", err);
        res.status(500).send("Failed to get site settings");
    }
}

export async function updateSiteSettings(req: Request, res: Response): Promise<void> {
    try {
        const updated = await settingsService.updateSettings(req.body);
        res.send(updated);
    } catch (err) {
        loggerService.error("Failed to update site settings:", err);
        res.status(500).send("Failed to update site settings");
    }
}
