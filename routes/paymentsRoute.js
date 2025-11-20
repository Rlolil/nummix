import express from "express";
import protect from "../middlewares/authMiddleware.js";
import {
  createPayment,
  getAllPayments,
  getSinglePayment,
  editPayment,
  changePaymentStatus,
  getPaymentStats,
  getNext7DaysSchedule,
} from "../controllers/paymentsController.js";

const router = express.Router();

/**
 * @swagger
 * /payments:
 *   post:
 *     summary: Yeni ödəniş yaratmaq
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               amount:
 *                 type: number
 *               date:
 *                 type: string
 *                 format: date
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Ödəniş yaradıldı
 */
router.post("/", protect, createPayment);

/**
 * @swagger
 * /payments:
 *   get:
 *     summary: Bütün ödənişləri gətirmək
 *     responses:
 *       200:
 *         description: Ödəniş siyahısı
 */
router.get("/", protect, getAllPayments);

/**
 * @swagger
 * /payments/{id}:
 *   get:
 *     summary: Tək ödənişi gətirmək
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Ödəniş məlumatı
 */
router.get("/:id", protect, getSinglePayment);

/**
 * @swagger
 * /payments/{id}:
 *   patch:
 *     summary: Ödənişi redaktə etmək
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
 *               date:
 *                 type: string
 *                 format: date
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Ödəniş yeniləndi
 */
router.patch("/:id", protect, editPayment);

/**
 * @swagger
 * /payments/{id}/status:
 *   patch:
 *     summary: Ödəniş statusunu dəyişmək
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Status dəyişdirildi
 */
router.patch("/:id/status", protect, changePaymentStatus);

/**
 * @swagger
 * /payments/stats:
 *   get:
 *     summary: Ödəniş statistikasını gətirmək
 *     responses:
 *       200:
 *         description: Ödəniş statistik məlumatları
 *         content:
 *           application/json:
 *             example:
 *               totalPayments: 100
 *               totalAmount: 50000
 */
router.get("/stats", protect, getPaymentStats);

/**
 * @swagger
 * /payments/schedule:
 *   get:
 *     summary: Növbəti 7 gün üçün ödəniş cədvəli
 *     responses:
 *       200:
 *         description: 7 günlük ödəniş planı
 *         content:
 *           application/json:
 *             example:
 *               - date: "2025-11-15"
 *                 amount: 1000
 *               - date: "2025-11-16"
 *                 amount: 1500
 */
router.get("/schedule", protect, getNext7DaysSchedule);

export default router;
