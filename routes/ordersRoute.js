import express from "express";

import protect from "../middlewares/authMiddleware.js";

import {
    changeOrderStatus,
    createOrder,
    editOrder,
    getAllOrders,
    getSingleOrder,
} from "../controllers/ordersController.js";

const router = express.Router();

router.get("/", protect, getAllOrders);
router.get("/:id", protect, getSingleOrder);
router.post("/", protect, createOrder);
router.patch("/:id", protect, editOrder);
router.patch("/:id/status", protect, changeOrderStatus);

export default router;
