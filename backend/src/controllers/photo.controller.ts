import type { Request, Response } from "express";
import fs from "node:fs";
import path from "node:path";

import { prisma } from "../lib/prisma.js";
import {
  updateStudentPhotosService,
} from "../services/student.service.js";

export const uploadStudentPhotosController = async (
  req: Request,
  res: Response,
) => {
  try {
    const eventId = Number(req.params.eventId);
    const studentId = Number(req.params.studentId);

    const files = req.files as {
      [fieldname: string]: Express.Multer.File[];
    };

    const photo1 = files?.photo1?.[0];
    const photo2 = files?.photo2?.[0];

    if (!photo1 && !photo2) {
      res.status(400).json({
        message: "At least one photo is required.",
      });
      return;
    }

    const photo1Key = photo1
      ? `/uploads/photos/${photo1.filename}`
      : null;

    const photo2Key = photo2
      ? `/uploads/photos/${photo2.filename}`
      : null;

    const student = await updateStudentPhotosService(
      studentId,
      eventId,
      photo1Key,
      photo2Key,
    );

    if (!student) {
      if (photo1) {
        fs.unlinkSync(photo1.path);
      }

      if (photo2) {
        fs.unlinkSync(photo2.path);
      }

      res.status(404).json({
        message: "Student not found.",
      });
      return;
    }

    res.status(200).json({
      message: "Student photos uploaded successfully",
      data: student,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const downloadStudentPhotoController = async (
  req: Request,
  res: Response,
) => {
  try {
    const studentId = Number(req.params.studentId);
    const photoNumber = Number(req.params.photoNumber);

    if (!Number.isInteger(studentId)) {
      res.status(400).json({
        message: "Invalid student ID.",
      });
      return;
    }

    if (photoNumber !== 1 && photoNumber !== 2) {
      res.status(400).json({
        message: "Photo number must be 1 or 2.",
      });
      return;
    }

    const student = await prisma.student.findUnique({
      where: {
        id: studentId,
      },
    });

    if (!student) {
      res.status(404).json({
        message: "Student not found.",
      });
      return;
    }

    const photoKey =
      photoNumber === 1
        ? student.photo1Key
        : student.photo2Key;

    if (!photoKey) {
      res.status(404).json({
        message: `Photo ${photoNumber} is not available.`,
      });
      return;
    }

    const filename = path.basename(photoKey);

    const filePath = path.resolve(
      process.cwd(),
      "uploads/photos",
      filename,
    );

    if (!fs.existsSync(filePath)) {
      res.status(404).json({
        message: "Photo file not found.",
      });
      return;
    }

    const extension = path.extname(filename);

    const downloadFilename = `${student.nim}-photo-${photoNumber}${extension}`;

    res.download(
      filePath,
      downloadFilename,
      (error) => {
        if (error) {
          console.error(
            "PHOTO DOWNLOAD ERROR:",
            error,
          );

          if (!res.headersSent) {
            res.status(500).json({
              message: "Failed to download photo.",
            });
          }
        }
      },
    );
  } catch (error) {
    console.error(
      "DOWNLOAD PHOTO ERROR:",
      error,
    );

    res.status(500).json({
      message: "Internal server error",
    });
  }
};