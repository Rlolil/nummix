import express from "express";
import financeDashboardController from "../controllers/financeDashboardController.js";
import protect from "../middlewares/authMiddleware.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Finance Dashboard
 *   description: Dashboard üzrə maliyyə məlumatları API-ları
 */

// Bütün route-lar authenticate olunmuş userlər üçündür
router.use(protect);

/**
 * @swagger
 * /api/dashboard/total-balance:
 *   get:
 *     summary: Ümumi balansı gətir (kassa + bank)
 *     tags: [Finance Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Uğurlu — ümumi balans qaytarılır
 *       401:
 *         description: Token tələb olunur
 */
router.get("/total-balance", financeDashboardController.getTotalBalance);

/**
 * @swagger
 * /api/dashboard/cash-balance:
 *   get:
 *     summary: Kassa balansı məlumatı
 *     tags: [Finance Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Kassa balansı qaytarılır
 */
router.get("/cash-balance", financeDashboardController.getCashBalance);

/**
 * @swagger
 * /api/dashboard/bank-balance:
 *   get:
 *     summary: Bank balansı məlumatı
 *     tags: [Finance Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Bank balansı qaytarılır
 */
router.get("/bank-balance", financeDashboardController.getBankBalance);

/**
 * @swagger
 * /api/dashboard/cash-flow:
 *   get:
 *     summary: Son 6 ay üzrə pul hərəkəti
 *     tags: [Finance Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Pul axını məlumatı qaytarılır
 */
router.get("/cash-flow", financeDashboardController.getCashFlow);

/**
 * @swagger
 * /api/dashboard/expense-breakdown:
 *   get:
 *     summary: Kateqoriyalara görə xərc bölgüsü
 *     tags: [Finance Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Xərclərin kateqoriya üzrə bölgüsü qaytarılır
 */
router.get(
  "/expense-breakdown",
  financeDashboardController.getExpenseBreakdown
);

/**
 * @swagger
 * /api/dashboard:
 *   get:
 *     summary: Bütün dashboard məlumatları (bir API-də)
 *     tags: [Finance Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard məlumatları qaytarılır
 */
router.get("/", financeDashboardController.getDashboardData);

export default router;
