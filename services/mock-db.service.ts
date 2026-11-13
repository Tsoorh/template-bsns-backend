import { FullProduct } from '../model/product.model';
import { User } from '../model/user.model';
import { DEFAULT_SITE_SETTINGS, SiteSettings } from '../model/site-settings.model';
import { DEFAULT_SITE_MEDIA, SiteMediaConfig } from '../model/site-media.model';
import { loggerService } from './logger.service';

export interface MockDatabase {
    products: FullProduct[];
    users: User[];
    siteMedia: Record<string, SiteMediaConfig>;
    siteSettings: Record<string, SiteSettings>;
}

const INITIAL_MOCK_PRODUCTS: FullProduct[] = [
    {
        _id: 'prod_1',
        id: 'prod_1',
        name: { en: 'Nordic Oak Dining Table', he: 'שולחן אוכל מעץ אלון' },
        description: {
            en: 'Handcrafted solid oak dining table featuring subtle bevelled edges and organic oiled finish.',
            he: 'שולחן אוכל מעץ אלון מלא בעבודת יד עם קצוות משופעים בגימור שמן טבעי יוקרתי.'
        },
        category: [{ en: 'Dining Tables', he: 'שולחנות אוכל' }],
        price: [
            { amount: 4800, variant: { en: 'Natural Oak', he: 'אלון טבעי' }, sku: 'TBL-OAK-01', size: '200x100 cm' },
            { amount: 5600, variant: { en: 'Smoked Oak', he: 'אלון מעושן' }, sku: 'TBL-SMK-02', size: '240x100 cm' }
        ],
        imgsUrl: ['/images/placeholders/table-1.webp'],
        size: [{ length: 200, width: 100, height: 75 }],
        attributes: { material: 'Solid Oak', finish: 'Organic Oil', productionTime: '21 business days' },
        isActive: true,
        isNew: true,
        isFeatured: true
    },
    {
        _id: 'prod_2',
        id: 'prod_2',
        name: { en: 'Sculptural Ceramic Pendant Light', he: 'גוף תאורה קרמי תלוי' },
        description: {
            en: 'Wheel-thrown stoneware lamp with brushed brass hardware, casting a warm focused glow.',
            he: 'גוף תאורה בחימר סטודיו בעבודת אבניים בשילוב פליז מוברש המעניק תאורה נעימה וחמה.'
        },
        category: [{ en: 'Pendant Lights', he: 'גופי תאורה תלויים' }],
        price: [
            { amount: 1450, variant: { en: 'Terracotta Matte', he: 'טרקוטה מט' }, sku: 'LGT-CRM-01' },
            { amount: 1550, variant: { en: 'Chalk White', he: 'לבן גיר' }, sku: 'LGT-CRM-02' }
        ],
        imgsUrl: ['/images/placeholders/light-1.webp'],
        size: [{ diameter: 32, height: 28 }],
        attributes: { material: 'Stoneware & Brass', socket: 'E27', maxWattage: '15W LED' },
        isActive: true,
        isNew: true,
        isFeatured: true
    },
    {
        _id: 'prod_3',
        id: 'prod_3',
        name: { en: 'Minimalist Lounge Armchair', he: 'כורסת לאונג מינימליסטית' },
        description: {
            en: 'Deep lounge armchair upholstered in tactile bouclé with a curved solid walnut frame.',
            he: 'כורסת מנוחה עמוקה בריפוד בוקלה נעים למגע עם שלדת עץ אגוז אמריקאי מכופף.'
        },
        category: [{ en: 'Lounge Chairs', he: 'כורסאות' }],
        price: [
            { amount: 3200, variant: { en: 'Cream Bouclé', he: 'בוקלה שמנת' }, sku: 'CHR-BOU-01' }
        ],
        imgsUrl: ['/images/placeholders/chair-1.webp'],
        size: [{ width: 85, depth: 80, height: 74 }],
        attributes: { material: 'American Walnut & Bouclé', warranty: '5 years' },
        isActive: true,
        isNew: false,
        isFeatured: true
    }
];

const mockStore: MockDatabase = {
    products: [...INITIAL_MOCK_PRODUCTS],
    users: [],
    siteMedia: {
        homepage_media: { ...DEFAULT_SITE_MEDIA }
    },
    siteSettings: {
        default_settings: { ...DEFAULT_SITE_SETTINGS }
    }
};

export const mockDbService = {
    getProducts: () => mockStore.products,
    getProductById: (id: string) => mockStore.products.find(p => p._id === id || p.id === id) || null,
    addProduct: (product: FullProduct) => {
        const newProduct = { ...product, id: product.id || `prod_${Date.now()}`, _id: product._id || `prod_${Date.now()}` };
        mockStore.products.push(newProduct);
        return newProduct;
    },
    updateProduct: (product: FullProduct) => {
        const idx = mockStore.products.findIndex(p => p._id === product._id || p.id === product.id);
        if (idx !== -1) {
            mockStore.products[idx] = { ...mockStore.products[idx], ...product };
            return mockStore.products[idx];
        }
        return product;
    },
    deleteProduct: (id: string) => {
        mockStore.products = mockStore.products.filter(p => p._id !== id && p.id !== id);
        return id;
    },
    getSettings: () => mockStore.siteSettings['default_settings'] || DEFAULT_SITE_SETTINGS,
    updateSettings: (settings: Partial<SiteSettings>) => {
        mockStore.siteSettings['default_settings'] = {
            ...DEFAULT_SITE_SETTINGS,
            ...mockStore.siteSettings['default_settings'],
            ...settings
        };
        return mockStore.siteSettings['default_settings'];
    },
    getMedia: () => mockStore.siteMedia['homepage_media'] || DEFAULT_SITE_MEDIA,
    updateMedia: (media: Partial<SiteMediaConfig>) => {
        mockStore.siteMedia['homepage_media'] = {
            ...DEFAULT_SITE_MEDIA,
            ...mockStore.siteMedia['homepage_media'],
            ...media
        };
        return mockStore.siteMedia['homepage_media'];
    }
};
