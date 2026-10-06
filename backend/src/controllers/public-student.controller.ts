import type { Request, Response } from "express";

import {
  getStudentByNimService,
} from "../services/student.service.js";

export const searchStudentByNimController = async (
  req: Request,
  res: Response,
) => {
  try {
    const nim = String(req.query.nim ?? "").trim();

    if (!nim) {
      res.status(400).json({
        message: "NIM is required.",
      });

      return;
    }

    const student =
      await getStudentByNimService(nim);

    if (!student) {
      res.status(404).json({
        message: "Student not found.",
      });

      return;
    }

    const hasPhotos =
      student.event.photosAvailable &&
      Boolean(student.photo1Key) &&
      Boolean(student.photo2Key);

    if (!hasPhotos) {
      res.status(200).json({
        message: "Photos are not available yet.",
        data: {
          nim: student.nim,
          name: student.name,
          event: {
            id: student.event.id,
            name: student.event.name,
            date: student.event.date,
          },
        },
      });

      return;
    }

    res.status(200).json({
      message: "Student found.",
      data: {
        nim: student.nim,
        name: student.name,
        event: {
          id: student.event.id,
          name: student.event.name,
          date: student.event.date,
        },
        photo1Key: student.photo1Key,
        photo2Key: student.photo2Key,
      },
    });
  } catch (error) {
    console.error(
      "GAGAL SEARCH STUDENT:",
      error,
    );

    res.status(500).json({
      message: "Internal server error.",
    });
  }
};