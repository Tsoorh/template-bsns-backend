-- =========================================================================
-- Universal Boutique Catalog & Storefront Schema
-- Optimized for PostgreSQL with JSONB attributes & full text indexing
-- =========================================================================

-- 1. Products Table
CREATE TABLE IF NOT EXISTS public.products (
    id VARCHAR(64) PRIMARY KEY,
    name JSONB NOT NULL,                   -- {"en": "...", "he": "..."}
    description JSONB NOT NULL,            -- {"en": "...", "he": "..."}
    category JSONB NOT NULL,               -- [{"en": "Tables", "he": "שולחנות"}]
    price JSONB NOT NULL DEFAULT '[]'::jsonb, -- [{"variantId": "v1", "label": {"en": "Oak"}, "amount": 1200, "sku": "TBL-01"}]
    imgs_url JSONB NOT NULL DEFAULT '[]'::jsonb, -- ["https://.../img1.webp", "https://.../img2.webp"]
    size JSONB DEFAULT '[]'::jsonb,        -- [{"length": 180, "width": 90, "height": 75, "diameter": 0, "upTo": 0}]
    attributes JSONB DEFAULT '{}'::jsonb,  -- {"material": "Solid Oak", "finish": "Natural", "dimensions": "180x90 cm"}
    is_active BOOLEAN DEFAULT TRUE,
    is_new BOOLEAN DEFAULT FALSE,
    is_featured BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for category search
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products USING GIN (category);

-- Index for dynamic attributes search
CREATE INDEX IF NOT EXISTS idx_products_attributes ON public.products USING GIN (attributes);

-- Index for pricing queries
CREATE INDEX IF NOT EXISTS idx_products_price ON public.products USING GIN (price);

-- Index for status filters
CREATE INDEX IF NOT EXISTS idx_products_active ON public.products (is_active, is_new);


-- 2. Users Table (Simplified roles: admin & client, with optional trade discount)
CREATE TABLE IF NOT EXISTS public.users (
    id VARCHAR(64) PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    fullname VARCHAR(150) NOT NULL,
    role VARCHAR(50) DEFAULT 'client',     -- 'admin' | 'client'
    price_multiplier NUMERIC DEFAULT 1.0,   -- e.g. 0.85 for 15% trade partner discount
    show_prices BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_users_username ON public.users (username);


-- 3. Site Media & Showcase Slots (Editable via Admin)
CREATE TABLE IF NOT EXISTS public.site_media (
    id VARCHAR(64) PRIMARY KEY,
    hero_video JSONB NOT NULL,
    gallery JSONB NOT NULL,
    full_width_banner JSONB,
    version INT DEFAULT 1,
    publication_id VARCHAR(64),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Ensure publication_id column exists if table was previously created
ALTER TABLE public.site_media ADD COLUMN IF NOT EXISTS publication_id VARCHAR(64);

-- Site Media Audit Log Table
CREATE TABLE IF NOT EXISTS public.site_media_logs (
    id VARCHAR(64) PRIMARY KEY,
    publication_id VARCHAR(64),
    action_type VARCHAR(50),
    media_type VARCHAR(50),
    slot_id VARCHAR(50),
    slot_name JSONB,
    previous_asset JSONB,
    new_asset JSONB,
    replaced_by JSONB,
    replaced_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);


-- 4. Site Settings (Theme, Brand, Story, and Legal Configurations)
CREATE TABLE IF NOT EXISTS public.site_settings (
    id VARCHAR(64) PRIMARY KEY,            -- usually 'default_settings'
    branding JSONB NOT NULL,               -- { name, tagline, logoUrl, logoDarkUrl, faviconUrl, credits }
    contact JSONB NOT NULL,                -- { phone, whatsappNumber, email, address, socialLinks }
    theme JSONB NOT NULL,                  -- { primaryColor, backgroundColor, surfaceColor, headerBgColor, fontFamily }
    story JSONB NOT NULL,                  -- { bioTitle, bioBody, studioTitle, studioBody, workshopImages }
    experience_points JSONB NOT NULL,      -- [ { en: "...", he: "..." } ]
    legal JSONB NOT NULL,                  -- { legalBusinessName, regId, supportEmail, dpoEmail, accessibilityDetails }
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
