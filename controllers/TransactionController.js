import Transaction from "../models/Transaction.js";

// Yeni transaction yaratmaq
export const createTransaction = async (req, res) => {
  try {
    const { entries } = req.body;
    const userId = req.user?._id;

    if (!entries || entries.length < 2) {
      return res
        .status(400)
        .json({ message: "Ən azı 2 entry (debit və credit) olmalıdır." });
    }

    const totalDebit = entries
      .filter((e) => e.type === "debit")
      .reduce((s, e) => s + e.amount, 0);
    const totalCredit = entries
      .filter((e) => e.type === "credit")
      .reduce((s, e) => s + e.amount, 0);

    if (totalDebit !== totalCredit) {
      return res
        .status(400)
        .json({ message: "Debit və Credit bərabər olmalıdır." });
    }

    const transaction = new Transaction({
      ...req.body,
      createdBy: userId,
    });
    await transaction.save();

    res.status(201).json({ success: true, data: transaction });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Bütün transaction-ları gətir (istifadəçiyə görə)
export const getAllTransactions = async (req, res) => {
  try {
    const userId = req.user._id;
    const transactions = await Transaction.find({ createdBy: userId }).sort({
      date: -1,
    });
    res.status(200).json({ success: true, data: transactions });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ID üzrə transaction (istifadəçi yalnız özünü görə bilir)
export const getTransactionById = async (req, res) => {
  try {
    const userId = req.user._id;
    const transaction = await Transaction.findOne({
      _id: req.params.id,
      createdBy: userId,
    });
    if (!transaction)
      return res.status(404).json({ message: "Transaction tapılmadı" });
    res.status(200).json({ success: true, data: transaction });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Transaction update (yalnız öz transaction-larını)
export const updateTransaction = async (req, res) => {
  try {
    const { entries } = req.body;
    const userId = req.user._id;

    if (entries) {
      const totalDebit = entries
        .filter((e) => e.type === "debit")
        .reduce((s, e) => s + e.amount, 0);
      const totalCredit = entries
        .filter((e) => e.type === "credit")
        .reduce((s, e) => s + e.amount, 0);

      if (totalDebit !== totalCredit) {
        return res
          .status(400)
          .json({ message: "Debit və Credit bərabər olmalıdır." });
      }
    }

    const transaction = await Transaction.findOneAndUpdate(
      { _id: req.params.id, createdBy: userId },
      req.body,
      { new: true }
    );

    if (!transaction)
      return res.status(404).json({ message: "Transaction tapılmadı" });

    res.status(200).json({ success: true, data: transaction });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Transaction delete (yalnız öz transaction-larını)
export const deleteTransaction = async (req, res) => {
  try {
    const userId = req.user._id;
    const transaction = await Transaction.findOneAndDelete({
      _id: req.params.id,
      createdBy: userId,
    });
    if (!transaction)
      return res.status(404).json({ message: "Transaction tapılmadı" });
    res.status(200).json({ success: true, message: "Transaction silindi" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
