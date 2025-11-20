import express from "express";
import {
  // Vəsait əməliyyatları
  getAllAssets,
  getAssetById,
  createAsset,
  updateAsset,
  deleteAsset,
  
  // Kateqoriya əməliyyatları
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  
  // Hesabatlar
  generateExcelReport,
  generatePdfReport,
  generateCategoryReport,
  generateDepartmentReport,
  getReports,
  
  // Statistikalar
  getAssetStatistics,
  getDepartmentValues,
  generateAndDownloadExcel,
  generateAndDownloadPdf,
  downloadCategoryExcel,
  downloadCategoryPdf,
  getPreviousReports
} from "../controllers/assetController";

const router = express.Router();

// 🏢 Vəsait Routes
router.get("/:userId/assets", getAllAssets);
router.get("/:userId/assets/:assetId", getAssetById);
router.post("/:userId/assets", createAsset);
router.put("/:userId/assets/:assetId", updateAsset);
router.delete("/:userId/assets/:assetId", deleteAsset);

// 📊 Kateqoriya Routes
router.get("/:userId/categories", getCategories);
router.post("/:userId/categories", createCategory);
router.put("/:userId/categories/:categoryId", updateCategory);
router.delete("/:userId/categories/:categoryId", deleteCategory);

// 📈 Hesabat Routes
router.get("/:userId/reports", getReports);
router.post("/:userId/reports/excel", generateExcelReport);
router.post("/:userId/reports/pdf", generatePdfReport);
router.post("/:userId/reports/category", generateCategoryReport);
router.post("/:userId/reports/department", generateDepartmentReport);

// 📊 Statistika Routes
router.get("/:userId/statistics", getAssetStatistics);
router.get("/:userId/departments", getDepartmentValues);
router.get('/:userId/reports/excel/download', generateAndDownloadExcel);
router.get('/:userId/reports/pdf/download', generateAndDownloadPdf);
router.get('/:userId/reports/category/excel', downloadCategoryExcel);
router.get('/:userId/reports/category/pdf', downloadCategoryPdf);
router.get('/:userId/reports/previous', getPreviousReports);

export default router;