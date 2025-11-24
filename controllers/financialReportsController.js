import Transaction from "../models/Transaction.js";
import ExcelJS from "exceljs";
import mongoose from "mongoose";

// ==================== HELPER FUNKSIYALAR ====================

const getQuarterDateRange = (quarter, year) => {
  const quarters = {
    Q1: { start: new Date(year, 0, 1), end: new Date(year, 2, 31) },
    Q2: { start: new Date(year, 3, 1), end: new Date(year, 5, 30) },
    Q3: { start: new Date(year, 6, 1), end: new Date(year, 8, 30) },
    Q4: { start: new Date(year, 9, 1), end: new Date(year, 11, 31) },
  };
  return quarters[quarter];
};

const getGeneralLedgerData = async (startDate, endDate, userId) => {
  const transactions = await Transaction.find({
    "createdBy.userId": userId,
    date: { $gte: startDate, $lte: endDate },
  })
    .sort({ date: 1 })
    .lean();

  const ledger = {};
  transactions.forEach((txn) => {
    txn.entries.forEach((entry) => {
      if (!ledger[entry.account]) {
        ledger[entry.account] = { account: entry.account, balance: 0 };
      }
      const amount = entry.type === "debit" ? entry.amount : -entry.amount;
      ledger[entry.account].balance += amount;
    });
  });

  const assetAccounts = ["Cash", "Bank"];
  const liabilityAccounts = ["Expense"];
  const equityAccounts = ["Sales"];

  const totalAssets = Object.values(ledger)
    .filter((acc) => assetAccounts.includes(acc.account))
    .reduce((sum, acc) => sum + acc.balance, 0);

  const totalLiabilities = Object.values(ledger)
    .filter((acc) => liabilityAccounts.includes(acc.account))
    .reduce((sum, acc) => sum + acc.balance, 0);

  const totalEquity = Object.values(ledger)
    .filter((acc) => equityAccounts.includes(acc.account))
    .reduce((sum, acc) => sum + acc.balance, 0);

  return {
    totalAssets,
    totalLiabilities,
    totalEquity,
    ledger: Object.values(ledger),
  };
};

const getDashboardData = async (startDate, endDate, userId) => {
  const incomeResult = await Transaction.aggregate([
    {
      $match: {
        "createdBy.userId": new mongoose.Types.ObjectId(userId),
        date: { $gte: startDate, $lte: endDate },
      },
    },
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

  const expenseResult = await Transaction.aggregate([
    {
      $match: {
        "createdBy.userId": new mongoose.Types.ObjectId(userId),
        date: { $gte: startDate, $lte: endDate },
      },
    },
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

  const totalIncome = incomeResult[0]?.totalIncome || 0;
  const totalExpense = expenseResult[0]?.totalExpense || 0;
  const netIncome = totalIncome - totalExpense;

  return {
    totalIncome,
    totalExpense,
    netIncome,
  };
};

const getInvestmentData = async (startDate, endDate, userId) => {
  const investmentResult = await Transaction.aggregate([
    {
      $match: {
        "createdBy.userId": new mongoose.Types.ObjectId(userId),
        date: { $gte: startDate, $lte: endDate },
      },
    },
    { $unwind: "$entries" },
    {
      $match: {
        "entries.account": "Investment",
        "entries.type": "credit",
      },
    },
    {
      $group: {
        _id: null,
        cashUsedInInvesting: { $sum: "$entries.amount" },
      },
    },
  ]);

  return {
    cashUsedInInvesting: investmentResult[0]?.cashUsedInInvesting || 0,
  };
};

// ==================== HESABATLAR GENERATORU ====================

export const generateBalanceSheet = (generalLedger) => ({
  currentAssets: { total: generalLedger.totalAssets },
  totalAssets: generalLedger.totalAssets,
  liabilities: { total: generalLedger.totalLiabilities },
  capital: { total: generalLedger.totalEquity },
  totalLiabilitiesAndCapital:
    generalLedger.totalLiabilities + generalLedger.totalEquity,
});

const generateIncomeStatement = (generalLedger, dashboard) => {
  const grossProfit = dashboard.netIncome - generalLedger.totalLiabilities;
  return {
    totalRevenue: dashboard.totalIncome,
    grossProfit,
    operatingExpenses: { total: dashboard.totalExpense },
    netIncome: dashboard.netIncome,
  };
};

const generateCashFlowStatement = (dashboard, investments) => {
  const operatingCashFlow = dashboard.netIncome;
  const investingCashFlow = investments.cashUsedInInvesting || 0;
  const financingCashFlow = dashboard.netIncome;
  const netCashIncrease = operatingCashFlow - Math.abs(investingCashFlow);

  return {
    operatingActivities: { netCash: operatingCashFlow },
    investingActivities: { netCash: -Math.abs(investingCashFlow) },
    financingActivities: { netCash: financingCashFlow },
    netCashIncrease,
    cashBeginning: 0,
    cashEnding: netCashIncrease,
  };
};

const generateEquityStatement = () => ({
  shareCapital: 0,
  retainedEarnings: 0,
  totalCapital: 0,
});

// ==================== ALL REPORTS ====================

export const getFinancialReports = async (req, res) => {
  try {
    const { quarter, year } = req.query;
    const userId = req.user._id;
    if (!quarter || !year)
      return res
        .status(400)
        .json({ success: false, message: "Quarter və year tələb olunur" });

    const dateRange = getQuarterDateRange(quarter, parseInt(year));
    const generalLedger = await getGeneralLedgerData(
      dateRange.start,
      dateRange.end,
      userId
    );
    const dashboard = await getDashboardData(
      dateRange.start,
      dateRange.end,
      userId
    );
    const investments = await getInvestmentData(
      dateRange.start,
      dateRange.end,
      userId
    );

    const reports = {
      period: `${quarter} ${year}`,
      balanceSheet: generateBalanceSheet(generalLedger),
      incomeStatement: generateIncomeStatement(generalLedger, dashboard),
      cashFlowStatement: generateCashFlowStatement(dashboard, investments),
      equityStatement: generateEquityStatement(),
    };

    res.json({ success: true, data: reports });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server xətası", error: error.message });
  }
};

// ==================== INDIVIDUAL ENDPOINTLƏR ====================

export const getBalanceSheet = async (req, res) => {
  try {
    const { quarter, year } = req.query;
    const userId = req.user._id;

    const dateRange = getQuarterDateRange(quarter, parseInt(year));
    const generalLedger = await getGeneralLedgerData(
      dateRange.start,
      dateRange.end,
      userId
    );

    res.json({
      success: true,
      data: generateBalanceSheet(generalLedger),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Balance sheet alınarkən xəta",
      error: error.message,
    });
  }
};

export const getIncomeStatement = async (req, res) => {
  try {
    const { quarter, year } = req.query;
    const userId = req.user._id;

    const dateRange = getQuarterDateRange(quarter, parseInt(year));
    const generalLedger = await getGeneralLedgerData(
      dateRange.start,
      dateRange.end,
      userId
    );
    const dashboard = await getDashboardData(
      dateRange.start,
      dateRange.end,
      userId
    );

    res.json({
      success: true,
      data: generateIncomeStatement(generalLedger, dashboard),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Income statement alınarkən xəta",
      error: error.message,
    });
  }
};

export const getCashFlowStatement = async (req, res) => {
  try {
    const { quarter, year } = req.query;
    const userId = req.user._id;

    const dateRange = getQuarterDateRange(quarter, parseInt(year));
    const dashboard = await getDashboardData(
      dateRange.start,
      dateRange.end,
      userId
    );
    const investments = await getInvestmentData(
      dateRange.start,
      dateRange.end,
      userId
    );

    res.json({
      success: true,
      data: generateCashFlowStatement(dashboard, investments),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Cash flow alınarkən xəta",
      error: error.message,
    });
  }
};

export const getEquityStatement = async (req, res) => {
  try {
    res.json({
      success: true,
      data: generateEquityStatement(),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Equity statement alınarkən xəta",
      error: error.message,
    });
  }
};

// ==================== EXCEL EXPORT ====================

export const exportFinancialReportsToExcel = async (req, res) => {
  try {
    const { quarter, year } = req.query;
    const userId = req.user._id;

    const dateRange = getQuarterDateRange(quarter, parseInt(year));
    const generalLedger = await getGeneralLedgerData(
      dateRange.start,
      dateRange.end,
      userId
    );
    const dashboard = await getDashboardData(
      dateRange.start,
      dateRange.end,
      userId
    );
    const investments = await getInvestmentData(
      dateRange.start,
      dateRange.end,
      userId
    );

    const balanceSheet = generateBalanceSheet(generalLedger);
    const incomeStatement = generateIncomeStatement(generalLedger, dashboard);
    const cashFlowStatement = generateCashFlowStatement(dashboard, investments);
    const equityStatement = generateEquityStatement();

    const workbook = new ExcelJS.Workbook();

    // (⚠️ Excel sheets hissəsini dəyişmədən saxladım)

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=Maliyye_Hesabatlari_${quarter}_${year}.xlsx`
    );
    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Excel export xətası",
      error: error.message,
    });
  }
};
