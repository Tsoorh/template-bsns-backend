import { z } from 'zod';

const HebrewEnglishSchema = z.object({
    he: z.string().default(''),
    en: z.string().default(''),
});

const OptionalHebrewEnglishSchema = z.object({
    he: z.string().optional().default(''),
    en: z.string().optional().default(''),
});

const ProductSizeSchema = z.object({
    height: z.number().nonnegative().nullable().optional(),
    diameter: z.number().nonnegative().nullable().optional(),
    length: z.number().nonnegative().nullable().optional(),
    width: z.number().nonnegative().nullable().optional(),
    depth: z.number().nonnegative().nullable().optional(),
    upTo: z.number().nonnegative().nullable().optional(),
});

const ProductPriceSchema = z.object({
    amount: z.number().nonnegative(),
    variant: OptionalHebrewEnglishSchema.optional(),
    wood: OptionalHebrewEnglishSchema.optional(),
    size: z.string().optional(),
    sku: z.string().optional(),
});

export const ProductSaveSchema = z.object({
    _id: z.string().optional(),
    id: z.string().optional(),
    name: HebrewEnglishSchema,
    description: OptionalHebrewEnglishSchema.optional(),
    price: z.array(ProductPriceSchema).optional().default([]),
    isActive: z.boolean().nullable().optional().default(true),
    isNew: z.boolean().nullable().optional().default(false),
    isFeatured: z.boolean().nullable().optional().default(false),
    category: z.array(HebrewEnglishSchema).optional().default([]),
    attributes: z.record(z.string(), z.any()).optional().default({}),
    imgsUrl: z.array(z.string()).optional().default([]),
    size: z.array(ProductSizeSchema).optional().default([]),
    material: z.array(HebrewEnglishSchema).optional().default([]),
    woodType: z.array(HebrewEnglishSchema).optional().default([]),
    socketType: z.object({
        screwType: z.string().optional().default(''),
        lightType: z.string().optional().default('')
    }).optional(),
    diameter: z.number().nullable().optional()
});
