import Budget from "../models/Budget.js";
import ExcelJS from "exceljs";

// Yeni büdcə planı yaratmaq (Rüblük dəstəklənir)
export const createBudget = async (req, res) => {
  try {
    const { type, category, amount, startDate, period } = req.body;
    const userId = req.user?._id;

    if (!type || !category || !amount || !startDate || !period) {
      return res.status(400).json({ message: "Bütün sahələr tələb olunur" });
    }

    const start = new Date(startDate);
    const year = start.getFullYear();

    // Eyni departament və il üçün təkrar olmasın
    const existingBudget = await Budget.findOne({
      department: type,
      year,
      createdBy: userId,
    });

    if (existingBudget) {
      return res.status(400).json({
        message: "Bu departament üçün bu il artıq büdcə planı mövcuddur.",
      });
    }

    // Rüblük period üçün 3 ayı avtomatik yarat
    let monthlyBudgets = [];

    if (period.toLowerCase() === "rüblük") {
      // Başlanğıc ay indexi (0 = Yanvar)
      const startMonth = start.getMonth();
      // Rüb: başlanğıc ay + 0, 1, 2
      for (let i = 0; i < 3; i++) {
        const monthIndex = startMonth + i;
        const monthName = new Date(year, monthIndex, 1).toLocaleString(
          "default",
          { month: "long" }
        );

        monthlyBudgets.push({
          month: monthName,
          categories: [
            {
              name: category,
              plannedAmount: Number(amount),
              actualAmount: 0,
              difference: Number(amount),
              usageRate: 0,
              status: "within_budget",
            },
          ],
          plannedTotal: Number(amount),
          actualTotal: 0,
          difference: Number(amount),
          usageRate: 0,
        });
      }
    } else {
      // Ayliq və ya digər periodlar üçün sadə nümunə
      const monthName = start.toLocaleString("default", { month: "long" });
      monthlyBudgets.push({
        month: monthName,
        categories: [
          {
            name: category,
            plannedAmount: Number(amount),
            actualAmount: 0,
            difference: Number(amount),
            usageRate: 0,
            status: "within_budget",
          },
        ],
        plannedTotal: Number(amount),
        actualTotal: 0,
        difference: Number(amount),
        usageRate: 0,
      });
    }

    const budget = new Budget({
      department: type,
      year,
      monthlyBudgets,
      createdBy: userId,
    });

    await budget.save();

    res.status(201).json({ message: "Büdcə planı uğurla yaradıldı.", budget });
  } catch (error) {
    console.error("Create Budget Error:", error);
    res.status(500).json({ message: "Server xətası baş verdi." });
  }
};

// Bütün büdcələri gətir (istifadəçiyə görə)
export const getBudgets = async (req, res) => {
  try {
    const userId = req.user._id;
    const budgets = await Budget.find({ createdBy: userId }).sort({
      year: -1,
      department: 1,
    });
    res.status(200).json(budgets);
  } catch (error) {
    console.error("Get Budgets Error:", error);
    res.status(500).json({ message: "Server xətası baş verdi." });
  }
};

// Departament üzrə illik büdcə detalları
export const getBudgetByDepartment = async (req, res) => {
  try {
    const userId = req.user._id;
    const { department, year } = req.params;
    const budget = await Budget.findOne({
      department,
      year,
      createdBy: userId,
    });

    if (!budget) {
      return res
        .status(404)
        .json({ message: "Bu departament üçün büdcə tapılmadı." });
    }

    res.status(200).json(budget);
  } catch (error) {
    console.error("Get Budget By Department Error:", error);
    res.status(500).json({ message: "Server xətası baş verdi." });
  }
};

// Mövcud büdcəni yeniləmək
export const updateBudget = async (req, res) => {
  try {
    const userId = req.user._id;
    const id = req.params.id.trim();
    const { monthlyBudgets } = req.body;

    const budget = await Budget.findOne({ _id: id, createdBy: userId });
    if (!budget) {
      return res.status(404).json({ message: "Büdcə tapılmadı." });
    }

    if (monthlyBudgets) {
      budget.monthlyBudgets = monthlyBudgets;
    }

    await budget.save();

    res.status(200).json({ message: "Büdcə uğurla yeniləndi.", budget });
  } catch (error) {
    console.error("Update Budget Error:", error);
    res.status(500).json({ message: "Server xətası baş verdi." });
  }
};

// Büdcəni silmək
export const deleteBudget = async (req, res) => {
  try {
    const userId = req.user._id;
    const id = req.params.id.trim();
    const budget = await Budget.findOneAndDelete({
      _id: id,
      createdBy: userId,
    });

    if (!budget) {
      return res.status(404).json({ message: "Budget tapılmadı" });
    }

    res.status(200).json({ message: "Budget uğurla silindi" });
  } catch (error) {
    console.error("Delete Budget Error:", error);
    res.status(500).json({ message: "Büdcə silinərkən xətа baş verdi", error });
  }
};

// Ümumi hesabat
export const getBudgetReport = async (req, res) => {
  try {
    const userId = req.user._id;
    const { department, year } = req.query;

    const query = { createdBy: userId };
    if (department) query.department = { $regex: new RegExp(department, "i") };
    if (year) query.year = Number(year);

    const budgets = await Budget.find(query);

    if (!budgets.length) {
      return res.status(404).json({
        message: "No budget data found for this filter",
        totalPlanned: 0,
        totalActual: 0,
        totalDifference: 0,
        totalUsageRate: "0%",
        budgets: [],
      });
    }

    let totalPlanned = 0;
    let totalActual = 0;
    let totalDifference = 0;

    const reportData = budgets.map((budget) => {
      const monthlyData = budget.monthlyBudgets.map((month) => {
        const totalPlannedMonth = month.categories.reduce(
          (sum, c) => sum + c.plannedAmount,
          0
        );
        const totalActualMonth = month.categories.reduce(
          (sum, c) => sum + c.actualAmount,
          0
        );
        const difference = totalActualMonth - totalPlannedMonth;
        const usageRate = (
          (totalActualMonth / totalPlannedMonth) *
          100
        ).toFixed(2);

        totalPlanned += totalPlannedMonth;
        totalActual += totalActualMonth;
        totalDifference += difference;

        return {
          month: month.month,
          totalPlanned: totalPlannedMonth,
          totalActual: totalActualMonth,
          difference,
          usageRate: usageRate + "%",
        };
      });

      return {
        department: budget.department,
        year: budget.year,
        monthlyData,
      };
    });

    const totalUsageRate =
      ((totalActual / totalPlanned) * 100).toFixed(2) + "%";

    res.status(200).json({
      message: "Budget report generated successfully",
      totalPlanned,
      totalActual,
      totalDifference,
      totalUsageRate,
      budgets: reportData,
    });
  } catch (error) {
    console.error("Get Budget Report Error:", error);
    res.status(500).json({ message: "Server error while generating report" });
  }
};

// Excel export
export const exportBudgetToExcel = async (req, res) => {
  try {
    const userId = req.user._id;
    const { department, year } = req.query;

    const query = { createdBy: userId };
    if (department) query.department = { $regex: new RegExp(department, "i") };
    if (year) query.year = Number(year);

    const budgets = await Budget.find(query);

    if (!budgets.length) {
      return res
        .status(404)
        .json({ message: "No budget data found for this filter" });
    }

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Budget Report");

    worksheet.columns = [
      { header: "Department", key: "department", width: 25 },
      { header: "Year", key: "year", width: 10 },
      { header: "Month", key: "month", width: 15 },
      { header: "Category", key: "category", width: 25 },
      { header: "Planned Amount", key: "plannedAmount", width: 18 },
      { header: "Actual Amount", key: "actualAmount", width: 18 },
      { header: "Difference", key: "difference", width: 15 },
      { header: "Usage Rate (%)", key: "usageRate", width: 18 },
      { header: "Status", key: "status", width: 15 },
    ];

    budgets.forEach((budget) => {
      (budget.monthlyBudgets || []).forEach((month) => {
        (month.categories || []).forEach((cat) => {
          worksheet.addRow({
            department: budget.department,
            year: budget.year,
            month: month.month,
            category: cat.name,
            plannedAmount: cat.plannedAmount,
            actualAmount: cat.actualAmount,
            difference: cat.difference,
            usageRate: cat.usageRate ? cat.usageRate.toFixed(2) : "0.00",
            status: cat.status,
          });
        });
      });
    });

    const headerRow = worksheet.getRow(1);
    headerRow.font = { bold: true, color: { argb: "FFFFFFFF" } };
    headerRow.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "4472C4" },
    };
    headerRow.alignment = { vertical: "middle", horizontal: "center" };

    const buffer = await workbook.xlsx.writeBuffer();

    res.setHeader(
      "Content-Disposition",
      `attachment; filename=budget-report-${year || "all"}.xlsx`
    );
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );

    res.send(Buffer.from(buffer));
  } catch (error) {
    console.error("Export Excel Error:", error);
    res
      .status(500)
      .json({ message: "Server xətası baş verdi (Excel export zamanı)" });
  }
};
