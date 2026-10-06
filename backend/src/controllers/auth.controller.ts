import type { Request, Response } from "express";
import jwt from "jsonwebtoken";

import { loginService } from "../services/auth.service.js";

export const loginController = async (
  req: Request,
  res: Response,
) => {
  try {
    const email = String(
      req.body.email ?? "",
    )
      .trim()
      .toLowerCase();

    const password = String(
      req.body.password ?? "",
    );

    if (!email || !password) {
      res.status(400).json({
        message: "Email and password are required.",
      });

      return;
    }

    const user = await loginService(
      email,
      password,
    );

    if (!user) {
      res.status(401).json({
        message: "Invalid email or password.",
      });

      return;
    }

    const secret = process.env.JWT_SECRET;

    if (!secret) {
      console.error(
        "JWT_SECRET is not configured.",
      );

      res.status(500).json({
        message: "Server configuration error.",
      });

      return;
    }

    const token = jwt.sign(
      {
        sub: user.id,
        email: user.email,
        role: user.role,
      },
      secret,
      {
        expiresIn: "1d",
      },
    );

    res.status(200).json({
      message: "Login successful.",
      data: {
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      },
    });
  } catch (error) {
    console.error(
      "LOGIN ERROR:",
      error,
    );

    res.status(500).json({
      message: "Internal server error.",
    });
  }
};