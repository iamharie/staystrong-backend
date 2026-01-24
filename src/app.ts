import express from "express";
import cors from "cors";
import prisma from "./config/prisma";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => {
  res.status(200).json({
    status: "OK",
    service: "staystrong-backend",
  });
});

app.get("/users", async (_req, res) => {
  const users = await prisma.user.findMany();
  res.json(users);
});

export default app;
