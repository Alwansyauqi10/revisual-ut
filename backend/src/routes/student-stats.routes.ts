import {
  Router,
} from "express";

import {
  getStudentStatsController,
} from "../controllers/student-stats.controller.js";

const router =
  Router();

router.get(
  "/:eventId/students/stats",
  getStudentStatsController,
);

export default router;