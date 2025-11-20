import express from "express";
import protect from "../middlewares/authMiddleware.js";
import {
  changeOrderStatus,
  createOrder,
  editOrder,
  getAllOrders,
  getSingleOrder,
} from "../controllers/ordersController.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Orders
 *   description: Sifarişlərin idarə edilməsi
 */

/**
 * @swagger
 * /orders:
 *   get:
 *     summary: Bütün sifarişləri gətir
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Sifariş siyahısı
 */
router.get("/", protect, getAllOrders);

/**
 * @swagger
 * /orders/{id}:
 *   get:
 *     summary: ID üzrə sifariş məlumatını gətir
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Sifariş tapıldı
 *       404:
 *         description: Sifariş tapılmadı
 */
router.get("/:id", protect, getSingleOrder);

/**
 * @swagger
 * /orders:
 *   post:
 *     summary: Yeni sifariş yarat
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - customer
 *               - items
 *             properties:
 *               customer:
 *                 type: string
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     product:
 *                       type: string
 *                     quantity:
 *                       type: number
 *                     price:
 *                       type: number
 *               totalPrice:
 *                 type: number
 *               note:
 *                 type: string
 *     responses:
 *       201:
 *         description: Sifariş yaradıldı
 *       400:
 *         description: Yanlış məlumat
 */
router.post("/", protect, createOrder);

/**
 * @swagger
 * /orders/{id}:
 *   patch:
 *     summary: Sifariş məlumatlarını yenilə
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               customer:
 *                 type: string
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *               totalPrice:
 *                 type: number
 *               note:
 *                 type: string
 *     responses:
 *       200:
 *         description: Sifariş yeniləndi
 *       404:
 *         description: Sifariş tapılmadı
 */
router.patch("/:id", protect, editOrder);

/**
 * @swagger
 * /orders/{id}/status:
 *   patch:
 *     summary: Sifariş statusunu dəyişdir
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
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
 *               status:
 *                 type: string
 *                 example: completed
 *     responses:
 *       200:
 *         description: Status yeniləndi
 *       404:
 *         description: Sifariş tapılmadı
 */
router.patch("/:id/status", protect, changeOrderStatus);

export default router;
