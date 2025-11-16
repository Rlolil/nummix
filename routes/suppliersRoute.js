import express from "express";

import protect from "../middlewares/authMiddleware.js";

import {
    changeSupplierStatus,
    createSupplier,
    editSupplier,
    getAllSuppliers,
    getSingleSupplier,
} from "../controllers/suppliersController.js";

const router = express.Router();

router.get("/", protect, getAllSuppliers);
router.get("/:id", protect, getSingleSupplier);
router.post("/", protect, createSupplier);
router.patch("/:id", protect, editSupplier);
router.patch("/:id/status", protect, changeSupplierStatus);

export default router;
