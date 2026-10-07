import "dotenv/config";

import argon2 from "argon2";

import { prisma } from "../lib/prisma.js";

const name = "Admin Salsa";
const email = "salsa@revisualproduction.com";
const password = "salsa123";

const createAdmin = async () => {
  try {
    const hashedPassword =
      await argon2.hash(password);

    const existingUser =
      await prisma.user.findUnique({
        where: {
          email,
        },
      });

    if (existingUser) {
      await prisma.user.update({
        where: {
          id: existingUser.id,
        },
        data: {
          name,
          password: hashedPassword,
          role: "SUPER_ADMIN",
        },
      });

      console.log(
        "Admin account updated.",
      );
    } else {
      await prisma.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
          role: "SUPER_ADMIN",
        },
      });

      console.log(
        "Admin account created.",
      );
    }

    console.log("");
    console.log(
      "Email:",
      email,
    );
    console.log(
      "Password:",
      password,
    );
  } catch (error) {
    console.error(
      "FAILED TO CREATE ADMIN:",
      error,
    );
  } finally {
    await prisma.$disconnect();
  }
};

createAdmin();