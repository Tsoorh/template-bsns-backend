export type hebrewEnglishObj = {
    he: string
    en: string
}

export type ProductPrice = {
    amount: number
    variant?: hebrewEnglishObj
    wood?: hebrewEnglishObj // Backwards-compatible alias for finish/material variant
    size?: string
    sku?: string
}

export type ProductSize = {
    height?: number
    diameter?: number
    length?: number
    width?: number
    depth?: number
    upTo?: number
}

export type Product = {
    _id?: string
    id?: string
    name: hebrewEnglishObj
    description: hebrewEnglishObj
    price?: ProductPrice[]
    isActive?: boolean
    isNew?: boolean
    isFeatured?: boolean
}

export type FullProduct = Product & {
    category: hebrewEnglishObj[]
    imgsUrl: string[]
    size: ProductSize[]
    // Dynamic attributes dictionary replaces hardcoded woodType & socketType
    attributes?: Record<string, string | string[] | hebrewEnglishObj>
    // Backwards-compatibility aliases for legacy fields
    material?: hebrewEnglishObj[]
    woodType?: hebrewEnglishObj[]
    socketType?: { screwType?: string; lightType?: string }
    diameter?: number
    createdAt?: string
    updatedAt?: string
}

export type FilterBy = {
    txt?: string
    price?: number
    category?: string
    isActive?: boolean
    isNew?: boolean
    isFeatured?: boolean
    attributes?: Record<string, string | string[]>
}

export type ProductParams = { productId: string }
