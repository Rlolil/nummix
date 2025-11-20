import express from "express";
import protect from "../middlewares/authMiddleware.js";
import {
  getAllWarehouses,
  getSingleWarehouse,
  createWarehouse,
  editWarehouse,
  changeWarehouseStatus,
} from "../controllers/warehousesController.js";

const router = express.Router();

/**
 * @swagger
 * /warehouses:
 *   get:
 *     summary: Bütün anbarları gətir
 *     tags:
 *       - Warehouses
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Anbarların siyahısı
 */
router.get("/", protect, getAllWarehouses);

/**
 * @swagger
 * /warehouses/{id}:
 *   get:
 *     summary: ID üzrə anbar məlumatını gətir
 *     tags:
 *       - Warehouses
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
 *         description: Anbar məlumatı
 *       404:
 *         description: Anbar tapılmadı
 */
router.get("/:id", protect, getSingleWarehouse);

/**
 * @swagger
 * /warehouses:
 *   post:
 *     summary: Yeni anbar əlavə et
 *     tags:
 *       - Warehouses
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               location:
 *                 type: string
 *     responses:
 *       201:
 *         description: Anbar yaradıldı
 */
router.post("/", protect, createWarehouse);

/**
 * @swagger
 * /warehouses/{id}:
 *   patch:
 *     summary: Anbar məlumatını redaktə et
 *     tags:
 *       - Warehouses
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
 *               name:
 *                 type: string
 *               location:
 *                 type: string
 *     responses:
 *       200:
 *         description: Anbar məlumatı yeniləndi
 */
router.patch("/:id", protect, editWarehouse);

/**
 * @swagger
 * /warehouses/{id}/status:
 *   patch:
 *     summary: Anbar statusunu dəyiş
 *     tags:
 *       - Warehouses
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
 *         description: Status dəyişdirildi
 */
router.patch("/:id/status", protect, changeWarehouseStatus);

export default router;
