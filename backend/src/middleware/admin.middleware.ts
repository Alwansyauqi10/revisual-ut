import type { Response, NextFunction } from "express";

import type {
  AuthenticatedRequest,
} from "./auth.middleware.js";

export const requireAdmin = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  const role = req.user?.role;

  if (
    role !== "ADMIN" &&
    role !== "SUPER_ADMIN"
  ) {
    res.status(403).json({
      message: "Admin access required.",
    });

    return;
  }

  next();
};