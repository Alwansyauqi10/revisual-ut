import { Router } from "express";

import {
  searchStudentByNimController,
} from "../controllers/public-student.controller.js";

const router = Router();

router.get(
  "/search",
  searchStudentByNimController,
);

export default router;