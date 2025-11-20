import express from "express";
import cashAndBankController from "../controllers/CashAndBankController.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: CashAndBank
 *   description: Nağd və bank əməliyyatları
 */

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
 *               account:
 *                 type: string
 *                 enum: [Cash, Bank]
 *               type:
 *                 type: string
 *                 enum: [debit, credit]
 *               amount:
 *                 type: number
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
 *     summary: Bütün əməliyyatları gətirmək
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
 *     summary: ID üzrə əməliyyat məlumatını gətirmək
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
 *     summary: Əməliyyatı yeniləmək
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
 *               account:
 *                 type: string
 *                 enum: [Cash, Bank]
 *               type:
 *                 type: string
 *                 enum: [debit, credit]
 *               amount:
 *                 type: number
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
