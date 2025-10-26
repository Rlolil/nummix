import express from "express";

import protect from "../middlewares/authMiddleware.js";

import {
    changeSupplierPaymentStatus,
    createSupplierPayment,
    editSupplierPayment,
    getAllSupplierPayments,
    getSingleSupplierPayment,
} from "../controllers/supplierPaymentsController.js";

const router = express.Router();

router.get("/", protect, getAllSupplierPayments);
router.get("/:id", protect, getSingleSupplierPayment);
router.post("/", protect, createSupplierPayment);
router.patch("/:id", protect, editSupplierPayment);
router.patch("/:id/status", protect, changeSupplierPaymentStatus);

export default router;
