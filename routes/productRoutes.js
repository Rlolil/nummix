import { Router } from "express";
import {
  deleteProduct,
  getProductById,
  getProducts,
  postProduct,
} from "../controllers/productController.js";

const router = Router();

/**
 * @swagger
 * /products:
 *   get:
 *     summary: Bütün məhsulları gətir
 *     tags:
 *       - Products
 *     responses:
 *       200:
 *         description: Products list
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 */
router.get("/", getProducts);

/**
 * @swagger
 * /products/{id}:
 *   get:
 *     summary: ID üzrə məhsulu gətir
 *     tags:
 *       - Products
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID
 *     responses:
 *       200:
 *         description: Product məlumatı
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       404:
 *         description: Product tapılmadı
 */
router.get("/:id", getProductById);

/**
 * @swagger
 * /products:
 *   post:
 *     summary: Yeni məhsul əlavə et
 *     tags:
 *       - Products
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProductInput'
 *     responses:
 *       201:
 *         description: Product yaradıldı
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 */
router.post("/", postProduct);

/**
 * @swagger
 * /products/{id}:
 *   delete:
 *     summary: ID üzrə məhsulu sil
 *     tags:
 *       - Products
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID
 *     responses:
 *       200:
 *         description: Product silindi
 *       404:
 *         description: Product tapılmadı
 */
router.delete("/:id", deleteProduct);

export default router;
