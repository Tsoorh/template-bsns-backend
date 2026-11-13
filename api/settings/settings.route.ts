import express from 'express';
import { getSiteSettings, updateSiteSettings } from './settings.controller';
import { requireAdmin } from '../../middlewares/requireAuth.middleware';

const routes = express.Router();

routes.get('/', getSiteSettings);
routes.put('/', requireAdmin, updateSiteSettings);

export const settingsRoutes = routes;
