import { dbService } from '../../services/db.service';
import { mockDbService } from '../../services/mock-db.service';
import { loggerService } from '../../services/logger.service';
import { DEFAULT_SITE_SETTINGS, SiteSettings } from '../../model/site-settings.model';

const SETTINGS_ID = 'default_settings';

export const settingsService = {
    getSettings,
    updateSettings
};

async function getSettings(): Promise<SiteSettings> {
    if (dbService.isMockMode()) {
        return mockDbService.getSettings();
    }

    try {
        const sql = `
            SELECT branding, contact, theme, story, experience_points, legal, updated_at
            FROM public.site_settings
            WHERE id = $1;
        `;
        const result = await dbService.query(sql, [SETTINGS_ID]);

        if (result.rows.length === 0) {
            // Seed default settings if none exist
            await _insertDefaultSettings();
            return DEFAULT_SITE_SETTINGS;
        }

        const row = result.rows[0];
        return {
            _id: SETTINGS_ID,
            id: SETTINGS_ID,
            branding: row.branding || DEFAULT_SITE_SETTINGS.branding,
            contact: row.contact || DEFAULT_SITE_SETTINGS.contact,
            theme: row.theme || DEFAULT_SITE_SETTINGS.theme,
            story: row.story || DEFAULT_SITE_SETTINGS.story,
            experiencePoints: row.experience_points || DEFAULT_SITE_SETTINGS.experiencePoints,
            legal: row.legal || DEFAULT_SITE_SETTINGS.legal,
            updatedAt: row.updated_at
        };
    } catch (err) {
        loggerService.warn("Could not query site_settings from PostgreSQL, returning defaults", err);
        return DEFAULT_SITE_SETTINGS;
    }
}

async function updateSettings(settings: Partial<SiteSettings>): Promise<SiteSettings> {
    if (dbService.isMockMode()) {
        return mockDbService.updateSettings(settings);
    }

    try {
        const current = await getSettings();
        const merged: SiteSettings = {
            ...current,
            ...settings,
            branding: { ...current.branding, ...(settings.branding || {}) },
            contact: { ...current.contact, ...(settings.contact || {}) },
            theme: { ...current.theme, ...(settings.theme || {}) },
            story: { ...current.story, ...(settings.story || {}) },
            legal: { ...current.legal, ...(settings.legal || {}) },
            experiencePoints: settings.experiencePoints || current.experiencePoints
        };

        const sql = `
            INSERT INTO public.site_settings (
                id, branding, contact, theme, story, experience_points, legal, updated_at
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())
            ON CONFLICT (id) DO UPDATE SET
                branding = EXCLUDED.branding,
                contact = EXCLUDED.contact,
                theme = EXCLUDED.theme,
                story = EXCLUDED.story,
                experience_points = EXCLUDED.experience_points,
                legal = EXCLUDED.legal,
                updated_at = NOW()
            RETURNING *;
        `;

        const values = [
            SETTINGS_ID,
            JSON.stringify(merged.branding),
            JSON.stringify(merged.contact),
            JSON.stringify(merged.theme),
            JSON.stringify(merged.story),
            JSON.stringify(merged.experiencePoints),
            JSON.stringify(merged.legal)
        ];

        await dbService.query(sql, values);
        return merged;
    } catch (err) {
        loggerService.error("Could not update site_settings in PostgreSQL", err);
        throw err;
    }
}

async function _insertDefaultSettings(): Promise<void> {
    try {
        const sql = `
            INSERT INTO public.site_settings (
                id, branding, contact, theme, story, experience_points, legal, updated_at
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())
            ON CONFLICT (id) DO NOTHING;
        `;
        const values = [
            SETTINGS_ID,
            JSON.stringify(DEFAULT_SITE_SETTINGS.branding),
            JSON.stringify(DEFAULT_SITE_SETTINGS.contact),
            JSON.stringify(DEFAULT_SITE_SETTINGS.theme),
            JSON.stringify(DEFAULT_SITE_SETTINGS.story),
            JSON.stringify(DEFAULT_SITE_SETTINGS.experiencePoints),
            JSON.stringify(DEFAULT_SITE_SETTINGS.legal)
        ];
        await dbService.query(sql, values);
    } catch (err) {
        loggerService.error("Failed to insert default site settings:", err);
    }
}
