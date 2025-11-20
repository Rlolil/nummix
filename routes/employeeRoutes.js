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
} from "../controllers/employeeController.js";

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 },
});

/**
 * @swagger
 * tags:
 *   name: Employees
 *   description: İşçilərin idarə olunması
 */

/**
 * @swagger
 * /api/employees:
 *   post:
 *     summary: Yeni işçi yarat
 *     tags: [Employees]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               fullName:
 *                 type: string
 *               email:
 *                 type: string
 *               phone:
 *                 type: string
 *               position:
 *                 type: string
 *               salary:
 *                 type: number
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: İşçi yaradıldı
 */
router.post("/", upload.single("file"), createEmployee);

/**
 * @swagger
 * /api/employees:
 *   get:
 *     summary: Bütün işçiləri gətir
 *     tags: [Employees]
 *     responses:
 *       200:
 *         description: İşçilərin siyahısı
 */
router.get("/", getAllEmployees);

/**
 * @swagger
 * /api/employees/company/{companyId}:
 *   get:
 *     summary: Şirkətə görə işçilər
 *     tags: [Employees]
 */
router.get("/company/:companyId", getEmployeesByCompany);

/**
 * @swagger
 * /api/employees/status:
 *   get:
 *     summary: Statusa görə işçilər
 *     tags: [Employees]
 */
router.get("/status", getEmployeesByStatus);

/**
 * @swagger
 * /api/employees/{id}:
 *   get:
 *     summary: İşçini ID-yə görə gətir
 *     tags: [Employees]
 */
router.get("/:id", getEmployeeById);

/**
 * @swagger
 * /api/employees/{id}:
 *   put:
 *     summary: İşçi məlumatlarını yenilə
 *     tags: [Employees]
 */
router.put("/:id", upload.single("file"), updateEmployee);

/**
 * @swagger
 * /api/employees/{id}:
 *   delete:
 *     summary: İşçini sil
 *     tags: [Employees]
 */
router.delete("/:id", deleteEmployee);

/**
 * @swagger
 * /api/employees/{id}/image:
 *   get:
 *     summary: İşçi şəkilini gətir
 *     tags: [Employees]
 */
router.get("/:id/image", getEmployeeImage);

/**
 * @swagger
 * /api/employees/{id}/salary:
 *   put:
 *     summary: İşçinin maaşını yenilə
 *     tags: [Employees]
 */
router.put("/:id/salary", updateSalary);

/* -------------------------- NOTIFICATIONS ---------------------------- */

/**
 * @swagger
 * /api/employees/{id}/notifications:
 *   get:
 *     summary: İşçinin bütün bildirişlərini gətir
 *     tags: [Employees]
 */
router.get("/:id/notifications", getNotifications);

/**
 * @swagger
 * /api/employees/{id}/notifications/filter:
 *   get:
 *     summary: Statusa görə filtirlənmiş bildirişlər
 *     tags: [Employees]
 */
router.get("/:id/notifications/filter", getNotificationsByStatus);

/**
 * @swagger
 * /api/employees/{id}/notifications/{notificationId}:
 *   get:
 *     summary: Xüsusi bildirişi gətir
 *     tags: [Employees]
 */
router.get("/:id/notifications/:notificationId", getNotificationById);

/**
 * @swagger
 * /api/employees/{id}/notifications:
 *   post:
 *     summary: Bildiriş əlavə et
 *     tags: [Employees]
 */
router.post("/:id/notifications", addNotification);

/**
 * @swagger
 * /api/employees/{id}/notifications/{notificationId}:
 *   put:
 *     summary: Bildirişi yenilə
 *     tags: [Employees]
 */
router.put("/:id/notifications/:notificationId", updateNotification);

/**
 * @swagger
 * /api/employees/{id}/notifications/{notificationId}:
 *   delete:
 *     summary: Xüsusi bildirişi sil
 *     tags: [Employees]
 */
router.delete("/:id/notifications/:notificationId", deleteNotification);

/**
 * @swagger
 * /api/employees/{id}/notifications:
 *   delete:
 *     summary: Bütün bildirişləri sil
 *     tags: [Employees]
 */
router.delete("/:id/notifications", clearNotifications);

/* -------------------------- LEAVES (İcazələr) ---------------------------- */

/**
 * @swagger
 * /api/employees/{employeeId}/leaves:
 *   get:
 *     summary: İşçinin icazə tarixçəsi
 *     tags: [Employees]
 */
router.get("/:employeeId/leaves", getEmployeeLeaves);

/**
 * @swagger
 * /api/employees/{employeeId}/leaves:
 *   post:
 *     summary: İşçiyə icazə əlavə et
 *     tags: [Employees]
 */
router.post("/:employeeId/leaves", addLeave);

/**
 * @swagger
 * /api/employees/{employeeId}/leaves/{leaveId}:
 *   put:
 *     summary: İşçi icazəsini yenilə
 *     tags: [Employees]
 */
router.put("/:employeeId/leaves/:leaveId", updateLeave);

/**
 * @swagger
 * /api/employees/{employeeId}/leaves/{leaveId}:
 *   delete:
 *     summary: İcazəni sil
 *     tags: [Employees]
 */
router.delete("/:employeeId/leaves/:leaveId", deleteLeave);

/**
 * @swagger
 * /api/employees/{employeeId}/leaves/{leaveId}:
 *   get:
 *     summary: Xüsusi icazəni ID-yə görə gətir
 *     tags: [Employees]
 */
router.get("/:employeeId/leaves/:leaveId", getEmployeeLeaveById);

/* -------------------------- ATTENDANCE ---------------------------- */

/**
 * @swagger
 * /api/employees/{employeeId}/attendances:
 *   get:
 *     summary: İşçi davamiyyət siyahısı
 *     tags: [Employees]
 */
router.get("/:employeeId/attendances", getEmployeeAttendances);

/**
 * @swagger
 * /api/employees/{employeeId}/attendances:
 *   post:
 *     summary: Yeni davamiyyət qeyd et
 *     tags: [Employees]
 */
router.post("/:employeeId/attendances", addAttendance);

/**
 * @swagger
 * /api/employees/{employeeId}/attendances/{attendanceId}:
 *   put:
 *     summary: Davamiyyəti yenilə
 *     tags: [Employees]
 */
router.put("/:employeeId/attendances/:attendanceId", updateAttendance);

/**
 * @swagger
 * /api/employees/{employeeId}/attendances/{attendanceId}:
 *   get:
 *     summary: Xüsusi davamiyyət qeydini gətir
 *     tags: [Employees]
 */
router.get("/:employeeId/attendances/:attendanceId", getAttendanceById);

/**
 * @swagger
 * /api/employees/{employeeId}/attendances/{attendanceId}:
 *   delete:
 *     summary: Davamiyyət qeydini sil
 *     tags: [Employees]
 */
router.delete("/:employeeId/attendances/:attendanceId", deleteAttendance);

export default router;
