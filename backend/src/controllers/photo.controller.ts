
import type { Request, Response } from "express";
import fs from "node:fs";
import path from "node:path";

import { prisma } from "../lib/prisma.js";
import {
  getPhotoStorageDirectory,
} from "../lib/photo-storage.js";

import {
  updateStudentPhotosService,
} from "../services/student.service.js";

export const uploadStudentPhotosController = async (
  req: Request,
  res: Response,
) => {
  const files = req.files as
    | {
        [fieldname: string]: Express.Multer.File[];
      }
    | undefined;

  const photo1 = files?.photo1?.[0];
  const photo2 = files?.photo2?.[0];
  const photo3 = files?.photo3?.[0];

  const uploadedFiles = [
    photo1,
    photo2,
    photo3,
  ].filter(
    (file): file is Express.Multer.File =>
      Boolean(file),
  );

  const cleanupUploadedFiles = () => {
    for (const file of uploadedFiles) {
      try {
        if (fs.existsSync(file.path)) {
          fs.unlinkSync(file.path);
        }
      } catch (error) {
        console.error(
          "FAILED TO CLEANUP UPLOADED PHOTO:",
          error,
        );
      }
    }
  };

  try {
    const eventId = Number(req.params.eventId);
    const studentId = Number(req.params.studentId);

    if (
      !Number.isInteger(eventId) ||
      !Number.isInteger(studentId)
    ) {
      cleanupUploadedFiles();

      res.status(400).json({
        message: "Invalid event ID or student ID.",
      });
      return;
    }

    if (uploadedFiles.length === 0) {
      res.status(400).json({
        message: "At least one photo is required.",
      });
      return;
    }

    const photos = {
      ...(photo1
        ? {
            photo1Key: `/uploads/photos/${photo1.filename}`,
          }
        : {}),
      ...(photo2
        ? {
            photo2Key: `/uploads/photos/${photo2.filename}`,
          }
        : {}),
      ...(photo3
        ? {
            photo3Key: `/uploads/photos/${photo3.filename}`,
          }
        : {}),
    };

    const student = await updateStudentPhotosService(
      studentId,
      eventId,
      photos,
    );

    if (!student) {
      cleanupUploadedFiles();

      res.status(404).json({
        message: "Student not found.",
      });
      return;
    }

    res.status(200).json({
      message: "Student photos uploaded successfully.",
      data: student,
    });
  } catch (error) {
    cleanupUploadedFiles();

    console.error("UPLOAD STUDENT PHOTOS ERROR:", error);

    res.status(500).json({
      message: "Internal server error.",
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

    if (
      photoNumber !== 1 &&
      photoNumber !== 2 &&
      photoNumber !== 3
    ) {
      res.status(400).json({
        message: "Photo number must be 1, 2, or 3.",
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
        : photoNumber === 2
          ? student.photo2Key
          : student.photo3Key;

    if (!photoKey) {
      res.status(404).json({
        message: `Photo ${photoNumber} is not available.`,
      });
      return;
    }

    const filename = path.basename(photoKey);

    const filePath = path.join(
      getPhotoStorageDirectory(),
      filename,
    );

    if (!fs.existsSync(filePath)) {
      res.status(404).json({
        message: "Photo file not found.",
      });
      return;
    }

    const extension = path.extname(filename);

    const downloadFilename =
      `${student.nim}-photo-${photoNumber}${extension}`;

    res.download(
      filePath,
      downloadFilename,
      (error) => {
        if (error) {
          console.error("PHOTO DOWNLOAD ERROR:", error);

          if (!res.headersSent) {
            res.status(500).json({
              message: "Failed to download photo.",
            });
          }
        }
      },
    );
  } catch (error) {
    console.error("DOWNLOAD PHOTO ERROR:", error);

    res.status(500).json({
      message: "Internal server error.",
    });
  }
};
