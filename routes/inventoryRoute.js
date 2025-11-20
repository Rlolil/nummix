import express from "express";
import protect from "../middlewares/authMiddleware.js";
import {
  changeInventoryStatus,
  createInventory,
  editInventory,
  getAllInventory,
  getSingleInventory,
} from "../controllers/inventoryController.js";

const router = express.Router();

/**
 * @swagger
 * /inventory:
 *   get:
 *     summary: Bütün inventarları gətir
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Inventar siyahısı
 */
router.get("/", protect, getAllInventory);

/**
 * @swagger
 * /inventory/{id}:
 *   get:
 *     summary: ID üzrə inventar məlumatını gətir
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
 *         description: Inventar tapıldı
 *       404:
 *         description: Inventar tapılmadı
 */
router.get("/:id", protect, getSingleInventory);

/**
 * @swagger
 * /inventory:
 *   post:
 *     summary: Yeni inventar yarat
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - quantity
 *             properties:
 *               name:
 *                 type: string
 *               quantity:
 *                 type: number
 *               price:
 *                 type: number
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Inventar yaradıldı
 *       400:
 *         description: Yanlış məlumat
 */
router.post("/", protect, createInventory);

/**
 * @swagger
 * /inventory/{id}:
 *   patch:
 *     summary: Inventar məlumatını yenilə
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
 *               name:
 *                 type: string
 *               quantity:
 *                 type: number
 *               price:
 *                 type: number
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Inventar yeniləndi
 *       404:
 *         description: Inventar tapılmadı
 */
router.patch("/:id", protect, editInventory);

/**
 * @swagger
 * /inventory/{id}/status:
 *   patch:
 *     summary: Inventarın statusunu dəyiş
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
 *                 example: active
 *     responses:
 *       200:
 *         description: Status uğurla dəyişdirildi
 *       404:
 *         description: Inventar tapılmadı
 */
router.patch("/:id/status", protect, changeInventoryStatus);

export default router;
