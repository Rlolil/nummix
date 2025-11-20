import express from "express";

import protect from "../middlewares/authMiddleware.js";

import {
  changeAgreementStatus,
  createAgreement,
  editAgreement,
  getAllAgreements,
  getSingleAgreement,
} from "../controllers/agreementsController.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Agreements
 *   description: Müqavilələrin idarə edilməsi
 */

/**
 * @swagger
 * /api/agreements:
 *   get:
 *     summary: Bütün müqavilələri gətir
 *     tags: [Agreements]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Müqavilələr siyahısı
 */
router.get("/", protect, getAllAgreements);

/**
 * @swagger
 * /api/agreements/{id}:
 *   get:
 *     summary: Müqaviləni ID üzrə gətir
 *     tags: [Agreements]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Müqavilə ID-si
 *     responses:
 *       200:
 *         description: Tapılan müqavilə
 *       404:
 *         description: Tapılmadı
 */
router.get("/:id", protect, getSingleAgreement);

/**
 * @swagger
 * /api/agreements:
 *   post:
 *     summary: Yeni müqavilə yarat
 *     tags: [Agreements]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               customer:
 *                 type: string
 *               amount:
 *                 type: number
 *               status:
 *                 type: string
 *                 enum: [pending, approved, rejected]
 *     responses:
 *       201:
 *         description: Müvəffəqiyyətlə yaradıldı
 */
router.post("/", protect, createAgreement);

/**
 * @swagger
 * /api/agreements/{id}:
 *   patch:
 *     summary: Mövcud müqaviləni redaktə et
 *     tags: [Agreements]
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
 *             description: Dəyişiklik ediləcək sahələr
 *     responses:
 *       200:
 *         description: Yeniləndi
 *       404:
 *         description: Tapılmadı
 */
router.patch("/:id", protect, editAgreement);

/**
 * @swagger
 * /api/agreements/{id}/status:
 *   patch:
 *     summary: Müqavilənin statusunu dəyiş
 *     tags: [Agreements]
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
 *                 enum: [pending, approved, rejected]
 *     responses:
 *       200:
 *         description: Status dəyişdirildi
 */
router.patch("/:id/status", protect, changeAgreementStatus);

export default router;
