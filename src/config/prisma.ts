import { PrismaClient } from "@prisma/client";
console.log("DATABASE_URL at runtime HARI:", process.env.DATABASE_URL);
const prisma = new PrismaClient({
  errorFormat: "pretty",
});

export default prisma;
