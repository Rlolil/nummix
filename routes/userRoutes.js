import express from "express";
import protect from "../middlewares/authMiddleware.js";
import { loginLimiter, otpLimiter } from "../middlewares/rateLimit.js";
import {
  registerUser,
  loginUser,
  getProfile,
  verifyOtp,
  resendOtp,
  forgotPassword,
  resetPassword,
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
} from "../controllers/userController.js";

const router = express.Router();

/**
 * @swagger
 * /users/register:
 *   post:
 *     summary: Yeni user qeydiyyatı
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fullName:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: User qeydiyyatdan keçdi
 */
router.post("/register", registerUser);

/**
 * @swagger
 * /users/login:
 *   post:
 *     summary: Mövcud user ilə login
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login uğurlu oldu
 */
router.post("/login", loginLimiter, loginUser);

/**
 * @swagger
 * /users/profile:
 *   get:
 *     summary: User profilini gətirmək
 *     tags:
 *       - Auth
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profil məlumatları
 */
router.get("/profile", protect, getProfile);

/**
 * @swagger
 * /users/verify-otp:
 *   post:
 *     summary: OTP təsdiqi
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               otp:
 *                 type: string
 *     responses:
 *       200:
 *         description: OTP təsdiqləndi
 */
router.post("/verify-otp", otpLimiter, verifyOtp);

/**
 * @swagger
 * /users/resend-otp:
 *   post:
 *     summary: OTP-nu yenidən göndərmək
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: OTP yenidən göndərildi
 */
router.post("/resend-otp", otpLimiter, resendOtp);

/**
 * @swagger
 * /users/forgot-password:
 *   post:
 *     summary: Şifrəni unutduqda
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: Şifrə bərpası linki göndərildi
 */
router.post("/forgot-password", forgotPassword);

/**
 * @swagger
 * /users/reset-password:
 *   post:
 *     summary: Şifrəni reset etmək
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               token:
 *                 type: string
 *               newPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: Şifrə uğurla dəyişdirildi
 */
router.post("/reset-password", resetPassword);

// 👥 User CRUD Routes
/**
 * @swagger
 * /users:
 *   get:
 *     summary: Bütün istifadəçiləri gətir
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Users list
 */
router.get("/", protect, getAllUsers);

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: ID üzrə istifadəçi məlumatını gətir
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User məlumatı
 *       404:
 *         description: User tapılmadı
 */
router.get("/:id", protect, getUserById);

/**
 * @swagger
 * /users/{id}:
 *   put:
 *     summary: İstifadəçi məlumatını yenilə
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *     responses:
 *       200:
 *         description: User yeniləndi
 */
router.put("/:id", protect, updateUser);

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: İstifadəçini sil
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User silindi
 */
router.delete("/:id", protect, deleteUser);

// 💰 Maliyyə Routes
/**
 * @swagger
 * /users/{id}/financial:
 *   put:
 *     summary: İstifadəçinin maliyyə məlumatlarını yenilə
 *     tags:
 *       - Financial
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               balance:
 *                 type: number
 *               income:
 *                 type: number
 *     responses:
 *       200:
 *         description: Maliyyə məlumatları yeniləndi
 */
router.put("/:id/financial", protect, updateFinancialData);

/**
 * @swagger
 * /users/{id}/monthly:
 *   put:
 *     summary: İstifadəçinin aylıq maliyyə məlumatlarını yenilə
 *     tags:
 *       - Financial
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               monthlyIncome:
 *                 type: number
 *               monthlyExpense:
 *                 type: number
 *     responses:
 *       200:
 *         description: Aylıq məlumat yeniləndi
 */
router.put("/:id/monthly", protect, updateMonthlyData);

// 📅 Calendar Routes
/**
 * @swagger
 * /users/{id}/calendar:
 *   post:
 *     summary: Yeni calendar günü əlavə et
 *     tags:
 *       - Calendar
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *     responses:
 *       201:
 *         description: Calendar günü əlavə edildi
 */
router.post("/:id/calendar", protect, addCalendarDay);

/**
 * @swagger
 * /users/{id}/calendar:
 *   get:
 *     summary: Bütün calendar günlərini gətir
 *     tags:
 *       - Calendar
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Calendar list
 */
router.get("/:id/calendar", protect, getAllCalendar);

/**
 * @swagger
 * /users/{id}/calendar/{dayId}:
 *   put:
 *     summary: Calendar gününü yenilə
 *     tags:
 *       - Calendar
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: dayId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Calendar günü yeniləndi
 */
router.put("/:id/calendar/:dayId", protect, updateCalendarDay);

/**
 * @swagger
 * /users/{id}/calendar/{dayId}:
 *   get:
 *     summary: ID üzrə calendar gününü gətir
 *     tags:
 *       - Calendar
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: dayId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Calendar günü məlumatı
 */
router.get("/:id/calendar/:dayId", protect, getCalendarDayById);

/**
 * @swagger
 * /users/{id}/calendar/{dayId}:
 *   delete:
 *     summary: Calendar gününü sil
 *     tags:
 *       - Calendar
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: dayId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Calendar günü silindi
 */
router.delete("/:id/calendar/:dayId", protect, deleteCalendarDay);

// 🎯 Event Routes
/**
 * @swagger
 * /users/{id}/calendar/{dayId}/events:
 *   post:
 *     summary: Yeni event əlavə et
 *     tags:
 *       - Events
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Event əlavə edildi
 */
router.post("/:id/calendar/:dayId/events", protect, addEvent);

/**
 * @swagger
 * /users/{id}/calendar/{dayId}/events:
 *   get:
 *     summary: Bütün event-ləri gətir
 *     tags:
 *       - Events
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Event list
 */
router.get("/:id/calendar/:dayId/events", protect, getAllEvents);

/**
 * @swagger
 * /users/{id}/calendar/{dayId}/events/{eventId}:
 *   get:
 *     summary: ID üzrə event məlumatını gətir
 *     tags:
 *       - Events
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: eventId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Event məlumatı
 */
router.get("/:id/calendar/:dayId/events/:eventId", protect, getEventById);

/**
 * @swagger
 * /users/{id}/calendar/{dayId}/events/{eventId}:
 *   put:
 *     summary: Event məlumatını yenilə
 *     tags:
 *       - Events
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: eventId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Event yeniləndi
 */
router.put("/:id/calendar/:dayId/events/:eventId", protect, updateEvent);

/**
 * @swagger
 * /users/{id}/calendar/{dayId}/events/{eventId}:
 *   delete:
 *     summary: Event sil
 *     tags:
 *       - Events
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: eventId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Event silindi
 */
router.delete("/:id/calendar/:dayId/events/:eventId", protect, deleteEvent);

export default router;
