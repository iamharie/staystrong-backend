import { Router } from "express";
import {
  register,
  login,
  verifyEmail,
  forgotPasswordController,
  resetPasswordController,
} from "./auth.controller";

const router = Router();

// POST /auth/register
router.post("/register", register);

// POST /auth/login
router.post("/login", login);

//Email-Verification
router.get("/verify-email", verifyEmail);

//forgot-password
router.post("/forgot-password", forgotPasswordController);

//reset-password
router.post("/reset-password", resetPasswordController);

export default router;
