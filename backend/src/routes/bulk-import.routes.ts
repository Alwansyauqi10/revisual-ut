import { Router } from "express";
import multer from "multer";
import path from "node:path";
import fs from "node:fs";

import {
  analyzeBulkImportController,
  importBulkImportController,
  getBulkImportProgressController,
} from "../controllers/bulk-import.controller.js";

const router = Router();

const TEMP_UPLOAD_ROOT = path.resolve(process.cwd(), "uploads", "bulk-import-temp");
if (!fs.existsSync(TEMP_UPLOAD_ROOT)) {
  fs.mkdirSync(TEMP_UPLOAD_ROOT, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, TEMP_UPLOAD_ROOT),
  filename: (_req, file, cb) => {
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1_000_000_000)}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const isZip = file.mimetype === "application/zip" ||
      file.mimetype === "application/x-zip-compressed" ||
      file.originalname.toLowerCase().endsWith(".zip");
    if (!isZip) return cb(new Error("Only ZIP files are allowed."));
    cb(null, true);
  },
});

router.post("/:eventId/analyze", upload.single("file"), analyzeBulkImportController);
router.post("/:eventId/import", importBulkImportController);
router.get("/:eventId/import/:batchId/progress", getBulkImportProgressController);

export default router;
