import { Request, Response } from "express";
import {
  registerUser,
  loginUser,
  forgotPassword,
  resetPassword,
} from "./auth.service";
import prisma from "../../config/prisma";

export const register = async (req: Request, res: Response) => {
  try {
    const user = await registerUser(req.body);
    res.status(201).json({
      message: "Registration successful. Please verify your email.",
      user,
    });
  } catch (error: any) {
    res.status(400).json({
      message: error.message || "Registration failed",
    });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const data = await loginUser(email, password);
    res.json(data);
  } catch (error: any) {
    res.status(401).json({ message: error.message });
  }
};

//verify email
export const verifyEmail = async (req: Request, res: Response) => {
  const { token } = req.query;

  if (!token) {
    return res.status(400).json({ message: "Token missing" });
  }

  const user = await prisma.user.findFirst({
    where: {
      verificationToken: token as string,
      verificationExpiry: {
        gte: new Date(),
      },
    },
  });

  if (!user) {
    return res.status(400).json({
      message: "Invalid or expired verification token",
    });
  }

  await prisma.user.update({
    where: { id: user.id },
    data: {
      isVerified: true,
      verificationToken: null,
      verificationExpiry: null,
    },
  });

  res.json({ message: "Email verified successfully" });
};

//Password - Reset
export const forgotPasswordController = async (req: Request, res: Response) => {
  const { email } = req.body;
  await forgotPassword(email);
  res.json({
    message: "If an account exists, a password reset email has been sent.",
  });
};

export const resetPasswordController = async (req: Request, res: Response) => {
  const { token, password } = req.body;
  await resetPassword(token, password);
  res.json({ message: "Password reset successfully" });
};
