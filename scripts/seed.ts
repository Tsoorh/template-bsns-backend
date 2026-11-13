import bcrypt from 'bcrypt';
import { dbService } from '../services/db.service';
import { DEFAULT_SITE_SETTINGS } from '../model/site-settings.model';
import { DEFAULT_SITE_MEDIA } from '../model/site-media.model';

const DEMO_PRODUCTS = [
    {
        id: 'prod_dining_table_oak',
        name: { en: 'Nordic Solid Oak Dining Table', he: 'שולחן אוכל נורדי מעץ אלון' },
        description: {
            en: 'Handcrafted solid oak dining table featuring subtle bevelled edges and organic oiled finish.',
            he: 'שולחן אוכל מעץ אלון מלא בעבודת יד עם קצוות משופעים וגימור שמן טבעי יוקרתי.'
        },
        category: [{ en: 'Furniture', he: 'רהיטים' }, { en: 'Dining Tables', he: 'שולחנות אוכל' }],
        price: [
            { amount: 4800, variant: { en: 'Natural Oak (200cm)', he: 'אלון טבעי (200 ס״מ)' }, sku: 'TBL-OAK-200' },
            { amount: 5600, variant: { en: 'Smoked Oak (240cm)', he: 'אלון מעושן (240 ס״מ)' }, sku: 'TBL-SMK-240' }
        ],
        imgsUrl: [
            'https://images.unsplash.com/photo-1577140917170-285929fb55b7?q=80&w=1200&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1615066390971-03e4e1c36ddf?q=80&w=1200&auto=format&fit=crop'
        ],
        size: [{ length: 200, width: 100, height: 75 }],
        attributes: { material: 'Solid Oak', finish: 'Organic Natural Oil', leadTime: '21 business days' },
        is_active: true,
        is_new: true,
        is_featured: true
    },
    {
        id: 'prod_ceramic_pendant',
        name: { en: 'Wheel-Thrown Stoneware Pendant', he: 'אהיל קרמיקה תלוי בעבודת אבניים' },
        description: {
            en: 'Sculptural pendant lamp thrown on the wheel from iron-rich stoneware, finished with brushed brass hardware.',
            he: 'גוף תאורה פיסולי תלוי שנעשה בעבודת אבניים מחימר עשיר בברזל, בשילוב חלקי פליז מוברש.'
        },
        category: [{ en: 'Lighting', he: 'תאורה' }, { en: 'Pendants', he: 'גופי תאורה תלויים' }],
        price: [
            { amount: 1450, variant: { en: 'Terracotta Matte', he: 'טרקוטה מט' }, sku: 'LGT-CRM-01' },
            { amount: 1550, variant: { en: 'Chalk White', he: 'לבן גיר' }, sku: 'LGT-CRM-02' }
        ],
        imgsUrl: [
            'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?q=80&w=1200&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1540932239986-30128078f3c5?q=80&w=1200&auto=format&fit=crop'
        ],
        size: [{ diameter: 32, height: 28 }],
        attributes: { material: 'Stoneware & Brass', socket: 'E27', maxWattage: '15W LED' },
        is_active: true,
        is_new: true,
        is_featured: true
    },
    {
        id: 'prod_boucle_chair',
        name: { en: 'Curved Walnut Lounge Chair', he: 'כורסת לאונג עץ אגוז ובוקלה' },
        description: {
            en: 'Sculptural lounge chair crafted from steam-bent American walnut and tactile cream bouclé upholstery.',
            he: 'כורסת לאונג בעיצוב פיסולי מעץ אגוז אמריקאי מכופף בריפוד בד בוקלה רך ויוקרתי.'
        },
        category: [{ en: 'Furniture', he: 'רהיטים' }, { en: 'Chairs', he: 'כורסאות' }],
        price: [
            { amount: 3200, variant: { en: 'Cream Bouclé', he: 'בוקלה שמנת' }, sku: 'CHR-BOU-01' },
            { amount: 3400, variant: { en: 'Charcoal Wool', he: 'צמר פחם' }, sku: 'CHR-WOL-02' }
        ],
        imgsUrl: [
            'https://images.unsplash.com/photo-1580481077195-c328ad4f3319?q=80&w=1200&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?q=80&w=1200&auto=format&fit=crop'
        ],
        size: [{ width: 82, depth: 80, height: 74 }],
        attributes: { material: 'Solid Walnut & Italian Bouclé', warranty: '5 years' },
        is_active: true,
        is_new: false,
        is_featured: true
    },
    {
        id: 'prod_brass_sconce',
        name: { en: 'Architectural Brass Wall Sconce', he: 'גוף תאורה צמוד קיר פליז מוברש' },
        description: {
            en: 'Minimalist dual-emission wall sconce casting subtle indirect light up and down.',
            he: 'גוף תאורה צמוד קיר מינימליסטי המפיץ אור עקיף עדין מעלה ומטה ליצירת אווירה נעימה.'
        },
        category: [{ en: 'Lighting', he: 'תאורה' }, { en: 'Wall Sconces', he: 'תאורת קיר' }],
        price: [
            { amount: 980, variant: { en: 'Brushed Brass', he: 'פליז מוברש' }, sku: 'LGT-WL-01' },
            { amount: 980, variant: { en: 'Matte Black', he: 'שחור מט' }, sku: 'LGT-WL-02' }
        ],
        imgsUrl: [
            'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?q=80&w=1200&auto=format&fit=crop'
        ],
        size: [{ height: 26, width: 12, depth: 8 }],
        attributes: { material: 'Solid Brass', lightSource: 'Integrated LED 2700K', ipRating: 'IP20' },
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
        // 1. Seed Users
        const saltRounds = 10;
        const adminHash = await bcrypt.hash('Admin123!', saltRounds);
        const partnerHash = await bcrypt.hash('Partner123!', saltRounds);

        const userSql = `
            INSERT INTO public.users (id, username, password, fullname, role, price_multiplier, show_prices)
            VALUES 
                ('usr_admin', 'admin@template.com', $1, 'Store Administrator', 'admin', 1.0, true),
                ('usr_trade', 'partner@boutiquestudio.com', $2, 'Studio Architect Partner', 'client', 0.85, true)
            ON CONFLICT (username) DO NOTHING;
        `;
        await dbService.query(userSql, [adminHash, partnerHash]);
        console.log('✅ Default users seeded:');
        console.log('   👤 Admin:   admin@template.com / Admin123!');
        console.log('   👤 Partner: partner@boutiquestudio.com / Partner123! (15% discount)');

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
        console.log(`✅ Seeded ${DEMO_PRODUCTS.length} sample boutique products.`);

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

        console.log('\n🎉 Database seeding finished successfully! Storefront is ready to run.');
    } catch (err) {
        console.error('❌ Seeding error:', err);
        process.exit(1);
    } finally {
        await dbService.close();
    }
}

seed();
