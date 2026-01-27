import { Resend } from "resend";

if (!process.env.RESEND_API_KEY) {
  throw new Error("RESEND_API_KEY not configured");
}

if (!process.env.FRONTEND_URL) {
  throw new Error("FRONTEND_URL not configured");
}

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendVerificationEmail = async (email: string, token: string) => {
  const link = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;

  try {
    const result = await resend.emails.send({
      from: "StayStrong <noreply@staystrongbyhari.com>",
      to: email,
      subject: "Verify your email",
      text: `Verify your email: ${link}`,
      html: `
        <p>Welcome to StayStrong 💪</p>
        <p>Please verify your email:</p>
        <a href="${link}">Verify Email</a>
        <p>This link expires in 1 hour.</p>
      `,
    });

    console.log("✅ [EMAIL] Verification email sent", {
      to: email,
      id: result?.data?.id,
    });
  } catch (error: any) {
    console.error("❌ [EMAIL] Verification email failed", {
      to: email,
      error: error?.message || error,
    });
  }
};

export const sendPasswordResetEmail = async (email: string, token: string) => {
  const link = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;

  try {
    const result = await resend.emails.send({
      from: "StayStrong <noreply@staystrongbyhari.com>",
      to: email,
      subject: "Reset your password",
      text: `Reset your password: ${link}`,
      html: `
        <p>You requested a password reset.</p>
        <a href="${link}">Reset Password</a>
        <p>This link expires in 1 hour.</p>
      `,
    });

    console.log("✅ [EMAIL] Password reset email sent", {
      to: email,
      id: result?.data?.id,
    });
  } catch (error: any) {
    console.error("❌ [EMAIL] Password reset email failed", {
      to: email,
      error: error?.message || error,
    });
  }
};
