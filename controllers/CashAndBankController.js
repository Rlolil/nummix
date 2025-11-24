import CashAndBank from "../models/CashAndBank.js";
import ExcelJS from "exceljs";
// Yeni əməliyyat əlavə et
const createTransaction = async (req, res) => {
  try {
    const {
      operationType,
      amount,
      currency,
      category,
      type,
      account,
      description,
    } = req.body;

    const transaction = new CashAndBank({
      operationType,
      amount,
      currency,
      category,
      type,
      account: type === "bank" ? account : undefined,
      description,
      createdBy: req.user._id, // user ID JWT-dən avtomatik gəlir
    });

    await transaction.save();
    res.status(201).json(transaction);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Bütün əməliyyatları götür (yalnız öz user-in əməliyyatları)
const getAllTransactions = async (req, res) => {
  try {
    const transactions = await CashAndBank.find({
      createdBy: req.user._id,
    }).sort({ createdAt: -1 });
    res.status(200).json(transactions);
  } catch (error) {
    res.status(500).json({ message: "Server xətası" });
  }
};

// Tək əməliyyatın detallarını götür (yalnız öz user-in əməliyyatı)
const getTransactionById = async (req, res) => {
  try {
    const transaction = await CashAndBank.findOne({
      _id: req.params.id,
      createdBy: req.user._id,
    });
    if (!transaction)
      return res.status(404).json({ message: "Transaction tapılmadı" });
    res.status(200).json(transaction);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Əməliyyatı update et (yalnız öz user-in əməliyyatı)
const updateTransaction = async (req, res) => {
  try {
    const transaction = await CashAndBank.findOneAndUpdate(
      { _id: req.params.id, createdBy: req.user._id },
      req.body,
      { new: true }
    );
    if (!transaction)
      return res
        .status(404)
        .json({ message: "Transaction tapılmadı və ya icazəniz yoxdur" });
    res.status(200).json(transaction);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Əməliyyatı sil (yalnız öz user-in əməliyyatı)
const deleteTransaction = async (req, res) => {
  try {
    const transaction = await CashAndBank.findOneAndDelete({
      _id: req.params.id,
      createdBy: req.user._id,
    });
    if (!transaction)
      return res
        .status(404)
        .json({ message: "Transaction tapılmadı və ya icazəniz yoxdur" });
    res.status(200).json({ message: "Transaction silindi" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Excel export — yalnız istifadəçiyə aid əməliyyatlar
const exportTransactionsExcel = async (req, res) => {
  try {
    const transactions = await CashAndBank.find({
      createdBy: req.user._id,
    }).sort({ createdAt: -1 });

    if (!transactions.length) {
      return res.status(404).json({ message: "Heç bir əməliyyat tapılmadı" });
    }

    // Excel yarat
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Cash-Bank Report");

    // Sütunlar
    worksheet.columns = [
      { header: "Operation Type", key: "operationType", width: 20 },
      { header: "Amount", key: "amount", width: 15 },
      { header: "Currency", key: "currency", width: 15 },
      { header: "Category", key: "category", width: 20 },
      { header: "Type", key: "type", width: 15 },
      { header: "Account", key: "account", width: 20 },
      { header: "Description", key: "description", width: 30 },
      { header: "Date", key: "createdAt", width: 20 },
    ];

    // Məlumatları əlavə et
    transactions.forEach((t) => {
      worksheet.addRow({
        operationType: t.operationType,
        amount: t.amount,
        currency: t.currency,
        category: t.category,
        type: t.type,
        account: t.account || "-",
        description: t.description,
        createdAt: t.createdAt.toLocaleString(),
      });
    });

    // Header response
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=cash_bank_transactions.xlsx"
    );

    // Fayı göndər
    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    res
      .status(500)
      .json({ message: "Excel export xətası", error: error.message });
  }
};

// 🔹 Default export
export default {
  createTransaction,
  getAllTransactions,
  getTransactionById,
  updateTransaction,
  deleteTransaction,
  exportTransactionsExcel,
};
