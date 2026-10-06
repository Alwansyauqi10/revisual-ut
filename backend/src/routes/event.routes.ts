import { Router } from "express";

import {
  createEventController,
  getEventByIdController,
  getEventsController,
  updateEventController,
} from "../controllers/event.controller.js";

import {
  requireAuth,
} from "../middleware/auth.middleware.js";

const router = Router();

// Create event
router.post(
  "/",
  requireAuth,
  createEventController,
);

// Get all events
router.get(
  "/",
  requireAuth,
  getEventsController,
);

// Get event detail
router.get(
  "/:id",
  requireAuth,
  getEventByIdController,
);

// Update event
router.put(
  "/:id",
  requireAuth,
  updateEventController,
);

export default router;