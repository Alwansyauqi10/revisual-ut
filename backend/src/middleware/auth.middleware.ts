import type {
  NextFunction,
  Request,
  Response,
} from "express";
import jwt from "jsonwebtoken";

interface AuthPayload {
  sub: number;
  email: string;
  role: "SUPER_ADMIN" | "ADMIN" | "USER";
}

export interface AuthenticatedRequest
  extends Request {
  user?: AuthPayload;
}

export const requireAuth = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const authorization =
      req.headers.authorization;

    if (!authorization) {
      res.status(401).json({
        message: "Authentication required.",
      });

      return;
    }

    const [type, token] =
      authorization.split(" ");

    if (
      type !== "Bearer" ||
      !token
    ) {
      res.status(401).json({
        message:
          "Invalid authorization format.",
      });

      return;
    }

    const secret =
      process.env.JWT_SECRET;

    if (!secret) {
      res.status(500).json({
        message:
          "Server configuration error.",
      });

      return;
    }

    const decoded = jwt.verify(
      token,
      secret,
    );

    if (
      typeof decoded === "string" ||
      typeof decoded.sub !== "number" ||
      typeof decoded.email !== "string" ||
      (decoded.role !== "ADMIN" &&
        decoded.role !== "SUPER_ADMIN" &&
        decoded.role !== "USER")
    ) {
      res.status(401).json({
        message: "Invalid token.",
      });

      return;
    }

    req.user = {
      sub: decoded.sub,
      email: decoded.email,
      role: decoded.role,
    };

    next();
  } catch (error) {
    console.error(
      "AUTH ERROR:",
      error,
    );

    res.status(401).json({
      message:
        "Invalid or expired token.",
    });
  }
};