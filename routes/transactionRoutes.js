import express from "express";
import {
  createTransaction,
  getAllTransactions,
  getTransactionById,
  updateTransaction,
  deleteTransaction,
} from "../controllers/TransactionController.js";

const router = express.Router();

// CRUD endpoints
router.post("/", createTransaction); // Yeni transaction
router.get("/", getAllTransactions); // Bütün transaction-lar
router.get("/:id", getTransactionById); // ID üzrə
router.put("/:id", updateTransaction); // Yeniləmə
router.delete("/:id", deleteTransaction); // Silmə

export default router;
