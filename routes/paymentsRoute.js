import express from "express";

import protect from "../middlewares/authMiddleware.js";

import { changePaymentStatus, createPayment, editPayment, getALLPayments, getSinglePayment } from "../controllers/paymentsController.js";

const router = express.Router();

router.get("/", protect, getALLPayments);
router.get("/:id", protect, getSinglePayment);
router.post("/", protect, createPayment);
router.patch("/:id", protect, editPayment);
router.patch("/:id/status", protect, changePaymentStatus);

export default router;
