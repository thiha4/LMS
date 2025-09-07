import express from "express";
import { register, verifyOtp, login, logout, getMe, forgotPassword, resetPassword, updatePassword } from "../controllers/authController.js";
import { isAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

router.post("/register", register);
router.post("/verify-otp", verifyOtp);
router.post("/login", login);
router.post("/logout", logout);
router.get("/me", isAuthenticated, getMe);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);
router.put("/update-password", isAuthenticated, updatePassword);

export default router;
