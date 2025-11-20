import express from "express";
import protect from "../middlewares/authMiddleware.js";
import {
  getAllProducts,
  getSingleProduct,
  createProduct,
  editProduct,
  changeProductStatus,
  deleteProduct,
} from "../controllers/productsController.js";

const router = express.Router();

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
 */
router.get("/", protect, getAllProducts);

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
 *       404:
 *         description: Product tapılmadı
 */
router.get("/:id", protect, getSingleProduct);

/**
 * @swagger
 * /products:
 *   post:
 *     summary: Yeni məhsul əlavə et
 *     tags:
 *       - Products
 *     requestBody:
 *       required: true
 *     responses:
 *       201:
 *         description: Product yaradıldı
 */
router.post("/", protect, createProduct);

/**
 * @swagger
 * /products/{id}:
 *   patch:
 *     summary: Məhsulu redaktə et
 *     tags:
 *       - Products
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Product yeniləndi
 */
router.patch("/:id", protect, editProduct);

/**
 * @swagger
 * /products/{id}/status:
 *   patch:
 *     summary: Məhsul statusunu dəyiş
 *     tags:
 *       - Products
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
router.patch("/:id/status", protect, changeProductStatus);

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
 *     responses:
 *       200:
 *         description: Product silindi
 *       404:
 *         description: Product tapılmadı
 */
router.delete("/:id", protect, deleteProduct);

export default router;
