import type {
  Request,
  Response,
} from "express";

import fs from "node:fs/promises";

import {
  analyzeBulkImportZipService,
  importBulkImportBatchService,
} from "../services/bulk-import.service.js";

/*
=====================================================
ANALYZE BULK IMPORT
=====================================================
*/

export const analyzeBulkImportController =
  async (
    req: Request,
    res: Response,
  ) => {
    try {
      const eventId =
        Number(req.params.eventId);

      if (
        !Number.isInteger(
          eventId,
        ) ||
        eventId <= 0
      ) {
        return res.status(400).json({
          message:
            "Invalid event ID.",
        });
      }

      const file =
        req.file;

      if (!file) {
        return res.status(400).json({
          message:
            "ZIP file is required.",
        });
      }

      const isZip =
        file.mimetype ===
          "application/zip" ||
        file.mimetype ===
          "application/x-zip-compressed" ||
        file.originalname
          .toLowerCase()
          .endsWith(".zip");

      if (!isZip) {
        await fs.rm(
          file.path,
          {
            force: true,
          },
        );

        return res.status(400).json({
          message:
            "Only ZIP files are allowed.",
        });
      }

      const result =
        await analyzeBulkImportZipService(
          eventId,
          file.path,
        );

      return res.status(200).json({
        message:
          "Bulk import analyzed successfully.",

        data: result,
      });
    } catch (error) {
      console.error(
        "ANALYZE BULK IMPORT ERROR:",
        error,
      );

      if (
        req.file?.path
      ) {
        await fs.rm(
          req.file.path,
          {
            force: true,
          },
        );
      }

      return res.status(500).json({
        message:
          error instanceof Error
            ? error.message
            : "Failed to analyze bulk import.",
      });
    }
  };

/*
=====================================================
APPROVE & IMPORT BULK IMPORT
=====================================================
*/

export const importBulkImportController =
  async (
    req: Request,
    res: Response,
  ) => {
    try {
      const eventId =
        Number(req.params.eventId);

      if (
        !Number.isInteger(
          eventId,
        ) ||
        eventId <= 0
      ) {
        return res.status(400).json({
          message:
            "Invalid event ID.",
        });
      }

      const {
        batchId,
      } = req.body;

      if (
        typeof batchId !==
          "string" ||
        !batchId.trim()
      ) {
        return res.status(400).json({
          message:
            "batchId is required.",
        });
      }

      const result =
        await importBulkImportBatchService(
          eventId,
          batchId.trim(),
        );

      return res.status(200).json({
        message:
          "Bulk import completed successfully.",

        data: result,
      });
    } catch (error) {
      console.error(
        "IMPORT BULK IMPORT ERROR:",
        error,
      );

      return res.status(500).json({
        message:
          error instanceof Error
            ? error.message
            : "Failed to import bulk data.",
      });
    }
  };