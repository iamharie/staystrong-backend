import nodemailer from "nodemailer";

export const sendVerificationEmail = async (email: string, token: string) => {
  console.log("📧 [EMAIL] Starting verification email send", {
    to: email,
  });

  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.error("❌ [EMAIL] Missing EMAIL_USER or EMAIL_PASS env vars");
    throw new Error("Email credentials not configured");
  }

  if (!process.env.FRONTEND_URL) {
    console.error("❌ [EMAIL] Missing FRONTEND_URL env var");
    throw new Error("Frontend URL not configured");
  }

  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const link = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;

  try {
    const info = await transporter.sendMail({
      from: `"StayStrong" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Verify your email",
      html: `
        <p>Welcome to StayStrong 💪</p>
        <p>Please verify your email:</p>
        <a href="${link}">Verify Email</a>
        <p>This link expires in 1 hour.</p>
      `,
    });

    console.log("✅ [EMAIL] Verification email sent", {
      to: email,
      messageId: info.messageId,
    });
  } catch (err: any) {
    console.error("❌ [EMAIL] Verification email FAILED", {
      to: email,
      error: err?.message || err,
      code: err?.code,
      response: err?.response,
    });

    // IMPORTANT: rethrow so caller `.catch()` can log
    throw err;
  }
};

export const sendPasswordResetEmail = async (email: string, token: string) => {
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
  const link = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;

  await transporter.sendMail({
    from: `"StayStrong" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Reset your password",
    html: `
      <p>You requested a password reset.</p>
      <a href="${link}">Reset Password</a>
      <p>This link expires in 1 hour.</p>
    `,
  });
};
