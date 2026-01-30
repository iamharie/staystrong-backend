import prisma from "../../config/prisma";

interface ContactInput {
  name: string;
  email: string;
  message: string;
}

export const createContact = async (data: ContactInput) => {
  const { name, email, message } = data;

  if (!name || !email || !message) {
    throw new Error("Name, email, and message are required");
  }

  const contact = await prisma.portfolioContact.create({
    data: {
      name,
      email,
      message,
    },
  });

  return {
    id: contact.id,
    name: contact.name,
    email: contact.email,
    message: contact.message,
    createdAt: contact.createdAt,
  };
};
