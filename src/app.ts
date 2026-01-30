import express from "express";
import cors from "cors";
import prisma from "./config/prisma";
import authRoutes from "./modules/auth/auth.routes";
import portfolioContactRoutes from "./modules/portfolio-contact/portfolio-contact.routes";
import { authenticate, authorizeAdmin } from "./middlewares/auth.middleware";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/portfolio-contact", portfolioContactRoutes);

app.get("/health", (_req, res) => {
  res.status(200).json({
    status: "OK",
    service: "staystrong-backend",
  });
});

//Single Unique Profile
app.get("/auth/me", authenticate, async (req, res) => {
  const userId = (req as any).user.userId;
  const users = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      name: true,
      createdAt: true,
    },
  });
  res.json(users);
});

//Admin Profile
app.get("/admin/users", authenticate, authorizeAdmin, async (_req, res) => {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      email: true,
      name: true,
      createdAt: true,
    },
  });

  res.json(users);
});

export default app;
