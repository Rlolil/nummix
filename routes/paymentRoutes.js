import express from "express";
import {
  createPayment,
  getAllPayments,
  getPaymentStats,
  getNext7DaysSchedule,
} from "../controllers/PaymentController.js";

const router = express.Router();

router.post("/", createPayment);
router.get("/", getAllPayments);
router.get("/stats", getPaymentStats);
router.get("/schedule", getNext7DaysSchedule);

export default router;
