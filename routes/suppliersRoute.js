import express from "express";
import protect from "../middlewares/authMiddleware.js";
import {
  getAllSuppliers,
  getSingleSupplier,
  createSupplier,
  editSupplier,
  changeSupplierStatus,
} from "../controllers/suppliersController.js";

const router = express.Router();

/**
 * @swagger
 * /suppliers:
 *   get:
 *     summary: Bütün təchizatçıları gətir
 *     tags:
 *       - Suppliers
 *     responses:
 *       200:
 *         description: Suppliers list
 */
router.get("/", protect, getAllSuppliers);

/**
 * @swagger
 * /suppliers/{id}:
 *   get:
 *     summary: ID üzrə təchizatçı məlumatını gətir
 *     tags:
 *       - Suppliers
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Supplier ID
 *     responses:
 *       200:
 *         description: Supplier məlumatı
 *       404:
 *         description: Supplier tapılmadı
 */
router.get("/:id", protect, getSingleSupplier);

/**
 * @swagger
 * /suppliers:
 *   post:
 *     summary: Yeni təchizatçı əlavə et
 *     tags:
 *       - Suppliers
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               phone:
 *                 type: string
 *               address:
 *                 type: string
 *     responses:
 *       201:
 *         description: Supplier yaradıldı
 */
router.post("/", protect, createSupplier);

/**
 * @swagger
 * /suppliers/{id}:
 *   patch:
 *     summary: Təchizatçı məlumatını redaktə et
 *     tags:
 *       - Suppliers
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
 *               email:
 *                 type: string
 *               phone:
 *                 type: string
 *               address:
 *                 type: string
 *     responses:
 *       200:
 *         description: Supplier yeniləndi
 */
router.patch("/:id", protect, editSupplier);

/**
 * @swagger
 * /suppliers/{id}/status:
 *   patch:
 *     summary: Təchizatçı statusunu dəyiş
 *     tags:
 *       - Suppliers
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
router.patch("/:id/status", protect, changeSupplierStatus);

export default router;
