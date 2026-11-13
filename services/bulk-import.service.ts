import ExcelJS from 'exceljs';
import { productService } from '../api/product/products.service';
import { storageService } from './storage.service';
import { FullProduct } from '../model/product.model';
import { loggerService } from './logger.service';

export interface BulkImportResult {
    totalRows: number;
    importedCount: number;
    errors: string[];
    importedProducts: FullProduct[];
}

export const bulkImportService = {
    importFromSpreadsheetAndFiles,
    generateTemplateBuffer
};

async function generateTemplateBuffer(): Promise<Buffer> {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Products');

    worksheet.columns = [
        { header: 'Name_HE', key: 'name_he', width: 25 },
        { header: 'Name_EN', key: 'name_en', width: 25 },
        { header: 'Description_HE', key: 'desc_he', width: 35 },
        { header: 'Description_EN', key: 'desc_en', width: 35 },
        { header: 'Category_HE', key: 'cat_he', width: 20 },
        { header: 'Category_EN', key: 'cat_en', width: 20 },
        { header: 'Price', key: 'price', width: 12 },
        { header: 'SKU', key: 'sku', width: 15 },
        { header: 'Material', key: 'material', width: 20 },
        { header: 'Dimensions', key: 'dimensions', width: 20 },
        { header: 'Image_Filenames', key: 'images', width: 40 }
    ];

    // Add sample guidance row
    worksheet.addRow({
        name_he: 'שולחן אוכל מעץ אלון',
        name_en: 'Nordic Oak Dining Table',
        desc_he: 'שולחן מעץ אלון מלא בגימור טבעי.',
        desc_en: 'Handcrafted solid oak dining table.',
        cat_he: 'שולחנות אוכל',
        cat_en: 'Dining Tables',
        price: 4800,
        sku: 'TBL-OAK-01',
        material: 'Solid Oak',
        dimensions: '200x100x75 cm',
        images: 'table-front.jpg, table-detail.jpg'
    });

    const buffer = await workbook.xlsx.writeBuffer();
    return Buffer.from(buffer);
}

async function importFromSpreadsheetAndFiles(
    spreadsheetBuffer: Buffer,
    imageFiles: Express.Multer.File[],
    siteId: string = 'template-store'
): Promise<BulkImportResult> {
    const workbook = new ExcelJS.Workbook();
    await (workbook.xlsx.load as any)(spreadsheetBuffer);

    const worksheet = workbook.getWorksheet(1);
    if (!worksheet) {
        throw new Error('Spreadsheet has no worksheets.');
    }

    // Index uploaded photos by base filename
    const imageMap = new Map<string, Express.Multer.File>();
    for (const file of imageFiles) {
        imageMap.set(file.originalname.toLowerCase().trim(), file);
    }

    const uploadedUrlCache = new Map<string, string>();

    const rows: Record<string, string>[] = [];
    const headers: string[] = [];

    worksheet.eachRow((row, rowNumber) => {
        if (rowNumber === 1) {
            row.eachCell((cell, colNumber) => {
                headers[colNumber] = String(cell.value || '').trim();
            });
        } else {
            const rowData: Record<string, string> = {};
            row.eachCell((cell, colNumber) => {
                const header = headers[colNumber];
                if (header) {
                    rowData[header] = String(cell.value || '').trim();
                }
            });
            if (Object.keys(rowData).length > 0) {
                rows.push(rowData);
            }
        }
    });

    const importedProducts: FullProduct[] = [];
    const errors: string[] = [];

    for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        const rowNum = i + 2;

        const nameHe = row['Name_HE'] || row['name_he'] || '';
        const nameEn = row['Name_EN'] || row['name_en'] || '';
        if (!nameHe && !nameEn) {
            errors.push(`Row ${rowNum}: Skipped because product name is missing.`);
            continue;
        }

        const descHe = row['Description_HE'] || row['desc_he'] || '';
        const descEn = row['Description_EN'] || row['desc_en'] || '';
        const catHe = row['Category_HE'] || row['cat_he'] || row['Category'] || 'General';
        const catEn = row['Category_EN'] || row['cat_en'] || row['Category'] || 'General';
        const priceNum = parseFloat(row['Price'] || row['price'] || '0') || 0;
        const sku = row['SKU'] || row['sku'] || '';
        const material = row['Material'] || row['material'] || '';
        const dimensions = row['Dimensions'] || row['dimensions'] || '';

        // Resolve images
        const imageFilenamesStr = row['Image_Filenames'] || row['images'] || '';
        const requestedNames = imageFilenamesStr
            .split(/[,;\n]+/)
            .map(s => s.trim().toLowerCase())
            .filter(Boolean);

        const imgsUrl: string[] = [];

        for (const reqName of requestedNames) {
            if (uploadedUrlCache.has(reqName)) {
                imgsUrl.push(uploadedUrlCache.get(reqName)!);
                continue;
            }

            const file = imageMap.get(reqName);
            if (file) {
                try {
                    const uploadRes = await storageService.uploadBuffer(
                        file.buffer,
                        file.originalname,
                        file.mimetype,
                        { siteId, folder: 'products' }
                    );
                    uploadedUrlCache.set(reqName, uploadRes.url);
                    imgsUrl.push(uploadRes.url);
                } catch (err) {
                    loggerService.error(`Failed to upload image ${reqName}:`, err);
                    errors.push(`Row ${rowNum}: Failed to upload image ${reqName}`);
                }
            } else {
                errors.push(`Row ${rowNum}: Image file "${reqName}" not found in uploaded photos folder.`);
            }
        }

        const newProduct: FullProduct = {
            name: { he: nameHe, en: nameEn },
            description: { he: descHe, en: descEn },
            category: [{ he: catHe, en: catEn }],
            price: [{
                amount: priceNum,
                sku,
                variant: { he: material || 'רגיל', en: material || 'Standard' }
            }],
            imgsUrl,
            size: [],
            attributes: {
                material,
                dimensions
            },
            isActive: true,
            isNew: false
        };

        try {
            const saved = await productService.add(newProduct);
            importedProducts.push(saved);
        } catch (err) {
            errors.push(`Row ${rowNum}: Database save error for product "${nameEn || nameHe}"`);
        }
    }

    return {
        totalRows: rows.length,
        importedCount: importedProducts.length,
        errors,
        importedProducts
    };
}
