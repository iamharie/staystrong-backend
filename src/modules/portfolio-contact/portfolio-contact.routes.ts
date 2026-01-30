import { Router } from "express";
import { submitContact } from "./portfolio-contact.controller";

const router = Router();

// POST /portfolio-contact/submit
router.post("/submit", submitContact);

export default router;
