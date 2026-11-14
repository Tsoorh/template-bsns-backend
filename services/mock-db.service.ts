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
        imgsUrl: ['/images/placeholders/product-placeholder.svg'],
        size: [{ length: 100, width: 50, height: 75 }],
        attributes: { material: 'Material 1', color: 'Option A' },
        isActive: true,
        isNew: true,
        isFeatured: true
    },
    {
        _id: 'prod_2',
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
        imgsUrl: ['/images/placeholders/product-placeholder.svg'],
        size: [{ length: 120, width: 60, height: 80 }],
        attributes: { material: 'Material 1', color: 'Option B' },
        isActive: true,
        isNew: false,
        isFeatured: true
    },
    {
        _id: 'prod_3',
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
        imgsUrl: ['/images/placeholders/product-placeholder.svg'],
        size: [{ diameter: 45, height: 35 }],
        attributes: { material: 'Material 2', finish: 'Finish A' },
        isActive: true,
        isNew: true,
        isFeatured: false
    },
    {
        _id: 'prod_4',
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
        imgsUrl: ['/images/placeholders/product-placeholder.svg'],
        size: [{ width: 80, depth: 80, height: 75 }],
        attributes: { material: 'Material 2', finish: 'Finish B' },
        isActive: true,
        isNew: false,
        isFeatured: true
    },
    {
        _id: 'prod_5',
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
        imgsUrl: ['/images/placeholders/product-placeholder.svg'],
        size: [{ diameter: 30, height: 60 }],
        attributes: { material: 'Material 3', style: 'Modern' },
        isActive: true,
        isNew: true,
        isFeatured: false
    },
    {
        _id: 'prod_6',
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
        imgsUrl: ['/images/placeholders/product-placeholder.svg'],
        size: [{ length: 150, width: 80, height: 75 }],
        attributes: { material: 'Material 3', style: 'Classic' },
        isActive: true,
        isNew: false,
        isFeatured: true
    }
];

const INITIAL_MOCK_USERS: User[] = [
    {
        _id: 'user_admin',
        id: 'user_admin',
        username: 'admin@template.com',
        fullname: 'Template Store Admin',
        role: 'admin',
        password: '$2b$11$3A37jqqc0i8wThwJ/iX0huAd7wJ1w/ikwv8u.WiaB.lMbHPCU8Bma', // 'Admin123!'
        priceMultiplier: 1.0,
        showPrices: true
    }
];

const mockStore: MockDatabase = {
    products: [...INITIAL_MOCK_PRODUCTS],
    users: [...INITIAL_MOCK_USERS],
    siteMedia: {
        homepage_media: { ...DEFAULT_SITE_MEDIA }
    },
    siteSettings: {
        default_settings: { ...DEFAULT_SITE_SETTINGS }
    }
};

export const mockDbService = {
    getUsers: () => mockStore.users,
    getUserById: (id: string) => mockStore.users.find(u => u._id === id || u.id === id) || null,
    getUserByUsername: (username: string) => mockStore.users.find(u => u.username?.toLowerCase() === username.toLowerCase()) || null,
    addUser: (user: User) => {
        const newUser = { ...user, id: user.id || `user_${Date.now()}`, _id: user._id || `user_${Date.now()}` };
        mockStore.users.push(newUser);
        return newUser;
    },
    updateUser: (user: User) => {
        const idx = mockStore.users.findIndex(u => u._id === user._id || u.id === user.id);
        if (idx !== -1) {
            mockStore.users[idx] = { ...mockStore.users[idx], ...user };
            return mockStore.users[idx];
        }
        return user;
    },
    removeUser: (id: string) => {
        mockStore.users = mockStore.users.filter(u => u._id !== id && u.id !== id);
    },
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
