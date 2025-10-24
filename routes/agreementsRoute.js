import express from "express";

import protect from "../middlewares/authMiddleware.js";

import {
    changeAgreementStatus,
    createAgreement,
    editAgreement,
    getAllAgreements,
    getSingleAgreement,
} from "../controllers/agreementsController.js";

const router = express.Router();

router.get("/", protect, getAllAgreements);
router.get("/:id", protect, getSingleAgreement);
router.post("/", protect, createAgreement);
router.patch("/:id", protect, editAgreement);
router.patch("/:id/status", protect, changeAgreementStatus);

export default router;
