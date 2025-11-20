import express from "express";
import protect from "../middlewares/authMiddleware.js";
import {
  getAllSales,
  getSingleSale,
  createSale,
  editSale,
  changeSaleStatus,
} from "../controllers/salesController.js";

const router = express.Router();

/**
 * @swagger
 * /sales:
 *   get:
 *     summary: Bütün satışları gətir
 *     tags:
 *       - Sales
 *     responses:
 *       200:
 *         description: Sales list
 */
router.get("/", protect, getAllSales);

/**
 * @swagger
 * /sales/{id}:
 *   get:
 *     summary: ID üzrə satış məlumatını gətir
 *     tags:
 *       - Sales
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Sale ID
 *     responses:
 *       200:
 *         description: Sale məlumatı
 *       404:
 *         description: Sale tapılmadı
 */
router.get("/:id", protect, getSingleSale);

/**
 * @swagger
 * /sales:
 *   post:
 *     summary: Yeni satış əlavə et
 *     tags:
 *       - Sales
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               productId:
 *                 type: string
 *               amount:
 *                 type: number
 *               date:
 *                 type: string
 *                 format: date
 *     responses:
 *       201:
 *         description: Sale yaradıldı
 */
router.post("/", protect, createSale);

/**
 * @swagger
 * /sales/{id}:
 *   patch:
 *     summary: Satışı redaktə et
 *     tags:
 *       - Sales
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
 *               productId:
 *                 type: string
 *               amount:
 *                 type: number
 *               date:
 *                 type: string
 *                 format: date
 *     responses:
 *       200:
 *         description: Sale yeniləndi
 */
router.patch("/:id", protect, editSale);

/**
 * @swagger
 * /sales/{id}/status:
 *   patch:
 *     summary: Satış statusunu dəyiş
 *     tags:
 *       - Sales
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
router.patch("/:id/status", protect, changeSaleStatus);

export default router;
