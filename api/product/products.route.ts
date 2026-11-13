import express from 'express';
import multer from 'multer';
import { 
    exportExcel, 
    exportPdf, 
    getProductById, 
    getProducts, 
    removeProduct, 
    saveProduct,
    downloadBulkTemplate,
    bulkImportProducts
} from './product.controller';
import { requireAdmin, requireAuth } from '../../middlewares/requireAuth.middleware';

const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 25 * 1024 * 1024 } // 25MB per file
});

const routes = express.Router();

routes.get("/", getProducts);
routes.get("/export/pdf", requireAuth, exportPdf);
routes.get("/export/excel", requireAuth, exportExcel);
routes.get("/bulk/template", downloadBulkTemplate);
routes.post(
    "/bulk/import", 
    requireAdmin, 
    upload.fields([
        { name: 'spreadsheet', maxCount: 1 },
        { name: 'images', maxCount: 100 }
    ]), 
    bulkImportProducts
);
routes.get("/:productId", getProductById);
routes.post("/", requireAdmin, saveProduct);
routes.put("/", requireAdmin, saveProduct);
routes.delete("/:productId", requireAdmin, removeProduct);

export const productRoutes = routes;
