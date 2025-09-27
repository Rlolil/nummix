import express from "express";
import { registerUser, loginUser } from "../controllers/userController.js";

const router = express.Router();

// Yeni user qeydiyyatı
router.post("/register", registerUser);

// Mövcud user ilə login
router.post("/login", loginUser);

export default router;
