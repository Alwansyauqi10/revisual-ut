import { Request, Response } from "express";
import {
  createEventService,
  getEventsService,
  getEventByIdService,
  updateEventService,
} from "../services/event.service.js";

export const createEventController = async (
  req: Request,
  res: Response,
) => {
  try {
    const { name, date } = req.body;

    const event = await createEventService(
      name,
      new Date(date),
    );

    res.status(201).json({
      message: "Event created successfully",
      data: event,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const getEventsController = async (
  req: Request,
  res: Response,
) => {
  try {
    const search =
      typeof req.query.search === "string"
        ? req.query.search.trim()
        : "";

    const pageParam =
      typeof req.query.page === "string"
        ? Number(req.query.page)
        : 1;

    const limitParam =
      typeof req.query.limit === "string"
        ? Number(req.query.limit)
        : 5;

    const page = Math.max(
      Number.isFinite(pageParam)
        ? pageParam
        : 1,
      1,
    );

    const limit = Math.min(
      Math.max(
        Number.isFinite(limitParam)
          ? limitParam
          : 5,
        1,
      ),
      50,
    );

    const result = await getEventsService(
      search,
      page,
      limit,
    );

    res.status(200).json({
      message: "Events retrieved successfully",
      data: result.events,
      meta: result.meta,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const getEventByIdController = async (
  req: Request,
  res: Response,
) => {
  try {
    const id = Number(req.params.id);

    const event = await getEventByIdService(id);

    if (!event) {
      res.status(404).json({
        message: "Event not found",
      });
      return;
    }

    res.status(200).json({
      message: "Event retrieved successfully",
      data: event,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const updateEventController = async (
  req: Request,
  res: Response,
) => {
  try {
    const id = Number(req.params.id);
    const { name, date } = req.body;

    const event = await updateEventService(
      id,
      name,
      new Date(date),
    );

    res.status(200).json({
      message: "Event updated successfully",
      data: event,
    });
  } catch (error) {
    console.error(error);

    if (
      error &&
      typeof error === "object" &&
      "code" in error &&
      error.code === "P2025"
    ) {
      res.status(404).json({
        message: "Event not found",
      });

      return;
    }

    res.status(500).json({
      message: "Internal server error",
    });
  }
};