import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { loggerService } from './logger.service';

const R2_ACCOUNT_ID = process.env.R2_ACCOUNT_ID;
const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID;
const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY;
const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME || 'boutique-catalogs';
const R2_PUBLIC_URL = (process.env.R2_PUBLIC_URL || '').replace(/\/+$/, '');

const isR2Configured = Boolean(R2_ACCOUNT_ID && R2_ACCESS_KEY_ID && R2_SECRET_ACCESS_KEY && R2_PUBLIC_URL);

let s3Client: S3Client | null = null;
if (isR2Configured) {
    s3Client = new S3Client({
        region: 'auto',
        endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
        credentials: {
            accessKeyId: R2_ACCESS_KEY_ID!,
            secretAccessKey: R2_SECRET_ACCESS_KEY!
        }
    });
    loggerService.info('Cloudflare R2 storage initialized successfully.');
} else {
    loggerService.warn('Cloudflare R2 keys not provided. Running in offline/local /uploads/ fallback mode.');
}

const LOCAL_UPLOADS_DIR = path.resolve('public/uploads');
if (!fs.existsSync(LOCAL_UPLOADS_DIR)) {
    fs.mkdirSync(LOCAL_UPLOADS_DIR, { recursive: true });
}

export interface UploadOptions {
    siteId?: string;
    folder?: 'products' | 'brand' | 'media' | 'general';
    customFilename?: string;
}

export const storageService = {
    uploadBuffer,
    uploadFile,
    isCloudStorage: () => isR2Configured
};

async function uploadBuffer(
    buffer: Buffer,
    originalFilename: string,
    mimeType: string,
    options: UploadOptions = {}
): Promise<{ url: string; key: string }> {
    const siteId = options.siteId || 'template-store';
    const folder = options.folder || 'products';
    const ext = path.extname(originalFilename) || '.webp';
    const hash = crypto.randomBytes(6).toString('hex');
    const baseName = options.customFilename
        ? options.customFilename.replace(/[^a-zA-Z0-9_-]/g, '_')
        : path.basename(originalFilename, ext).replace(/[^a-zA-Z0-9_-]/g, '_');
    const filename = `${baseName}-${hash}${ext}`;

    const key = `${siteId}/${folder}/${filename}`;

    if (isR2Configured && s3Client) {
        try {
            const command = new PutObjectCommand({
                Bucket: R2_BUCKET_NAME,
                Key: key,
                Body: buffer,
                ContentType: mimeType,
                CacheControl: 'public, max-age=31536000, immutable'
            });

            await s3Client.send(command);
            const publicUrl = `${R2_PUBLIC_URL}/${key}`;
            loggerService.info(`Uploaded file to Cloudflare R2: ${publicUrl}`);
            return { url: publicUrl, key };
        } catch (err) {
            loggerService.error('Cloudflare R2 upload error, falling back to local disk:', err);
        }
    }

    // Local Disk Fallback
    const localTargetDir = path.join(LOCAL_UPLOADS_DIR, siteId, folder);
    if (!fs.existsSync(localTargetDir)) {
        fs.mkdirSync(localTargetDir, { recursive: true });
    }
    const localFilePath = path.join(localTargetDir, filename);
    await fs.promises.writeFile(localFilePath, buffer);

    const relativePath = `/uploads/${siteId}/${folder}/${filename}`;
    loggerService.info(`Saved file to local uploads: ${relativePath}`);
    return { url: relativePath, key };
}

async function uploadFile(
    filePath: string,
    mimeType: string,
    options: UploadOptions = {}
): Promise<{ url: string; key: string }> {
    const buffer = await fs.promises.readFile(filePath);
    const originalFilename = path.basename(filePath);
    return uploadBuffer(buffer, originalFilename, mimeType, options);
}
