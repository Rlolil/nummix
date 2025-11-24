import express from "express";
import cashAndBankController from "../controllers/CashAndBankController.js";
import protect from "../middlewares/authMiddleware.js";

const router = express.Router();
router.use(protect);

/**
 * @swagger
 * tags:
 *   name: CashAndBank
 *   description: Nağd və bank əməliyyatları
 */

/**
 * @swagger
 * /cash-and-bank/export/excel:
 *   get:
 *     summary: İstifadəçiyə aid bütün əməliyyatları Excel formatında yükləmək
 *     tags: [CashAndBank]
 *     responses:
 *       200:
 *         description: Excel faylı uğurla yaradıldı və yükləndi.
 *         content:
 *           application/vnd.openxmlformats-officedocument.spreadsheetml.sheet:
 *             schema:
 *               type: string
 *               format: binary
 */
router.get("/export/excel", cashAndBankController.exportTransactionsExcel);

/**
 * @swagger
 * /cash-and-bank:
 *   post:
 *     summary: Yeni nağd və bank əməliyyatı yaratmaq
 *     tags: [CashAndBank]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               operationType:
 *                 type: string
 *                 enum: [inflow, outflow]
 *               amount:
 *                 type: number
 *               currency:
 *                 type: string
 *               category:
 *                 type: string
 *               type:
 *                 type: string
 *                 enum: [cash, bank]
 *               account:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Transaction yaradıldı
 */
router.post("/", cashAndBankController.createTransaction);

/**
 * @swagger
 * /cash-and-bank:
 *   get:
 *     summary: İstifadəçiyə aid bütün əməliyyatları gətirmək
 *     tags: [CashAndBank]
 *     responses:
 *       200:
 *         description: Transaction siyahısı
 */
router.get("/", cashAndBankController.getAllTransactions);

/**
 * @swagger
 * /cash-and-bank/{id}:
 *   get:
 *     summary: ID üzrə əməliyyatı gətirmək
 *     tags: [CashAndBank]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Transaction məlumatı
 */
router.get("/:id", cashAndBankController.getTransactionById);

/**
 * @swagger
 * /cash-and-bank/{id}:
 *   put:
 *     summary: Əməliyyat məlumatını yeniləmək
 *     tags: [CashAndBank]
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
 *               operationType:
 *                 type: string
 *               amount:
 *                 type: number
 *               currency:
 *                 type: string
 *               category:
 *                 type: string
 *               type:
 *                 type: string
 *               account:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Transaction yeniləndi
 */
router.put("/:id", cashAndBankController.updateTransaction);

/**
 * @swagger
 * /cash-and-bank/{id}:
 *   delete:
 *     summary: Əməliyyatı silmək
 *     tags: [CashAndBank]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Transaction silindi
 */
router.delete("/:id", cashAndBankController.deleteTransaction);

export default router;
