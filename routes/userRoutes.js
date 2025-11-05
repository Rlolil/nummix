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

export default router;