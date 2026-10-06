import type {
  Request,
  Response,
} from "express";

import {
  getStudentStatsService,
} from "../services/student-stats.service.js";

export const getStudentStatsController =
  async (
    req: Request,
    res: Response,
  ) => {
    try {
      const eventId =
        Number(req.params.eventId);

      if (
        !Number.isInteger(
          eventId,
        ) ||
        eventId <= 0
      ) {
        return res.status(400).json({
          message:
            "Invalid event ID.",
        });
      }

      const stats =
        await getStudentStatsService(
          eventId,
        );

      if (!stats) {
        return res.status(404).json({
          message:
            "Event not found.",
        });
      }

      return res.status(200).json({
        message:
          "Student statistics retrieved successfully.",
        data: stats,
      });
    } catch (error) {
      console.error(
        "GET STUDENT STATS ERROR:",
        error,
      );

      return res.status(500).json({
        message:
          "Failed to retrieve student statistics.",
      });
    }
  };