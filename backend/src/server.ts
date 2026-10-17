
import cors from "cors";
import express from "express";

import { prisma } from "./lib/prisma.js";
import {
  getPhotoStorageDirectory,
} from "./lib/photo-storage.js";

import eventRouter from "./routes/event.routes.js";
import studentRouter from "./routes/student.routes.js";
import photoRouter from "./routes/photo.routes.js";
import publicStudentRouter from "./routes/public-student.routes.js";
import authRouter from "./routes/auth.routes.js";
import bulkImportRouter from "./routes/bulk-import.routes.js";
import studentStatsRouter from "./routes/student-stats.routes.js";

import {
  requireAuth,
} from "./middleware/auth.middleware.js";

import {
  requireAdmin,
} from "./middleware/admin.middleware.js";

const app = express();
const PORT = Number(process.env.PORT) || 8000;

app.use(cors());
app.use(express.json());

/*
=====================================================
PUBLIC AUTH
=====================================================
*/

app.use("/auth", authRouter);

/*
=====================================================
ADMIN API
=====================================================
*/

app.use(
  "/events",
  requireAuth,
  requireAdmin,
  eventRouter,
);

/*
=====================================================
STUDENT STATS
=====================================================
*/

app.use(
  "/events",
  requireAuth,
  requireAdmin,
  studentStatsRouter,
);

/*
=====================================================
STUDENT API
=====================================================
*/

app.use(
  "/events",
  requireAuth,
  requireAdmin,
  studentRouter,
);

app.use(
  "/events",
  requireAuth,
  requireAdmin,
  photoRouter,
);

app.use(
  "/events",
  requireAuth,
  requireAdmin,
  bulkImportRouter,
);

/*
=====================================================
PUBLIC STUDENT SEARCH
=====================================================
*/

app.use("/students", publicStudentRouter);

/*
=====================================================
STATIC PHOTOS
=====================================================
*/

const photoStorageDirectory = getPhotoStorageDirectory();

app.use(
  "/uploads/photos",
  express.static(photoStorageDirectory),
);

/*
=====================================================
ROOT
=====================================================
*/

app.get("/", (_req, res) => {
  res.json({
    message: "Revisual Production API is running",
  });
});

/*
=====================================================
DATABASE TEST
=====================================================
*/

app.get("/test-db", async (_req, res) => {
  try {
    const events = await prisma.event.findMany();

    res.json({
      message: "Database connected",
      data: events,
    });
  } catch (error) {
    console.error("DATABASE TEST ERROR:", error);

    res.status(500).json({
      message: "Database connection failed",
    });
  }
});

/*
=====================================================
SERVER
=====================================================
*/

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(
    `Photo storage directory: ${photoStorageDirectory}`,
  );
});
