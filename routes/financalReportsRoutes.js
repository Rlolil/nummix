import express from "express";
import protect from "../middlewares/authMiddleware.js";
import {
  getFinancialReports,
  getBalanceSheet,
  getIncomeStatement,
  getCashFlowStatement,
  getEquityStatement,
  exportFinancialReportsToExcel,
} from "../controllers/financialReportsController.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Financial Reports
 *   description: Maliyyə hesabatları API-ları
 */

/**
 * @swagger
 * /api/financial-reports:
 *   get:
 *     summary: Bütün maliyyə hesabatlarını gətir
 *     tags: [Financial Reports]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Uğurlu — bütün hesabatlar qaytarılır
 *       401:
 *         description: Token olmadan giriş qadağandır
 */
router.get("/", protect, getFinancialReports);

/**
 * @swagger
 * /api/financial-reports/balance-sheet:
 *   get:
 *     summary: Balans hesabatı
 *     tags: [Financial Reports]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Balans hesabatı qaytarılır
 */
router.get("/balance-sheet", protect, getBalanceSheet);

/**
 * @swagger
 * /api/financial-reports/income-statement:
 *   get:
 *     summary: Mənfəət və Zərər hesabatı
 *     tags: [Financial Reports]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Mənfəət və zərər hesabatı qaytarılır
 */
router.get("/income-statement", protect, getIncomeStatement);

/**
 * @swagger
 * /api/financial-reports/cash-flow:
 *   get:
 *     summary: Pul vəsaitlərinin hərəkəti hesabatı
 *     tags: [Financial Reports]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Pul axını hesabatı qaytarılır
 */
router.get("/cash-flow", protect, getCashFlowStatement);

/**
 * @swagger
 * /api/financial-reports/equity:
 *   get:
 *     summary: Kapital dəyişiklikləri hesabatı
 *     tags: [Financial Reports]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Kapital hesabatı qaytarılır
 */
router.get("/equity", protect, getEquityStatement);

/**
 * @swagger
 * /api/financial-reports/export-excel:
 *   get:
 *     summary: Maliyyə hesabatlarını Excel formatında yüklə
 *     tags: [Financial Reports]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Excel faylı qaytarılır
 */
router.get("/export-excel", protect, exportFinancialReportsToExcel);

export default router;
