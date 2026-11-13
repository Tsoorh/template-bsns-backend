import type { Request, Response } from "express";
import { loggerService } from "../../services/logger.service";
import { productService } from "./products.service";
import { FullProduct, ProductParams, FilterBy } from "../../model/product.model";
import { ProductSaveSchema } from "./product.schema";
import { exportService } from "../../services/export.service";
import { bulkImportService } from "../../services/bulk-import.service";

export async function getProducts(req: Request, res: Response) {
    const { txt, price, category, isNew } = req.query

    const filterBy: FilterBy = {
        txt: (txt as string) || '',
        price: (price !== undefined && !isNaN(+price)) ? +price : undefined,
        category: (category as string) || '',
        isNew: isNew === 'true' ? true : isNew === 'false' ? false : undefined
    }
    try {
        const products = await productService.query(filterBy)
        res.send(products)
    } catch (err) {
        loggerService.error(err)
        res.status(400).send("Couldn't get products")
    }
}

export async function getProductById(req: Request<ProductParams>, res: Response) {
    const { productId } = req.params
    try {
        const product = await productService.getById(productId)
        res.send(product)
    } catch (err) {
        loggerService.error(err)
        res.status(400).send("Couldn't get product")
    }
}

export async function saveProduct(req: Request, res: Response): Promise<void> {
    const validation = ProductSaveSchema.safeParse(req.body.product)
    if (!validation.success) {
        loggerService.error('Product validation failed:', validation.error.format())
        res.status(400).send({ error: 'Invalid product data', details: validation.error.format() })
        return
    }

    const product = req.body.product as FullProduct
    try {
        let savedProduct: FullProduct
        if (product._id || product.id) {
            savedProduct = await productService.update(product) as FullProduct
        } else {
            savedProduct = await productService.add(product) as FullProduct
        }
        res.send(savedProduct)
    } catch (err) {
        loggerService.error(err)
        res.status(400).send("Couldn't save product")
    }
}

export async function removeProduct(req: Request<ProductParams>, res: Response): Promise<void> {
    const { productId } = req.params
    try {
        const removedId = await productService.remove(productId)
        res.send(removedId)
    } catch (err) {
        loggerService.error(err)
        res.status(400).send("Couldn't remove product")
    }
}

export async function exportPdf(req: Request, res: Response): Promise<void> {
    try {
        const products = await productService.query({})
        const pdfBuffer = await exportService.generatePDF(products, "Product Catalog & Price List")
        res.setHeader('Content-Type', 'application/pdf')
        res.setHeader('Content-Disposition', 'attachment; filename="price-list.pdf"')
        res.send(pdfBuffer)
    } catch (err) {
        loggerService.error(err)
        res.status(500).send("Couldn't generate PDF price list")
    }
}

export async function exportExcel(req: Request, res: Response): Promise<void> {
    try {
        const products = await productService.query({})
        const excelBuffer = await exportService.generateExcel(products, "Product Catalog & Price List")
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
        res.setHeader('Content-Disposition', 'attachment; filename="price-list.xlsx"')
        res.send(excelBuffer)
    } catch (err) {
        loggerService.error(err)
        res.status(500).send("Couldn't generate Excel price list")
    }
}

export async function downloadBulkTemplate(_req: Request, res: Response): Promise<void> {
    try {
        const buffer = await bulkImportService.generateTemplateBuffer()
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
        res.setHeader('Content-Disposition', 'attachment; filename="Product_Template.xlsx"')
        res.send(buffer)
    } catch (err) {
        loggerService.error("Failed to generate product import template:", err)
        res.status(500).send("Failed to generate template")
    }
}

export async function bulkImportProducts(req: Request, res: Response): Promise<void> {
    try {
        const files = req.files as { [fieldname: string]: Express.Multer.File[] } | undefined
        const spreadsheetFile = files?.['spreadsheet']?.[0]
        const imageFiles = files?.['images'] || []
        const siteId = (req.body.siteId as string) || 'template-store'

        if (!spreadsheetFile) {
            res.status(400).send({ error: 'Missing spreadsheet file (.xlsx)' })
            return
        }

        const result = await bulkImportService.importFromSpreadsheetAndFiles(
            spreadsheetFile.buffer,
            imageFiles,
            siteId
        )

        res.send(result)
    } catch (err) {
        loggerService.error("Bulk import failed:", err)
        res.status(500).send({ error: "Bulk import failed", message: err instanceof Error ? err.message : String(err) })
    }
}
