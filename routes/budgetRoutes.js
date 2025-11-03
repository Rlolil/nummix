import express from "express";
import {
  createBudget,
  getBudgets,
  getBudgetByDepartment,
  updateBudget,
  deleteBudget,
  getBudgetReport,
  exportBudgetToExcel,
} from "../controllers/BudgetController.js";

const router = express.Router();

// Yeni büdcə planı yaratmaq
router.post("/", createBudget);

//Bütün büdcə planlarını gətirmək
router.get("/", getBudgets);
//Büdcə məlumatlarını Excel-ə ixrac et
router.get("/export/excel", exportBudgetToExcel);

//Departament üzrə illik büdcə detalları
// GET /api/budgets/:department/:year
router.get("/:department/:year", getBudgetByDepartment);

//Büdcəni yeniləmək (PUT)
router.put("/:id", updateBudget);
//Büdcıni silmək
router.delete("/:id", deleteBudget);
//Büdcə hesabatı
router.get("/report", getBudgetReport);
export default router;
