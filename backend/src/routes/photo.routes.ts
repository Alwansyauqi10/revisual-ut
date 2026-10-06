import { Router } from "express";

import {
  downloadStudentPhotoController,
  uploadStudentPhotosController,
} from "../controllers/photo.controller.js";

import {
  uploadPhotos,
} from "../middleware/upload.middleware.js";

import {
  requireAuth,
} from "../middleware/auth.middleware.js";

const router = Router();

// Upload photos → ADMIN ONLY
router.post(
  "/:eventId/students/:studentId/photos",
  requireAuth,
  uploadPhotos.fields([
    {
      name: "photo1",
      maxCount: 1,
    },
    {
      name: "photo2",
      maxCount: 1,
    },
  ]),
  uploadStudentPhotosController,
);

// Download photo → PUBLIC
router.get(
  "/students/:studentId/photos/:photoNumber/download",
  downloadStudentPhotoController,
);

export default router;