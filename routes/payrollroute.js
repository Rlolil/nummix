import express from "express";
import {
  calculateTaxes,
  getCalculationExamples,
  calculateBulkTaxes
} from "../controllers/payrollController.js";

const router = express.Router();

// 💰 Vergi Hesablamaları Routes
router.post("/calculate", calculateTaxes);
router.get("/examples", getCalculationExamples);
router.post("/calculate-bulk", calculateBulkTaxes);

export default router;