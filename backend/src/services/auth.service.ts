import argon2 from "argon2";

import { prisma } from "../lib/prisma.js";

export const loginService = async (
  email: string,
  password: string,
) => {
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!user) {
    return null;
  }

  const isPasswordValid = await argon2.verify(
    user.password,
    password,
  );

  if (!isPasswordValid) {
    return null;
  }

  return user;
};