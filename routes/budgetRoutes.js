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

/**
 * @swagger
 * tags:
 *   name: Budgets
 *   description: Büdcə ilə əlaqəli əməliyyatlar
 */

/**
 * @swagger
 * /budgets:
 *   post:
 *     summary: Yeni büdcə planı yaratmaq
 *     tags: [Budgets]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               department:
 *                 type: string
 *               year:
 *                 type: integer
 *               amount:
 *                 type: number
 *     responses:
 *       201:
 *         description: Büdcə planı yaradıldı
 */
router.post("/", createBudget);

/**
 * @swagger
 * /budgets:
 *   get:
 *     summary: Bütün büdcə planlarını gətirmək
 *     tags: [Budgets]
 *     responses:
 *       200:
 *         description: Büdcələr listi
 */
router.get("/", getBudgets);

/**
 * @swagger
 * /budgets/{id}:
 *   put:
 *     summary: Büdcəni yeniləmək
 *     tags: [Budgets]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               amount:
 *                 type: number
 *     responses:
 *       200:
 *         description: Büdcə yeniləndi
 */
router.put("/:id", updateBudget);

/**
 * @swagger
 * /budgets/{id}:
 *   delete:
 *     summary: Büdcəni silmək
 *     tags: [Budgets]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Büdcə silindi
 */
router.delete("/:id", deleteBudget);

/**
 * @swagger
 * /budgets/export/excel:
 *   get:
 *     summary: Büdcə məlumatlarını Excel-ə ixrac et
 *     tags: [Budgets]
 *     responses:
 *       200:
 *         description: Excel faylı download olunur
 */
router.get("/export/excel", exportBudgetToExcel);

/**
 * @swagger
 * /budgets/report:
 *   get:
 *     summary: Büdcə hesabatı
 *     tags: [Budgets]
 *     responses:
 *       200:
 *         description: Büdcə hesabat məlumatları
 */
router.get("/report", getBudgetReport);

/**
 * @swagger
 * /budgets/{department}/{year}:
 *   get:
 *     summary: Departament üzrə illik büdcə detalları
 *     tags: [Budgets]
 *     parameters:
 *       - in: path
 *         name: department
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: year
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Departament büdcəsi
 */
router.get("/:department/:year", getBudgetByDepartment);

export default router;
