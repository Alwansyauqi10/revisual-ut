import { Request, Response } from "express";

import {
  createStudentService,
  deleteStudentService,
  getStudentByIdService,
  getStudentsByEventService,
  updateStudentService,
} from "../services/student.service.js";

export const createStudentController = async (
  req: Request,
  res: Response,
) => {
  try {
    const eventId = Number(req.params.eventId);

    const sequenceNumber = Number(
      req.body.sequenceNumber,
    );

    const { nim, name } = req.body;

    const isAbsent =
      typeof req.body.isAbsent === "boolean"
        ? req.body.isAbsent
        : false;

    if (
      !Number.isInteger(sequenceNumber) ||
      sequenceNumber < 1
    ) {
      res.status(400).json({
        message: "Sequence number must be a positive integer",
      });
      return;
    }

    if (
      typeof nim !== "string" ||
      !nim.trim()
    ) {
      res.status(400).json({
        message: "NIM is required",
      });
      return;
    }

    if (
      typeof name !== "string" ||
      !name.trim()
    ) {
      res.status(400).json({
        message: "Name is required",
      });
      return;
    }

    const student = await createStudentService(
      sequenceNumber,
      nim.trim(),
      name.trim(),
      eventId,
      isAbsent,
    );

    res.status(201).json({
      message: "Student created successfully",
      data: student,
    });
  } catch (error) {
    console.error(error);

    if (
      error &&
      typeof error === "object" &&
      "code" in error
    ) {
      if (error.code === "P2003") {
        res.status(404).json({
          message: "Event not found",
        });
        return;
      }

      if (error.code === "P2002") {
        const target =
          "meta" in error &&
          error.meta &&
          typeof error.meta === "object" &&
          "target" in error.meta
            ? error.meta.target
            : null;

        if (
          Array.isArray(target) &&
          target.includes("sequenceNumber")
        ) {
          res.status(409).json({
            message:
              "Sequence number already exists in this event",
          });
          return;
        }

        res.status(409).json({
          message: "NIM already exists",
        });
        return;
      }
    }

    res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const getStudentsByEventController = async (
  req: Request,
  res: Response,
) => {
  try {
    const eventId = Number(req.params.eventId);

    const search = String(
      req.query.search ?? "",
    ).trim();

    const pageParam = Number(
      req.query.page ?? 1,
    );

    const limitParam = Number(
      req.query.limit ?? 10,
    );

    const page =
      Number.isFinite(pageParam) &&
      pageParam >= 1
        ? Math.floor(pageParam)
        : 1;

    const limit =
      Number.isFinite(limitParam) &&
      limitParam >= 1
        ? Math.min(Math.floor(limitParam), 100)
        : 10;

    const result =
      await getStudentsByEventService(
        eventId,
        search,
        page,
        limit,
      );

    const totalPages =
      result.total === 0
        ? 0
        : Math.ceil(result.total / limit);

    res.status(200).json({
      message: "Students retrieved successfully",
      data: result.students,
      meta: {
        page,
        limit,
        total: result.total,
        totalPages,
      },
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const getStudentByIdController = async (
  req: Request,
  res: Response,
) => {
  try {
    const studentId = Number(
      req.params.studentId,
    );

    const eventId = Number(
      req.params.eventId,
    );

    const student =
      await getStudentByIdService(
        studentId,
        eventId,
      );

    if (!student) {
      res.status(404).json({
        message: "Student not found",
      });
      return;
    }

    res.status(200).json({
      message: "Student retrieved successfully",
      data: student,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const updateStudentController = async (
  req: Request,
  res: Response,
) => {
  try {
    const studentId = Number(
      req.params.studentId,
    );

    const eventId = Number(
      req.params.eventId,
    );

    const sequenceNumber = Number(
      req.body.sequenceNumber,
    );

    const { nim, name } = req.body;

    const isAbsent =
      typeof req.body.isAbsent === "boolean"
        ? req.body.isAbsent
        : undefined;

    if (
      !Number.isInteger(sequenceNumber) ||
      sequenceNumber < 1
    ) {
      res.status(400).json({
        message: "Sequence number must be a positive integer",
      });
      return;
    }

    if (
      typeof nim !== "string" ||
      !nim.trim()
    ) {
      res.status(400).json({
        message: "NIM is required",
      });
      return;
    }

    if (
      typeof name !== "string" ||
      !name.trim()
    ) {
      res.status(400).json({
        message: "Name is required",
      });
      return;
    }

    const student =
      await updateStudentService(
        studentId,
        eventId,
        sequenceNumber,
        nim.trim(),
        name.trim(),
        isAbsent,
      );

    if (!student) {
      res.status(404).json({
        message: "Student not found",
      });
      return;
    }

    res.status(200).json({
      message: "Student updated successfully",
      data: student,
    });
  } catch (error) {
    console.error(error);

    if (
      error &&
      typeof error === "object" &&
      "code" in error
    ) {
      if (error.code === "P2002") {
        const target =
          "meta" in error &&
          error.meta &&
          typeof error.meta === "object" &&
          "target" in error.meta
            ? error.meta.target
            : null;

        if (
          Array.isArray(target) &&
          target.includes("sequenceNumber")
        ) {
          res.status(409).json({
            message:
              "Sequence number already exists in this event",
          });
          return;
        }

        res.status(409).json({
          message: "NIM already exists",
        });
        return;
      }
    }

    res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const deleteStudentController = async (
  req: Request,
  res: Response,
) => {
  try {
    const studentId = Number(
      req.params.studentId,
    );

    const eventId = Number(
      req.params.eventId,
    );

    const student =
      await deleteStudentService(
        studentId,
        eventId,
      );

    if (!student) {
      res.status(404).json({
        message: "Student not found",
      });
      return;
    }

    res.status(200).json({
      message: "Student deleted successfully",
      data: student,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Internal server error",
    });
  }
};