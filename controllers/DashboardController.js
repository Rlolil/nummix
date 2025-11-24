import Transaction from "../models/Transaction.js";

// --- Dashboard: Ümumi gəlir/xərc/mənfəət ---
export const getDashboardStats = async (req, res) => {
  try {
    const userId = req.user._id;

    // Ümumi gəlir
    const incomeResult = await Transaction.aggregate([
      { $match: { "createdBy.userId": userId } }, // yalnız öz əməliyyatları
      { $unwind: "$entries" },
      {
        $match: {
          "entries.account": "Sales",
          "entries.type": "credit",
        },
      },
      {
        $group: {
          _id: null,
          totalIncome: { $sum: "$entries.amount" },
        },
      },
    ]);

    const totalIncome = incomeResult[0]?.totalIncome || 0;

    // Ümumi xərc
    const expenseResult = await Transaction.aggregate([
      { $match: { "createdBy.userId": userId } },
      { $unwind: "$entries" },
      {
        $match: {
          "entries.account": "Expense",
          "entries.type": "debit",
        },
      },
      {
        $group: {
          _id: null,
          totalExpense: { $sum: "$entries.amount" },
        },
      },
    ]);

    const totalExpense = expenseResult[0]?.totalExpense || 0;
    const netIncome = totalIncome - totalExpense;

    res.json({ totalIncome, totalExpense, netIncome });
  } catch (error) {
    console.error("Dashboard Error:", error);
    res.status(500).json({ message: "Server xətası" });
  }
};

// --- Ümumi aktivlər ---
export const getTotalAssets = async (req, res) => {
  try {
    const userId = req.user._id;
    const assetAccounts = ["Cash", "Bank"];

    const result = await Transaction.aggregate([
      { $match: { "createdBy.userId": userId } },
      { $unwind: "$entries" },
      { $match: { "entries.account": { $in: assetAccounts } } },
      {
        $group: {
          _id: "$entries.account",
          totalDebit: {
            $sum: {
              $cond: [
                { $eq: ["$entries.type", "debit"] },
                "$entries.amount",
                0,
              ],
            },
          },
          totalCredit: {
            $sum: {
              $cond: [
                { $eq: ["$entries.type", "credit"] },
                "$entries.amount",
                0,
              ],
            },
          },
        },
      },
      {
        $project: {
          account: "$_id",
          balance: { $subtract: ["$totalDebit", "$totalCredit"] },
          _id: 0,
        },
      },
    ]);

    const totalAssets = result.reduce((sum, acc) => sum + acc.balance, 0);

    res.json({ totalAssets, breakdown: result });
  } catch (error) {
    console.error("Get Total Assets Error:", error);
    res.status(500).json({ message: "Server xətası" });
  }
};

// --- Son 6 ay gəlir/xərc ---
export const getIncomeExpenseLast6Months = async (req, res) => {
  try {
    const userId = req.user._id;
    const today = new Date();
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(today.getMonth() - 5);

    const data = await Transaction.aggregate([
      { $match: { "createdBy.userId": userId } },
      { $unwind: "$entries" },
      {
        $match: {
          date: { $gte: sixMonthsAgo, $lte: today },
          "entries.account": { $in: ["Sales", "Expense"] },
          $or: [
            { "entries.account": "Sales", "entries.type": "credit" },
            { "entries.account": "Expense", "entries.type": "debit" },
          ],
        },
      },
      {
        $project: {
          month: { $dateToString: { format: "%Y-%m", date: "$date" } },
          amount: "$entries.amount",
          type: "$entries.account",
        },
      },
      {
        $group: {
          _id: "$month",
          income: {
            $sum: { $cond: [{ $eq: ["$type", "Sales"] }, "$amount", 0] },
          },
          expense: {
            $sum: { $cond: [{ $eq: ["$type", "Expense"] }, "$amount", 0] },
          },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.json(
      data.map((d) => ({ month: d._id, income: d.income, expense: d.expense }))
    );
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server xətası" });
  }
};

// --- Son 6 ay mənfəət ---
export const getProfitDynamicsLast6Months = async (req, res) => {
  try {
    const userId = req.user._id;
    const today = new Date();
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(today.getMonth() - 5);

    const data = await Transaction.aggregate([
      { $match: { "createdBy.userId": userId } },
      { $unwind: "$entries" },
      {
        $match: {
          date: { $gte: sixMonthsAgo, $lte: today },
          "entries.account": { $in: ["Sales", "Expense"] },
          $or: [
            { "entries.account": "Sales", "entries.type": "credit" },
            { "entries.account": "Expense", "entries.type": "debit" },
          ],
        },
      },
      {
        $project: {
          month: { $dateToString: { format: "%Y-%m", date: "$date" } },
          amount: "$entries.amount",
          type: "$entries.account",
        },
      },
      {
        $group: {
          _id: "$month",
          profit: {
            $sum: {
              $cond: [
                { $eq: ["$type", "Sales"] },
                "$amount",
                { $multiply: ["$amount", -1] },
              ],
            },
          },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.json(data.map((d) => ({ month: d._id, profit: d.profit })));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server xətası" });
  }
};

// --- Balansın faiz breakdown-u ---
export const getBalanceBreakdownPercentage = async (req, res) => {
  try {
    const userId = req.user._id;
    const assetAccounts = ["Cash", "Bank"];
    const liabilityAccounts = ["Expense"];
    const equityAccounts = ["Sales"];

    const result = await Transaction.aggregate([
      { $match: { "createdBy.userId": userId } },
      { $unwind: "$entries" },
      {
        $match: {
          "entries.account": {
            $in: [...assetAccounts, ...liabilityAccounts, ...equityAccounts],
          },
        },
      },
      {
        $group: {
          _id: "$entries.account",
          totalDebit: {
            $sum: {
              $cond: [
                { $eq: ["$entries.type", "debit"] },
                "$entries.amount",
                0,
              ],
            },
          },
          totalCredit: {
            $sum: {
              $cond: [
                { $eq: ["$entries.type", "credit"] },
                "$entries.amount",
                0,
              ],
            },
          },
        },
      },
      {
        $project: {
          account: "$_id",
          balance: { $subtract: ["$totalDebit", "$totalCredit"] },
          _id: 0,
        },
      },
    ]);

    const totalAssets = result
      .filter((acc) => assetAccounts.includes(acc.account))
      .reduce((sum, acc) => sum + acc.balance, 0);
    const totalLiabilities = result
      .filter((acc) => liabilityAccounts.includes(acc.account))
      .reduce((sum, acc) => sum + acc.balance, 0);
    const totalEquity = result
      .filter((acc) => equityAccounts.includes(acc.account))
      .reduce((sum, acc) => sum + acc.balance, 0);

    const grandTotal = totalAssets + totalLiabilities + totalEquity;
    const breakdown = {
      assets: ((totalAssets / grandTotal) * 100).toFixed(2),
      liabilities: ((totalLiabilities / grandTotal) * 100).toFixed(2),
      equity: ((totalEquity / grandTotal) * 100).toFixed(2),
    };

    res.json({
      totalAssets,
      totalLiabilities,
      totalEquity,
      breakdownPercent: breakdown,
      accountsBreakdown: result,
    });
  } catch (err) {
    console.error("Balance Percentage Error:", err);
    res.status(500).json({ error: "Server xətası" });
  }
};
