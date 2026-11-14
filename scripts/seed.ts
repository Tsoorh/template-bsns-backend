import bcrypt from 'bcrypt';
import { dbService } from '../services/db.service';
import { DEFAULT_SITE_SETTINGS } from '../model/site-settings.model';
import { DEFAULT_SITE_MEDIA } from '../model/site-media.model';

const DEMO_PRODUCTS = [
    {
        id: 'prod_1',
        name: { en: 'Product 1', he: 'מוצר 1' },
        description: {
            en: 'Sample description for Product 1. This is placeholder text for the template boilerplate.',
            he: 'תיאור לדוגמה עבור מוצר 1. זהו מלל ממלא מקום עבור תבנית האתר.'
        },
        category: [{ en: 'Category 1', he: 'קטגוריה 1' }],
        price: [
            { amount: 150, variant: { en: 'Variant A', he: 'גרסה א׳' }, wood: { en: 'Variant A', he: 'גרסה א׳' }, sku: 'SKU-001-A' },
            { amount: 180, variant: { en: 'Variant B', he: 'גרסה ב׳' }, wood: { en: 'Variant B', he: 'גרסה ב׳' }, sku: 'SKU-001-B' }
        ],
        imgsUrl: [
            '/images/placeholders/product-placeholder.svg'
        ],
        size: [{ length: 100, width: 50, height: 75 }],
        attributes: { material: 'Material 1', color: 'Option A' },
        woodType: [{ en: 'Variant A', he: 'גרסה א׳' }, { en: 'Variant B', he: 'גרסה ב׳' }],
        material: [{ en: 'Material 1', he: 'חומר 1' }],
        is_active: true,
        is_new: true,
        is_featured: true
    },
    {
        id: 'prod_2',
        name: { en: 'Product 2', he: 'מוצר 2' },
        description: {
            en: 'Sample description for Product 2. This is placeholder text for the template boilerplate.',
            he: 'תיאור לדוגמה עבור מוצר 2. זהו מלל ממלא מקום עבור תבנית האתר.'
        },
        category: [{ en: 'Category 1', he: 'קטגוריה 1' }],
        price: [
            { amount: 250, variant: { en: 'Variant A', he: 'גרסה א׳' }, wood: { en: 'Variant A', he: 'גרסה א׳' }, sku: 'SKU-002-A' },
            { amount: 300, variant: { en: 'Variant B', he: 'גרסה ב׳' }, wood: { en: 'Variant B', he: 'גרסה ב׳' }, sku: 'SKU-002-B' }
        ],
        imgsUrl: [
            '/images/placeholders/product-placeholder.svg'
        ],
        size: [{ length: 120, width: 60, height: 80 }],
        attributes: { material: 'Material 1', color: 'Option B' },
        woodType: [{ en: 'Variant A', he: 'גרסה א׳' }, { en: 'Variant B', he: 'גרסה ב׳' }],
        material: [{ en: 'Material 1', he: 'חומר 1' }],
        is_active: true,
        is_new: false,
        is_featured: true
    },
    {
        id: 'prod_3',
        name: { en: 'Product 3', he: 'מוצר 3' },
        description: {
            en: 'Sample description for Product 3. This is placeholder text for the template boilerplate.',
            he: 'תיאור לדוגמה עבור מוצר 3. זהו מלל ממלא מקום עבור תבנית האתר.'
        },
        category: [{ en: 'Category 2', he: 'קטגוריה 2' }],
        price: [
            { amount: 350, variant: { en: 'Variant A', he: 'גרסה א׳' }, wood: { en: 'Variant A', he: 'גרסה א׳' }, sku: 'SKU-003-A' },
            { amount: 400, variant: { en: 'Variant B', he: 'גרסה ב׳' }, wood: { en: 'Variant B', he: 'גרסה ב׳' }, sku: 'SKU-003-B' }
        ],
        imgsUrl: [
            '/images/placeholders/product-placeholder.svg'
        ],
        size: [{ diameter: 45, height: 35 }],
        attributes: { material: 'Material 2', finish: 'Finish A' },
        woodType: [{ en: 'Variant A', he: 'גרסה א׳' }, { en: 'Variant B', he: 'גרסה ב׳' }],
        material: [{ en: 'Material 2', he: 'חומר 2' }],
        is_active: true,
        is_new: true,
        is_featured: false
    },
    {
        id: 'prod_4',
        name: { en: 'Product 4', he: 'מוצר 4' },
        description: {
            en: 'Sample description for Product 4. This is placeholder text for the template boilerplate.',
            he: 'תיאור לדוגמה עבור מוצר 4. זהו מלל ממלא מקום עבור תבנית האתר.'
        },
        category: [{ en: 'Category 2', he: 'קטגוריה 2' }],
        price: [
            { amount: 450, variant: { en: 'Standard', he: 'סטנדרטי' }, wood: { en: 'Standard', he: 'סטנדרטי' }, sku: 'SKU-004' }
        ],
        imgsUrl: [
            '/images/placeholders/product-placeholder.svg'
        ],
        size: [{ width: 80, depth: 80, height: 75 }],
        attributes: { material: 'Material 2', finish: 'Finish B' },
        woodType: [{ en: 'Standard', he: 'סטנדרטי' }],
        material: [{ en: 'Material 2', he: 'חומר 2' }],
        is_active: true,
        is_new: false,
        is_featured: true
    },
    {
        id: 'prod_5',
        name: { en: 'Product 5', he: 'מוצר 5' },
        description: {
            en: 'Sample description for Product 5. This is placeholder text for the template boilerplate.',
            he: 'תיאור לדוגמה עבור מוצר 5. זהו מלל ממלא מקום עבור תבנית האתר.'
        },
        category: [{ en: 'Category 3', he: 'קטגוריה 3' }],
        price: [
            { amount: 550, variant: { en: 'Standard', he: 'סטנדרטי' }, wood: { en: 'Standard', he: 'סטנדרטי' }, sku: 'SKU-005' }
        ],
        imgsUrl: [
            '/images/placeholders/product-placeholder.svg'
        ],
        size: [{ diameter: 30, height: 60 }],
        attributes: { material: 'Material 3', style: 'Modern' },
        woodType: [{ en: 'Standard', he: 'סטנדרטי' }],
        material: [{ en: 'Material 3', he: 'חומר 3' }],
        is_active: true,
        is_new: true,
        is_featured: false
    },
    {
        id: 'prod_6',
        name: { en: 'Product 6', he: 'מוצר 6' },
        description: {
            en: 'Sample description for Product 6. This is placeholder text for the template boilerplate.',
            he: 'תיאור לדוגמה עבור מוצר 6. זהו מלל ממלא מקום עבור תבנית האתר.'
        },
        category: [{ en: 'Category 3', he: 'קטגוריה 3' }],
        price: [
            { amount: 650, variant: { en: 'Variant A', he: 'גרסה א׳' }, wood: { en: 'Variant A', he: 'גרסה א׳' }, sku: 'SKU-006-A' },
            { amount: 750, variant: { en: 'Variant B', he: 'גרסה ב׳' }, wood: { en: 'Variant B', he: 'גרסה ב׳' }, sku: 'SKU-006-B' }
        ],
        imgsUrl: [
            '/images/placeholders/product-placeholder.svg'
        ],
        size: [{ length: 150, width: 80, height: 75 }],
        attributes: { material: 'Material 3', style: 'Classic' },
        woodType: [{ en: 'Variant A', he: 'גרסה א׳' }, { en: 'Variant B', he: 'גרסה ב׳' }],
        material: [{ en: 'Material 3', he: 'חומר 3' }],
        is_active: true,
        is_new: false,
        is_featured: true
    }
];

async function seed() {
    console.log('🌱 Starting Database Seeding...');

    if (dbService.isMockMode()) {
        console.log('⚡ Running in Mock DB mode. Mock data is already initialized in memory.');
        process.exit(0);
    }

    try {
        // 1. Seed Users (clean up previous seed users to ensure idempotency)
        const saltRounds = 10;
        const adminHash = await bcrypt.hash('Admin123!', saltRounds);
        const partnerHash = await bcrypt.hash('Partner123!', saltRounds);

        await dbService.query(`
            DELETE FROM public.users 
            WHERE id IN ('usr_admin', 'usr_trade') 
               OR username IN ('admin@template.com', 'partner@template.com', 'partner@boutiquestudio.com');
        `);

        const userSql = `
            INSERT INTO public.users (id, username, password, fullname, role, price_multiplier, show_prices)
            VALUES 
                ('usr_admin', 'admin@template.com', $1, 'Store Administrator', 'admin', 1.0, true),
                ('usr_trade', 'partner@template.com', $2, 'Trade Partner', 'client', 0.85, true);
        `;
        await dbService.query(userSql, [adminHash, partnerHash]);
        console.log('✅ Default users seeded:');
        console.log('   👤 Admin:   admin@template.com / Admin123!');
        console.log('   👤 Partner: partner@template.com / Partner123! (15% discount)');

        // Clear any old legacy sample products so we only have clean template products
        await dbService.query(`DELETE FROM public.products WHERE id LIKE 'prod_%';`);

        // 2. Seed Products
        for (const p of DEMO_PRODUCTS) {
            const prodSql = `
                INSERT INTO public.products (
                    id, name, description, category, price, imgs_url, size, attributes, is_active, is_new, is_featured
                ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
                ON CONFLICT (id) DO UPDATE SET
                    name = EXCLUDED.name,
                    description = EXCLUDED.description,
                    category = EXCLUDED.category,
                    price = EXCLUDED.price,
                    imgs_url = EXCLUDED.imgs_url,
                    size = EXCLUDED.size,
                    attributes = EXCLUDED.attributes;
            `;
            await dbService.query(prodSql, [
                p.id,
                JSON.stringify(p.name),
                JSON.stringify(p.description),
                JSON.stringify(p.category),
                JSON.stringify(p.price),
                JSON.stringify(p.imgsUrl),
                JSON.stringify(p.size),
                JSON.stringify(p.attributes),
                p.is_active,
                p.is_new,
                p.is_featured
            ]);
        }
        console.log(`✅ Seeded ${DEMO_PRODUCTS.length} clean template products (Category 1, Category 2, Category 3).`);

        // 3. Seed Site Settings
        const settingsSql = `
            INSERT INTO public.site_settings (
                id, branding, contact, theme, story, experience_points, legal, updated_at
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())
            ON CONFLICT (id) DO NOTHING;
        `;
        await dbService.query(settingsSql, [
            'default_settings',
            JSON.stringify(DEFAULT_SITE_SETTINGS.branding),
            JSON.stringify(DEFAULT_SITE_SETTINGS.contact),
            JSON.stringify(DEFAULT_SITE_SETTINGS.theme),
            JSON.stringify(DEFAULT_SITE_SETTINGS.story),
            JSON.stringify(DEFAULT_SITE_SETTINGS.experiencePoints),
            JSON.stringify(DEFAULT_SITE_SETTINGS.legal)
        ]);
        console.log('✅ Seeded default site settings, brand theme, and story.');

        // 4. Seed Site Media
        await dbService.query(`
            ALTER TABLE public.site_media ADD COLUMN IF NOT EXISTS publication_id VARCHAR(64);
        `);
        const mediaSql = `
            INSERT INTO public.site_media (
                id, version, publication_id, hero_video, full_width_banner, gallery, updated_at
            ) VALUES ($1, 1, 'pub_seed', $2, $3, $4, NOW())
            ON CONFLICT (id) DO NOTHING;
        `;
        await dbService.query(mediaSql, [
            'homepage_media',
            JSON.stringify(DEFAULT_SITE_MEDIA.heroVideo),
            JSON.stringify(DEFAULT_SITE_MEDIA.fullWidthBanner),
            JSON.stringify(DEFAULT_SITE_MEDIA.gallery)
        ]);
        console.log('✅ Seeded default site media slots.');

        console.log('\n🎉 Database seeding finished successfully! Template boilerplate is ready.');
    } catch (err) {
        console.error('❌ Seeding error:', err);
        process.exit(1);
    } finally {
        await dbService.close();
    }
}

seed();
