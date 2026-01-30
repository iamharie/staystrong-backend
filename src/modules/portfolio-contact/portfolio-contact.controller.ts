import { Request, Response } from "express";
import { createContact } from "./portfolio-contact.service";

export const submitContact = async (req: Request, res: Response) => {
  try {
    const contact = await createContact(req.body);
    res.status(201).json({
      message: "Thank you for reaching out. We will get back to you soon.",
      contact,
    });
  } catch (error: any) {
    res.status(400).json({
      message: error.message || "Failed to submit contact form",
    });
  }
};
