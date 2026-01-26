import prisma from "../../config/prisma";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";

import {
  sendVerificationEmail,
  sendPasswordResetEmail,
} from "../../utils/email";

interface RegisterInput {
  email: string;
  password: string;
  name?: string;
}

export const registerUser = async (data: RegisterInput) => {
  const { email, password, name } = data;

  if (!email || !password) {
    throw new Error("Email and password are required");
  }

  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    throw new Error("User already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const verificationToken = crypto.randomBytes(32).toString("hex");
  const verificationExpiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      name,
      verificationToken,
      verificationExpiry,
      isVerified: false,
    },
  });

  try {
    await sendVerificationEmail(email, verificationToken);
  } catch (err) {
    console.error("Email send failed:", err);
  }

  return {
    id: user.id,
    email: user.email,
    name: user.name,
  };
};

export const loginUser = async (email: string, password: string) => {
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new Error("Invalid email or password");
  }

  if (!user.isVerified) {
    throw new Error("Please verify your email before logging in");
  }

  const isValid = await bcrypt.compare(password, user.password);

  if (!isValid) {
    throw new Error("Invalid email or password");
  }

  const token = jwt.sign(
    { userId: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET as string,
    { expiresIn: "1h" },
  );

  return {
    token,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    },
  };
};

// Forget password
// POST: /auth/forgot-password
export const forgotPassword = async (email: string) => {
  const user = await prisma.user.findUnique({ where: { email } });

  // IMPORTANT: Always return success (avoid email enumeration)
  if (!user) {
    return;
  }

  const token = crypto.randomBytes(32).toString("hex");
  const expiry = new Date(Date.now() + 60 * 60 * 1000);

  await prisma.user.update({
    where: { email },
    data: {
      resetPasswordToken: token,
      resetPasswordExpiry: expiry,
    },
  });

  await sendPasswordResetEmail(email, token);
};

// Reset Password
// POST: /auth/reset-password
export const resetPassword = async (token: string, newPassword: string) => {
  const user = await prisma.user.findFirst({
    where: {
      resetPasswordToken: token,
      resetPasswordExpiry: { gte: new Date() },
    },
  });

  if (!user) {
    throw new Error("Invalid or expired reset token");
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  await prisma.user.update({
    where: { id: user.id },
    data: {
      password: hashedPassword,
      resetPasswordToken: null,
      resetPasswordExpiry: null,
    },
  });
};
