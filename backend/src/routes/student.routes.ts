import { Router } from "express";

import {
  createStudentController,
  deleteStudentController,
  getStudentByIdController,
  getStudentsByEventController,
  updateStudentController,
} from "../controllers/student.controller.js";

import { requireAuth } from "../middleware/auth.middleware.js";

const router = Router();

// Create student
router.post(
  "/:eventId/students",
  requireAuth,
  createStudentController,
);

// Get students by event
router.get(
  "/:eventId/students",
  requireAuth,
  getStudentsByEventController,
);

// Get student detail
router.get(
  "/:eventId/students/:studentId",
  requireAuth,
  getStudentByIdController,
);

// Update student
router.put(
  "/:eventId/students/:studentId",
  requireAuth,
  updateStudentController,
);

// Delete student
router.delete(
  "/:eventId/students/:studentId",
  requireAuth,
  deleteStudentController,
);

export default router;