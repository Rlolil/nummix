import express from "express";
import protect from "../middlewares/authMiddleware.js";
import {
  getAllSupplierPayments,
  getSingleSupplierPayment,
  createSupplierPayment,
  editSupplierPayment,
  changeSupplierPaymentStatus,
} from "../controllers/supplierPaymentsController.js";

const router = express.Router();

/**
 * @swagger
 * /supplier-payments:
 *   get:
 *     summary: Bütün təchizatçı ödənişlərini gətir
 *     tags:
 *       - SupplierPayments
 *     responses:
 *       200:
 *         description: SupplierPayments list
 */
router.get("/", protect, getAllSupplierPayments);

/**
 * @swagger
 * /supplier-payments/{id}:
 *   get:
 *     summary: ID üzrə təchizatçı ödənişini gətir
 *     tags:
 *       - SupplierPayments
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: SupplierPayment ID
 *     responses:
 *       200:
 *         description: SupplierPayment məlumatı
 *       404:
 *         description: SupplierPayment tapılmadı
 */
router.get("/:id", protect, getSingleSupplierPayment);

/**
 * @swagger
 * /supplier-payments:
 *   post:
 *     summary: Yeni təchizatçı ödənişi əlavə et
 *     tags:
 *       - SupplierPayments
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               supplierId:
 *                 type: string
 *               amount:
 *                 type: number
 *               date:
 *                 type: string
 *                 format: date
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: SupplierPayment yaradıldı
 */
router.post("/", protect, createSupplierPayment);

/**
 * @swagger
 * /supplier-payments/{id}:
 *   patch:
 *     summary: Təchizatçı ödənişini redaktə et
 *     tags:
 *       - SupplierPayments
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
 *               supplierId:
 *                 type: string
 *               amount:
 *                 type: number
 *               date:
 *                 type: string
 *                 format: date
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: SupplierPayment yeniləndi
 */
router.patch("/:id", protect, editSupplierPayment);

/**
 * @swagger
 * /supplier-payments/{id}/status:
 *   patch:
 *     summary: Təchizatçı ödənişinin statusunu dəyiş
 *     tags:
 *       - SupplierPayments
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
router.patch("/:id/status", protect, changeSupplierPaymentStatus);

export default router;
