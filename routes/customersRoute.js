import express from "express";

import protect from "../middlewares/authMiddleware.js";

import { changeCustomerStatus, createCustomer, getAllCustomers, getSingleCustomer } from "../controllers/customersController.js";

const router = express.Router();

router.get("/", protect, getAllCustomers);
router.get("/:id", protect, getSingleCustomer);
router.post("/", protect, createCustomer);
router.patch("/:id/status", protect, changeCustomerStatus);

export default router;
