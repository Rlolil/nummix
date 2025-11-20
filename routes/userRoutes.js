import express from "express";
import {
  registerUser,
  loginUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  addCalendarDay,
  updateCalendarDay,
  deleteCalendarDay,
  addEvent,
  updateEvent,
  deleteEvent,
  updateFinancialData,
  updateMonthlyData,
  getAllCalendar,
  getAllEvents,
  getEventById,
  getCalendarDayById,
  // Yeni əlavə edilən funksiyalar
  updateSalaryFund,
  updateCompanyTaxes,
  getEmployeeFlowData,
  updateEmployeeFlowData,
  getPaymentOverview,
  addAccountingEntry,
  getAccountingEntries,
  getAccountingBalances,
  getAccountBalance,
  generateAccountingReport,
  createSampleAccountingTransaction,
  updateAccountingEntry,
  deleteAccountingEntry
  
} from "../controllers/userController.js";

const router = express.Router();

// 🔐 Auth Routes
router.post("/register", registerUser);
router.post("/login", loginUser);

// 👥 User CRUD Routes
router.get("/", getAllUsers);
router.get("/:id", getUserById);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);

// 💰 Maliyyə Routes
router.put("/:id/financial", updateFinancialData);
router.put("/:id/monthly", updateMonthlyData);

// 📊 Yeni Əməkhaqqı və Vergi Routes (YENİ ƏLAVƏLƏR)
router.put("/:id/salary-fund", updateSalaryFund);           // Əməkhaqqı fondu yenilə
router.put("/:id/company-taxes", updateCompanyTaxes);       // Şirkət vergilərini yenilə
router.get("/:id/employee-flow", getEmployeeFlowData);      // İşçi axını məlumatları
router.put("/:id/employee-flow", updateEmployeeFlowData);   // İşçi axını məlumatlarını yenilə
router.get("/:id/payment-overview", getPaymentOverview);    // Ödəniş ümumi baxışı

// 📅 Calendar Routes
router.post("/:id/calendar", addCalendarDay);
router.get("/:id/calendar", getAllCalendar);
router.put("/:id/calendar/:dayId", updateCalendarDay);
router.get("/:id/calendar/:dayId", getCalendarDayById);
router.delete("/:id/calendar/:dayId", deleteCalendarDay);

// 🎯 Event Routes
router.post("/:id/calendar/:dayId/events", addEvent);
router.get("/:id/calendar/:dayId/events", getAllEvents);
router.get("/:id/calendar/:dayId/events/:eventId", getEventById);
router.put("/:id/calendar/:dayId/events/:eventId", updateEvent);
router.delete("/:id/calendar/:dayId/events/:eventId", deleteEvent);
// 📊 Mühasibat Routes (YENİ ƏLAVƏLƏR)
router.post("/:id/accounting/entries", addAccountingEntry);                           // Mühasibat yazılışı əlavə et
router.get("/:id/accounting/entries", getAccountingEntries);                         // Bütün yazılışları gətir
router.get("/:id/accounting/balances", getAccountingBalances);                       // Bütün balansları gətir
router.get("/:id/accounting/balances/:accountCode", getAccountBalance);              // Xüsusi hesab balansı
router.get("/:id/accounting/report", generateAccountingReport);                      // Hesabat yarat
router.post("/:id/accounting/sample", createSampleAccountingTransaction);            // Nümunə əməliyyat yarat
router.put("/:id/accounting/entries/:entryId", updateAccountingEntry);               // Yazılışı yenilə
router.delete("/:id/accounting/entries/:entryId", deleteAccountingEntry);            // Yazılışı sil

export default router;