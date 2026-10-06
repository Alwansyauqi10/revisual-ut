import multer from "multer";
import path from "node:path";
import fs from "node:fs";
import type { NextFunction, Request, Response } from "express";

const uploadDirectory = path.resolve(
  process.cwd(),
  "uploads/photos",
);

if (!fs.existsSync(uploadDirectory)) {
  fs.mkdirSync(uploadDirectory, {
    recursive: true,
  });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadDirectory);
  },

  filename: (_req, file, cb) => {
    const extension = path.extname(
      file.originalname,
    );

    const filename = `${Date.now()}-${Math.round(
      Math.random() * 1e9,
    )}${extension}`;

    cb(null, filename);
  },
});

const fileFilter: multer.Options["fileFilter"] = (
  _req,
  file,
  cb,
) => {
  const allowedMimeTypes = [
    "image/jpeg",
    "image/png",
    "image/webp",
  ];

  if (!allowedMimeTypes.includes(file.mimetype)) {
    cb(
      new Error(
        "Only JPG, PNG, and WebP images are allowed.",
      ),
    );

    return;
  }

  cb(null, true);
};

export const uploadPhotos = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024,
    files: 2,
  },
});

export const handleUploadError = (
  error: unknown,
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (error instanceof multer.MulterError) {
    if (error.code === "LIMIT_FILE_SIZE") {
      res.status(400).json({
        message:
          "Each photo must be smaller than 10 MB.",
      });

      return;
    }

    if (error.code === "LIMIT_FILE_COUNT") {
      res.status(400).json({
        message: "Maximum 2 photos are allowed.",
      });

      return;
    }

    if (error.code === "LIMIT_UNEXPECTED_FILE") {
      res.status(400).json({
        message:
          "Unexpected file field. Use photo1 and photo2.",
      });

      return;
    }

    res.status(400).json({
      message: error.message,
    });

    return;
  }

  if (error instanceof Error) {
    res.status(400).json({
      message: error.message,
    });

    return;
  }

  next(error);
};