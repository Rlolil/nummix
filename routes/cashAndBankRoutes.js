const express = require("express");
const router = express.Router();
const cashAndBankController = require("../controllers/CashAndBankController");

// CRUD routes
router.post("/", cashAndBankController.createTransaction);
router.get("/", cashAndBankController.getAllTransactions);
router.get("/:id", cashAndBankController.getTransactionById);
router.put("/:id", cashAndBankController.updateTransaction);
router.delete("/:id", cashAndBankController.deleteTransaction);

module.exports = router;
