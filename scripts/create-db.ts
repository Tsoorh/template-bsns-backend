import fs from 'fs';
import path from 'path';
import { dbService } from '../services/db.service';
import { loggerService } from '../services/logger.service';

async function createDb() {
    console.log('🚀 Initializing PostgreSQL Database Schema...');

    if (dbService.isMockMode()) {
        console.log('⚠️  Notice: POSTGRES_URL is not set in .env. Running in Mock DB mode.');
        console.log('👉 To connect a real database, set POSTGRES_URL in .env and rerun this command.');
        process.exit(0);
    }

    try {
        const schemaPath = path.resolve(__dirname, 'schema.sql');
        const sql = await fs.promises.readFile(schemaPath, 'utf-8');

        await dbService.query(sql);

        console.log('✅ PostgreSQL Schema initialized successfully!');
        console.log('   - public.products');
        console.log('   - public.users');
        console.log('   - public.site_media');
        console.log('   - public.site_media_logs');
        console.log('   - public.site_settings');
        console.log('\n👉 Next step: Run "npm run db:seed" to populate demo products and create the admin user.');
    } catch (err) {
        loggerService.error('Failed to initialize database schema:', err);
        console.error('❌ Error executing schema.sql:', err);
        process.exit(1);
    } finally {
        await dbService.close();
    }
}

createDb();
