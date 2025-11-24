import CashAndBank from "../models/CashAndBank.js";

// 📊 Ümumi Balans (Kassa + Bank)
const getTotalBalance = async (req, res) => {
  try {
    const transactions = await CashAndBank.find({ createdBy: req.user._id });

    let totalBalance = 0;
    transactions.forEach((transaction) => {
      if (transaction.operationType === "inflow") {
        totalBalance += transaction.amount;
      } else {
        totalBalance -= transaction.amount;
      }
    });

    res.json({ totalBalance });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 💵 Kassa Balansı (Nəğd pul)
const getCashBalance = async (req, res) => {
  try {
    const cashTransactions = await CashAndBank.find({
      type: "cash",
      createdBy: req.user._id,
    });

    let cashBalance = 0;
    cashTransactions.forEach((transaction) => {
      if (transaction.operationType === "inflow") {
        cashBalance += transaction.amount;
      } else {
        cashBalance -= transaction.amount;
      }
    });

    res.json({ cashBalance });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🏦 Bank Balansı
const getBankBalance = async (req, res) => {
  try {
    const bankTransactions = await CashAndBank.find({
      type: "bank",
      createdBy: req.user._id,
    });

    let bankBalance = 0;
    bankTransactions.forEach((transaction) => {
      if (transaction.operationType === "inflow") {
        bankBalance += transaction.amount;
      } else {
        bankBalance -= transaction.amount;
      }
    });

    res.json({ bankBalance });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 📈 Pul Vəsaitlərinin Hərəkəti (Son 6 ay)
const getCashFlow = async (req, res) => {
  try {
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const transactions = await CashAndBank.find({
      createdAt: { $gte: sixMonthsAgo },
      createdBy: req.user._id,
    }).sort({ createdAt: 1 });

    const monthlyData = {};

    transactions.forEach((transaction) => {
      const month = new Date(transaction.createdAt).toLocaleString("az-AZ", {
        month: "short",
        year: "numeric",
      });

      if (!monthlyData[month]) {
        monthlyData[month] = { inflow: 0, outflow: 0 };
      }

      if (transaction.operationType === "inflow") {
        monthlyData[month].inflow += transaction.amount;
      } else {
        monthlyData[month].outflow += transaction.amount;
      }
    });

    const cashFlow = Object.keys(monthlyData).map((month) => ({
      month,
      inflow: monthlyData[month].inflow,
      outflow: monthlyData[month].outflow,
    }));

    res.json({ cashFlow });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🎯 Xərc Bölgüsü (Kateqoriyalara görə)
const getExpenseBreakdown = async (req, res) => {
  try {
    const expenses = await CashAndBank.find({
      operationType: "outflow",
      createdBy: req.user._id,
    });

    const categoryTotals = {};
    let totalExpense = 0;

    expenses.forEach((expense) => {
      if (!categoryTotals[expense.category]) {
        categoryTotals[expense.category] = 0;
      }
      categoryTotals[expense.category] += expense.amount;
      totalExpense += expense.amount;
    });

    const breakdown = Object.keys(categoryTotals).map((category) => ({
      category,
      amount: categoryTotals[category],
      percentage: ((categoryTotals[category] / totalExpense) * 100).toFixed(2),
    }));

    res.json({ breakdown });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 📊 Tam Dashboard Məlumatları (Hamısını bir yerdə)
const getDashboardData = async (req, res) => {
  try {
    const transactions = await CashAndBank.find({ createdBy: req.user._id });

    let totalBalance = 0;
    let cashBalance = 0;
    let bankBalance = 0;

    transactions.forEach((transaction) => {
      const amount =
        transaction.operationType === "inflow"
          ? transaction.amount
          : -transaction.amount;

      totalBalance += amount;

      if (transaction.type === "cash") {
        cashBalance += amount;
      } else {
        bankBalance += amount;
      }
    });

    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const recentTransactions = transactions.filter(
      (t) => new Date(t.createdAt) >= sixMonthsAgo
    );

    const monthlyData = {};
    recentTransactions.forEach((transaction) => {
      const month = new Date(transaction.createdAt).toLocaleString("az-AZ", {
        month: "short",
      });

      if (!monthlyData[month]) {
        monthlyData[month] = { inflow: 0, outflow: 0 };
      }

      if (transaction.operationType === "inflow") {
        monthlyData[month].inflow += transaction.amount;
      } else {
        monthlyData[month].outflow += transaction.amount;
      }
    });

    const cashFlow = Object.keys(monthlyData).map((month) => ({
      month,
      gelir: monthlyData[month].inflow,
      xerc: monthlyData[month].outflow,
    }));

    const expenses = transactions.filter((t) => t.operationType === "outflow");
    const categoryTotals = {};
    let totalExpense = 0;

    expenses.forEach((expense) => {
      if (!categoryTotals[expense.category]) {
        categoryTotals[expense.category] = 0;
      }
      categoryTotals[expense.category] += expense.amount;
      totalExpense += expense.amount;
    });

    const expenseBreakdown = Object.keys(categoryTotals).map((category) => ({
      category,
      amount: categoryTotals[category],
      percentage: parseFloat(
        ((categoryTotals[category] / totalExpense) * 100).toFixed(2)
      ),
    }));

    res.json({
      totalBalance,
      cashBalance,
      bankBalance,
      cashFlow,
      expenseBreakdown,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export default {
  getTotalBalance,
  getCashBalance,
  getBankBalance,
  getCashFlow,
  getExpenseBreakdown,
  getDashboardData,
};
