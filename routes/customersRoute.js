import express from "express";

import protect from "../middlewares/authMiddleware.js";

import {
  changeCustomerStatus,
  createCustomer,
  getAllCustomers,
  getSingleCustomer,
} from "../controllers/customersController.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Customers
 *   description: Müştəri idarəetməsi
 */

/**
 * @swagger
 * /api/customers:
 *   get:
 *     summary: Bütün müştəriləri gətir
 *     tags: [Customers]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Müştərilərin siyahısı
 */
router.get("/", protect, getAllCustomers);

/**
 * @swagger
 * /api/customers/{id}:
 *   get:
 *     summary: Müştərini ID üzrə gətir
 *     tags: [Customers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Müştəri ID-si
 *     responses:
 *       200:
 *         description: Tapılmış müştəri
 *       404:
 *         description: Müştəri tapılmadı
 */
router.get("/:id", protect, getSingleCustomer);

/**
 * @swagger
 * /api/customers:
 *   post:
 *     summary: Yeni müştəri yarat
 *     tags: [Customers]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - fullName
 *               - phone
 *             properties:
 *               fullName:
 *                 type: string
 *               phone:
 *                 type: string
 *               email:
 *                 type: string
 *               address:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [active, inactive]
 *     responses:
 *       201:
 *         description: Müştəri yaradıldı
 */
router.post("/", protect, createCustomer);

/**
 * @swagger
 * /api/customers/{id}/status:
 *   patch:
 *     summary: Müştərinin statusunu dəyiş
 *     tags: [Customers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Müştəri ID-si
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [active, inactive]
 *     responses:
 *       200:
 *         description: Status uğurla dəyişdirildi
 *       404:
 *         description: Müştəri tapılmadı
 */
router.patch("/:id/status", protect, changeCustomerStatus);

export default router;
