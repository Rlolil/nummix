import express from "express";
import multer from "multer";
import {
  createEmployee,
  getAllEmployees,
  getEmployeeById,
  updateEmployee,
  deleteEmployee,
  getEmployeeImage,
  updateSalary,
  getNotifications,
  getNotificationById,
  addNotification,
  updateNotification,
  deleteNotification,
  clearNotifications,
  getNotificationsByStatus,
  addLeave,
  updateLeave,
  deleteLeave,
  getEmployeeLeaves,
  addAttendance,
  updateAttendance,
  deleteAttendance,
  getEmployeeAttendances,
  getEmployeesByCompany,
  getEmployeesByStatus,
  getEmployeeLeaveById,
  getAttendanceById,
  // Yeni əlavə edilən funksiyalar
  updateEmployeeType,
  getEmployeePayments,
  addEmployeePayment,
  updateEmployeeTaxData,
  calculateEmployeeTaxes
} from "../controllers/employeeController.js";

const router = express.Router();

// Multer configuration for file upload
const storage = multer.memoryStorage();
const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// 👥 Employee CRUD Routes
router.post("/", upload.single("file"), createEmployee);
router.get("/", getAllEmployees);
router.get("/company/:companyId", getEmployeesByCompany);
router.get("/status", getEmployeesByStatus);
router.get("/:id", getEmployeeById);
router.put("/:id", upload.single("file"), updateEmployee);
router.delete("/:id", deleteEmployee);

// 🖼️ Image Routes
router.get("/:id/image", getEmployeeImage);

// 💰 Salary & Tax Routes (YENİ ƏLAVƏLƏR)
router.put("/:id/salary", updateSalary);
router.put("/:id/employee-type", updateEmployeeType);           // İşçi növünü yenilə
router.get("/:id/payments", getEmployeePayments);               // İşçi ödənişlərini gətir
router.post("/:id/payments", addEmployeePayment);               // İşçi ödənişi əlavə et
router.put("/:id/tax-data", updateEmployeeTaxData);             // Vergi məlumatlarını yenilə
router.post("/:id/calculate-taxes", calculateEmployeeTaxes);    // Vergiləri hesabla

// 🔔 Notification Routes
router.get("/:id/notifications", getNotifications);
router.get("/:id/notifications/filter", getNotificationsByStatus);
router.get("/:id/notifications/:notificationId", getNotificationById);
router.post("/:id/notifications", addNotification);
router.put("/:id/notifications/:notificationId", updateNotification);
router.delete("/:id/notifications/:notificationId", deleteNotification);
router.delete("/:id/notifications", clearNotifications);

// 📅 Leave Routes
router.get("/:employeeId/leaves", getEmployeeLeaves);
router.post("/:employeeId/leaves", addLeave);
router.put("/:employeeId/leaves/:leaveId", updateLeave);
router.delete("/:employeeId/leaves/:leaveId", deleteLeave);
router.get("/:employeeId/leaves/:leaveId", getEmployeeLeaveById);

// ⏰ Attendance Routes
router.get("/:employeeId/attendances", getEmployeeAttendances);
router.post("/:employeeId/attendances", addAttendance);
router.put("/:employeeId/attendances/:attendanceId", updateAttendance);
router.get("/:employeeId/attendances/:attendanceId", getAttendanceById);
router.delete("/:employeeId/attendances/:attendanceId", deleteAttendance);

export default router;