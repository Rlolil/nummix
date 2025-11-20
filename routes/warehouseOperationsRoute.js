import express from "express";
import protect from "../middlewares/authMiddleware.js";
import {
  createDelivery,
  createGRN,
  createTransfer,
  getWarehouseHistory,
} from "../controllers/warehouseOperationsController.js";

const router = express.Router();

/**
 * @swagger
 * /warehouse/grn:
 *   post:
 *     summary: Yeni GRN (Goods Receipt Note) yaradın
 *     tags:
 *       - Warehouse
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               supplierId:
 *                 type: string
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     productId:
 *                       type: string
 *                     quantity:
 *                       type: number
 *     responses:
 *       201:
 *         description: GRN yaradıldı
 */
router.post("/grn", protect, createGRN);

/**
 * @swagger
 * /warehouse/delivery:
 *   post:
 *     summary: Yeni delivery əməliyyatı əlavə et
 *     tags:
 *       - Warehouse
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               customerId:
 *                 type: string
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     productId:
 *                       type: string
 *                     quantity:
 *                       type: number
 *     responses:
 *       201:
 *         description: Delivery əməliyyatı əlavə edildi
 */
router.post("/delivery", protect, createDelivery);

/**
 * @swagger
 * /warehouse/transfer:
 *   post:
 *     summary: Məhsul transfer əməliyyatı yarat
 *     tags:
 *       - Warehouse
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fromWarehouseId:
 *                 type: string
 *               toWarehouseId:
 *                 type: string
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     productId:
 *                       type: string
 *                     quantity:
 *                       type: number
 *     responses:
 *       201:
 *         description: Transfer əməliyyatı yaradıldı
 */
router.post("/transfer", protect, createTransfer);

/**
 * @swagger
 * /warehouse/history:
 *   get:
 *     summary: Anbar tarixçəsini gətir
 *     tags:
 *       - Warehouse
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Anbar əməliyyatlarının siyahısı
 */
router.get("/history", protect, getWarehouseHistory);

export default router;
