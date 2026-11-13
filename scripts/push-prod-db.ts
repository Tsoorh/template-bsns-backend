import { Pool } from 'pg';
import { dbService } from '../services/db.service';
import readline from 'readline';

function askQuestion(query: string): Promise<string> {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    return new Promise(resolve => rl.question(query, ans => {
        rl.close();
        resolve(ans.trim());
    }));
}

async function pushToProd() {
    console.log('🚀 Local to Production Database Sync Tool');
    console.log('--------------------------------------------------');

    let prodUrl = process.env.PROD_POSTGRES_URL;
    if (!prodUrl) {
        prodUrl = await askQuestion('👉 Enter your Production PostgreSQL URL: ');
    }

    if (!prodUrl) {
        console.error('❌ Error: Production PostgreSQL URL is required.');
        process.exit(1);
    }

    console.log('\n⏳ Reading local database items...');
    const productsRes = await dbService.query('SELECT * FROM public.products;');
    const settingsRes = await dbService.query('SELECT * FROM public.site_settings;');
    const mediaRes = await dbService.query('SELECT * FROM public.site_media;');

    console.log(`📦 Found ${productsRes.rows.length} products, ${settingsRes.rows.length} settings, and ${mediaRes.rows.length} media records.`);

    console.log('⏳ Connecting to Production PostgreSQL...');
    const prodPool = new Pool({
        connectionString: prodUrl,
        ssl: prodUrl.includes('localhost') ? false : { rejectUnauthorized: false }
    });

    try {
        // Ensure tables exist on production
        console.log('⏳ Ensuring schema tables exist on production...');
        const schema = require('fs').readFileSync(require('path').resolve(__dirname, 'schema.sql'), 'utf-8');
        await prodPool.query(schema);

        // Sync Products
        for (const p of productsRes.rows) {
            await prodPool.query(`
                INSERT INTO public.products (id, name, description, category, price, imgs_url, size, attributes, is_active, is_new, is_featured)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
                ON CONFLICT (id) DO UPDATE SET
                    name = EXCLUDED.name,
                    description = EXCLUDED.description,
                    category = EXCLUDED.category,
                    price = EXCLUDED.price,
                    imgs_url = EXCLUDED.imgs_url,
                    size = EXCLUDED.size,
                    attributes = EXCLUDED.attributes;
            `, [
                p.id,
                JSON.stringify(p.name),
                JSON.stringify(p.description),
                JSON.stringify(p.category),
                JSON.stringify(p.price),
                JSON.stringify(p.imgs_url),
                JSON.stringify(p.size),
                JSON.stringify(p.attributes),
                p.is_active,
                p.is_new,
                p.is_featured
            ]);
        }

        // Sync Settings
        for (const s of settingsRes.rows) {
            await prodPool.query(`
                INSERT INTO public.site_settings (id, branding, contact, theme, story, experience_points, legal, updated_at)
                VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())
                ON CONFLICT (id) DO UPDATE SET
                    branding = EXCLUDED.branding,
                    contact = EXCLUDED.contact,
                    theme = EXCLUDED.theme,
                    story = EXCLUDED.story,
                    experience_points = EXCLUDED.experience_points,
                    legal = EXCLUDED.legal;
            `, [
                s.id,
                JSON.stringify(s.branding),
                JSON.stringify(s.contact),
                JSON.stringify(s.theme),
                JSON.stringify(s.story),
                JSON.stringify(s.experience_points),
                JSON.stringify(s.legal)
            ]);
        }

        // Sync Media
        for (const m of mediaRes.rows) {
            await prodPool.query(`
                INSERT INTO public.site_media (id, version, publication_id, hero_video, full_width_banner, gallery, updated_at)
                VALUES ($1, $2, $3, $4, $5, $6, NOW())
                ON CONFLICT (id) DO UPDATE SET
                    hero_video = EXCLUDED.hero_video,
                    full_width_banner = EXCLUDED.full_width_banner,
                    gallery = EXCLUDED.gallery;
            `, [
                m.id,
                m.version || 1,
                m.publication_id || 'pub_sync',
                JSON.stringify(m.hero_video),
                JSON.stringify(m.full_width_banner),
                JSON.stringify(m.gallery)
            ]);
        }

        console.log('🎉 Production database synchronized successfully!');
    } catch (err) {
        console.error('❌ Error pushing to production:', err);
    } finally {
        await prodPool.end();
        await dbService.close();
    }
}

pushToProd();
