import fs from "node:fs/promises";
import fsSync from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import unzipper from "unzipper";

import { prisma } from "../lib/prisma.js";

import {
  buildStudentPreview,
  parseStudentFolderName,
  type BulkImportStudentPreview,
} from "../utils/bulk-import-parser.js";

const BULK_IMPORT_ROOT = path.resolve(
  process.cwd(),
  "uploads",
  "bulk-imports",
);

const PHOTO_ROOT = path.resolve(
  process.cwd(),
  "uploads",
  "photos",
);

const MAX_ZIP_SIZE =
  2 * 1024 * 1024 * 1024; // 2 GB

const MAX_STUDENTS = 5000;

const MAX_FILES = 15000;

interface AnalyzeResult {
  batchId: string;

  eventId: number;

  summary: {
    totalStudents: number;
    present: number;
    absent: number;
    photos0: number;
    photos1: number;
    photos2: number;
    moreThan2: number;
    conflicts: number;
    invalid: number;
  };

  students: BulkImportStudentPreview[];

  conflicts: Array<{
    nim: string;
    name: string;
    reason: string;
  }>;

  invalidFolders: Array<{
    folderName: string;
    reason: string;
  }>;
}

/*
=====================================================
DIRECTORY
=====================================================
*/

const ensureBulkImportRoot =
  async () => {
    await fs.mkdir(
      BULK_IMPORT_ROOT,
      {
        recursive: true,
      },
    );
  };

const ensurePhotoRoot =
  async () => {
    await fs.mkdir(
      PHOTO_ROOT,
      {
        recursive: true,
      },
    );
  };

/*
=====================================================
PATH SECURITY
=====================================================
*/

const isPathInside = (
  parentPath: string,
  childPath: string,
) => {
  const relative = path.relative(
    parentPath,
    childPath,
  );

  return (
    relative !== "" &&
    !relative.startsWith("..") &&
    !path.isAbsolute(relative)
  );
};

const getSafeExtractPath = (
  rootPath: string,
  entryPath: string,
) => {
  const normalized =
    entryPath.replaceAll(
      "\\",
      "/",
    );

  const targetPath =
    path.resolve(
      rootPath,
      normalized,
    );

  if (
    targetPath !== rootPath &&
    !isPathInside(
      rootPath,
      targetPath,
    )
  ) {
    throw new Error(
      `Unsafe ZIP entry detected: ${entryPath}`,
    );
  }

  return targetPath;
};

/*
=====================================================
ZIP EXTRACTION
=====================================================
*/

const extractZipSafely = async (
  zipPath: string,
  destinationPath: string,
) => {
  const directory =
    await unzipper.Open.file(
      zipPath,
    );

  let fileCount = 0;

  for (const entry of directory.files) {
    const targetPath =
      getSafeExtractPath(
        destinationPath,
        entry.path,
      );

    if (
      entry.type ===
      "Directory"
    ) {
      await fs.mkdir(
        targetPath,
        {
          recursive: true,
        },
      );

      continue;
    }

    fileCount++;

    if (
      fileCount > MAX_FILES
    ) {
      throw new Error(
        `Too many files. Maximum allowed is ${MAX_FILES}.`,
      );
    }

    await fs.mkdir(
      path.dirname(
        targetPath,
      ),
      {
        recursive: true,
      },
    );

    await new Promise<void>(
      (
        resolve,
        reject,
      ) => {
        entry
          .stream()
          .pipe(
            fsSync.createWriteStream(
              targetPath,
            ),
          )
          .on(
            "finish",
            resolve,
          )
          .on(
            "error",
            reject,
          );
      },
    );
  }

  return fileCount;
};

/*
=====================================================
FIND STUDENT FOLDERS
=====================================================
*/

const findStudentFolders =
  async (
    extractPath: string,
  ) => {
    const result: string[] =
      [];

    const walk = async (
      currentPath: string,
    ): Promise<void> => {
      const entries =
        await fs.readdir(
          currentPath,
          {
            withFileTypes:
              true,
          },
        );

      for (
        const entry of entries
      ) {
        if (
          !entry.isDirectory()
        ) {
          continue;
        }

        const absolutePath =
          path.join(
            currentPath,
            entry.name,
          );

        const parsed =
          parseStudentFolderName(
            entry.name,
          );

        if (parsed.success) {
          result.push(
            absolutePath,
          );

          continue;
        }

        await walk(
          absolutePath,
        );
      }
    };

    await walk(
      extractPath,
    );

    return result;
  };

/*
=====================================================
PHOTO FILES
=====================================================
*/

const isSupportedPhotoFile =
  (
    fileName: string,
  ) => {
    const extension =
      path
        .extname(
          fileName,
        )
        .toLowerCase();

    return [
      ".jpg",
      ".jpeg",
      ".png",
      ".webp",
    ].includes(
      extension,
    );
  };

const getPhotoFiles =
  async (
    folderPath: string,
  ) => {
    const entries =
      await fs.readdir(
        folderPath,
        {
          withFileTypes:
            true,
        },
      );

    const files = entries
      .filter(
        (entry) =>
          entry.isFile(),
      )
      .filter(
        (entry) =>
          isSupportedPhotoFile(
            entry.name,
          ),
      )
      .sort((a, b) =>
        a.name.localeCompare(
          b.name,
          undefined,
          {
            numeric: true,
            sensitivity:
              "base",
          },
        ),
      );

    return files.map(
      (file) => ({
        absolutePath:
          path.join(
            folderPath,
            file.name,
          ),

        originalName:
          file.name,
      }),
    );
  };

/*
=====================================================
PHOTO STORAGE
=====================================================
*/

const generatePhotoKey =
  (
    originalFileName: string,
  ) => {
    const extension =
      path
        .extname(
          originalFileName,
        )
        .toLowerCase();

    const safeExtension =
      [
        ".jpg",
        ".jpeg",
        ".png",
        ".webp",
      ].includes(
        extension,
      )
        ? extension
        : ".jpg";

    return `/uploads/photos/${crypto.randomUUID()}${safeExtension}`;
  };

const getPhotoDestination =
  (
    photoKey: string,
  ) => {
    const prefix =
      "/uploads/photos/";

    if (
      !photoKey.startsWith(
        prefix,
      )
    ) {
      throw new Error(
        "Invalid photo key.",
      );
    }

    const relativePath =
      photoKey.slice(
        prefix.length,
      );

    const destinationPath =
      path.resolve(
        PHOTO_ROOT,
        relativePath,
      );

    if (
      destinationPath !==
        PHOTO_ROOT &&
      !isPathInside(
        PHOTO_ROOT,
        destinationPath,
      )
    ) {
      throw new Error(
        "Invalid photo path.",
      );
    }

    return destinationPath;
  };

const copyPhotoToStorage =
  async (
    sourcePath: string,
    originalFileName: string,
  ) => {
    await ensurePhotoRoot();

    const photoKey =
      generatePhotoKey(
        originalFileName,
      );

    const destinationPath =
      getPhotoDestination(
        photoKey,
      );

    await fs.copyFile(
      sourcePath,
      destinationPath,
    );

    return photoKey;
  };

/*
=====================================================
BATCH ID
=====================================================
*/

const isValidBatchId = (
  batchId: string,
) => {
  return /^[0-9a-f-]{36}$/i.test(
    batchId,
  );
};

const getBatchPath = (
  batchId: string,
) => {
  if (
    !isValidBatchId(
      batchId,
    )
  ) {
    throw new Error(
      "Invalid batch ID.",
    );
  }

  return path.resolve(
    BULK_IMPORT_ROOT,
    batchId,
  );
};

/*
=====================================================
ANALYZE BULK IMPORT
=====================================================
*/

export const analyzeBulkImportZipService =
  async (
    eventId: number,
    zipPath: string,
  ): Promise<AnalyzeResult> => {
    /*
    -------------------------------------------------
    CHECK EVENT
    -------------------------------------------------
    */

    const event =
      await prisma.event.findUnique(
        {
          where: {
            id: eventId,
          },
        },
      );

    if (!event) {
      throw new Error(
        "Event not found.",
      );
    }

    /*
    -------------------------------------------------
    CHECK ZIP
    -------------------------------------------------
    */

    const zipStat =
      await fs.stat(
        zipPath,
      );

    if (
      zipStat.size >
      MAX_ZIP_SIZE
    ) {
      throw new Error(
        "ZIP file is too large. Maximum allowed size is 2 GB.",
      );
    }

    /*
    -------------------------------------------------
    CREATE BATCH
    -------------------------------------------------
    */

    await ensureBulkImportRoot();

    const batchId =
      crypto.randomUUID();

    const batchPath =
      path.join(
        BULK_IMPORT_ROOT,
        batchId,
      );

    const extractPath =
      path.join(
        batchPath,
        "extracted",
      );

    await fs.mkdir(
      extractPath,
      {
        recursive: true,
      },
    );

    try {
      /*
      -------------------------------------------------
      EXTRACT ZIP
      -------------------------------------------------
      */

      await extractZipSafely(
        zipPath,
        extractPath,
      );

      /*
      -------------------------------------------------
      FIND STUDENT FOLDERS
      -------------------------------------------------
      */

      const studentFolders =
        await findStudentFolders(
          extractPath,
        );

      if (
        studentFolders.length >
        MAX_STUDENTS
      ) {
        throw new Error(
          `Too many students. Maximum allowed is ${MAX_STUDENTS}.`,
        );
      }

      const students: BulkImportStudentPreview[] =
        [];

      const conflicts:
        AnalyzeResult["conflicts"] =
        [];

      const invalidFolders:
        AnalyzeResult["invalidFolders"] =
        [];

      const seenNims =
        new Set<string>();

      /*
      -------------------------------------------------
      ANALYZE EACH STUDENT
      -------------------------------------------------
      */

      for (
        const folderPath of studentFolders
      ) {
        const folderName =
          path.basename(
            folderPath,
          );

        const parsed =
          parseStudentFolderName(
            folderName,
          );

        if (!parsed.success) {
          invalidFolders.push({
            folderName,
            reason:
              parsed.error,
          });

          continue;
        }

        const student =
          parsed.data;

        /*
        -----------------------------------------------
        DUPLICATE NIM INSIDE BATCH
        -----------------------------------------------
        */

        if (
          seenNims.has(
            student.nim,
          )
        ) {
          conflicts.push({
            nim: student.nim,
            name: student.name,
            reason:
              "Duplicate NIM found inside this import batch.",
          });

          continue;
        }

        seenNims.add(
          student.nim,
        );

        /*
        -----------------------------------------------
        CHECK EXISTING NIM
        -----------------------------------------------
        */

        const existingStudent =
          await prisma.student.findUnique(
            {
              where: {
                nim: student.nim,
              },

              select: {
                id: true,
                name: true,
                eventId: true,
              },
            },
          );

        /*
        -----------------------------------------------
        NIM BELONGS TO ANOTHER EVENT
        -----------------------------------------------
        */

        if (
          existingStudent &&
          existingStudent.eventId !==
            eventId
        ) {
          conflicts.push({
            nim: student.nim,
            name: student.name,
            reason:
              "NIM already belongs to another event.",
          });

          continue;
        }

        /*
        -----------------------------------------------
        GET PHOTOS
        -----------------------------------------------
        */

        const photos =
          await getPhotoFiles(
            folderPath,
          );

        /*
        -----------------------------------------------
        BUILD PREVIEW
        -----------------------------------------------
        */

        students.push(
          buildStudentPreview(
            student,
            photos,
          ),
        );
      }

      /*
      -------------------------------------------------
      SUMMARY
      -------------------------------------------------
      */

      const totalStudents =
        students.length;

      const present =
        students.filter(
          (student) =>
            !student.isAbsent,
        ).length;

      const absent =
        students.filter(
          (student) =>
            student.isAbsent,
        ).length;

      const photos0 =
        students.filter(
          (student) =>
            student.photoCount ===
            0,
        ).length;

      const photos1 =
        students.filter(
          (student) =>
            student.photoCount ===
            1,
        ).length;

      const photos2 =
        students.filter(
          (student) =>
            student.photoCount ===
            2,
        ).length;

      const moreThan2 =
        students.filter(
          (student) =>
            student.photoCount >
            2,
        ).length;

      /*
      -------------------------------------------------
      RETURN ANALYSIS
      -------------------------------------------------
      */

      return {
        batchId,

        eventId,

        summary: {
          totalStudents,

          present,

          absent,

          photos0,

          photos1,

          photos2,

          moreThan2,

          conflicts:
            conflicts.length,

          invalid:
            invalidFolders.length,
        },

        students,

        conflicts,

        invalidFolders,
      };
    } catch (error) {
      /*
      -------------------------------------------------
      CLEAN FAILED BATCH
      -------------------------------------------------
      */

      await fs.rm(
        batchPath,
        {
          recursive: true,
          force: true,
        },
      );

      throw error;
    } finally {
      /*
      -------------------------------------------------
      REMOVE ORIGINAL ZIP
      -------------------------------------------------
      */

      await fs.rm(
        zipPath,
        {
          force: true,
        },
      );
    }
  };

/*
=====================================================
IMPORT / APPROVE BULK IMPORT
=====================================================
*/

export const importBulkImportBatchService =
  async (
    eventId: number,
    batchId: string,
  ) => {
    /*
    -------------------------------------------------
    CHECK EVENT
    -------------------------------------------------
    */

    const event =
      await prisma.event.findUnique(
        {
          where: {
            id: eventId,
          },
        },
      );

    if (!event) {
      throw new Error(
        "Event not found.",
      );
    }

    /*
    -------------------------------------------------
    GET BATCH
    -------------------------------------------------
    */

    const batchPath =
      getBatchPath(
        batchId,
      );

    const extractPath =
      path.join(
        batchPath,
        "extracted",
      );

    try {
      await fs.access(
        extractPath,
      );
    } catch {
      throw new Error(
        "Import batch not found or already imported.",
      );
    }

    /*
    -------------------------------------------------
    FIND STUDENT FOLDERS AGAIN
    -------------------------------------------------

    IMPORTANT:
    We analyze again before importing.

    Jadi data yang masuk ke DB tidak hanya
    percaya kepada hasil preview lama.
    -------------------------------------------------
    */

    const studentFolders =
      await findStudentFolders(
        extractPath,
      );

    if (
      studentFolders.length ===
      0
    ) {
      throw new Error(
        "No student folders found in this batch.",
      );
    }

    if (
      studentFolders.length >
      MAX_STUDENTS
    ) {
      throw new Error(
        `Too many students. Maximum allowed is ${MAX_STUDENTS}.`,
      );
    }

    const students: BulkImportStudentPreview[] =
      [];

    const seenNims =
      new Set<string>();

    /*
    -------------------------------------------------
    VALIDATE STUDENTS
    -------------------------------------------------
    */

    for (
      const folderPath of studentFolders
    ) {
      const folderName =
        path.basename(
          folderPath,
        );

      const parsed =
        parseStudentFolderName(
          folderName,
        );

      if (!parsed.success) {
        throw new Error(
          `Invalid folder "${folderName}": ${parsed.error}`,
        );
      }

      const student =
        parsed.data;

      /*
      -----------------------------------------------
      DUPLICATE NIM
      -----------------------------------------------
      */

      if (
        seenNims.has(
          student.nim,
        )
      ) {
        throw new Error(
          `Duplicate NIM found in batch: ${student.nim}`,
        );
      }

      seenNims.add(
        student.nim,
      );

      /*
      -----------------------------------------------
      CHECK EXISTING STUDENT
      -----------------------------------------------
      */

      const existingStudent =
        await prisma.student.findUnique(
          {
            where: {
              nim: student.nim,
            },

            select: {
              id: true,
              eventId: true,
            },
          },
        );

      /*
      -----------------------------------------------
      NIM FROM ANOTHER EVENT
      -----------------------------------------------
      */

      if (
        existingStudent &&
        existingStudent.eventId !==
          eventId
      ) {
        throw new Error(
          `NIM ${student.nim} already belongs to another event.`,
        );
      }

      /*
      -----------------------------------------------
      GET PHOTOS
      -----------------------------------------------
      */

      const photos =
        await getPhotoFiles(
          folderPath,
        );

      /*
      -----------------------------------------------
      MORE THAN 2 PHOTOS
      -----------------------------------------------

      We don't know which 2 photos are correct,
      therefore don't silently choose.
      */

      if (
        photos.length > 2
      ) {
        throw new Error(
          `Student ${student.nim} has more than 2 photos.`,
        );
      }

      /*
      -----------------------------------------------
      BUILD FINAL STUDENT DATA
      -----------------------------------------------
      */

      students.push(
        buildStudentPreview(
          student,
          photos,
        ),
      );
    }

    /*
    -------------------------------------------------
    TRACK NEWLY COPIED FILES
    -------------------------------------------------

    Kalau DB transaction gagal,
    file-file baru ini akan dihapus.
    -------------------------------------------------
    */

    const copiedPhotoKeys: string[] =
      [];

    /*
    -------------------------------------------------
    PREPARED STUDENTS
    -------------------------------------------------
    */

    const preparedStudents: Array<{
      sequenceNumber: number;
      nim: string;
      name: string;
      isAbsent: boolean;
      photo1Key: string | null;
      photo2Key: string | null;
    }> = [];

    try {
      /*
      =================================================
      COPY PHOTOS
      =================================================
      */

      for (
        const student of students
      ) {
        let photo1Key:
          | string
          | null = null;

        let photo2Key:
          | string
          | null = null;

        /*
        -----------------------------------------------
        PHOTO 1
        -----------------------------------------------
        */

        if (
          student.photos[0]
        ) {
          photo1Key =
            await copyPhotoToStorage(
              student.photos[0]
                .absolutePath,

              student.photos[0]
                .originalName,
            );

          copiedPhotoKeys.push(
            photo1Key,
          );
        }

        /*
        -----------------------------------------------
        PHOTO 2
        -----------------------------------------------
        */

        if (
          student.photos[1]
        ) {
          photo2Key =
            await copyPhotoToStorage(
              student.photos[1]
                .absolutePath,

              student.photos[1]
                .originalName,
            );

          copiedPhotoKeys.push(
            photo2Key,
          );
        }

        preparedStudents.push({
          sequenceNumber:
            student.sequenceNumber,

          nim:
            student.nim,

          name:
            student.name,

          isAbsent:
            student.isAbsent,

          photo1Key,

          photo2Key,
        });
      }

      /*
      =================================================
      DATABASE TRANSACTION
      =================================================
      */

      const importedStudents =
        await prisma.$transaction(
          async (
            transaction,
          ) => {
            const result: Array<{
              action:
                | "CREATED"
                | "UPDATED";

              student: {
                id: number;
                nim: string;
                name: string;
                eventId: number;
                sequenceNumber: number;
                isAbsent: boolean;
                photo1Key:
                  string | null;
                photo2Key:
                  string | null;
              };

              oldPhoto1Key:
                string | null;

              oldPhoto2Key:
                string | null;
            }> = [];

            /*
            -------------------------------------------
            EACH STUDENT
            -------------------------------------------
            */

            for (
              const student of preparedStudents
            ) {
              /*
              -----------------------------------------
              CHECK CURRENT DB STATE
              -----------------------------------------
              */

              const existing =
                await transaction.student.findUnique(
                  {
                    where: {
                      nim:
                        student.nim,
                    },
                  },
                );

              /*
              -----------------------------------------
              SAFETY CHECK EVENT
              -----------------------------------------
              */

              if (
                existing &&
                existing.eventId !==
                  eventId
              ) {
                throw new Error(
                  `NIM ${student.nim} belongs to another event.`,
                );
              }

              /*
              -----------------------------------------
              UPDATE
              -----------------------------------------
              */

              if (existing) {
                const updated =
                  await transaction.student.update(
                    {
                      where: {
                        id:
                          existing.id,
                      },

                      data: {
                        sequenceNumber:
                          student.sequenceNumber,

                        name:
                          student.name,

                        isAbsent:
                          student.isAbsent,

                        photo1Key:
                          student.photo1Key,

                        photo2Key:
                          student.photo2Key,
                      },
                    },
                  );

                result.push({
                  action:
                    "UPDATED",

                  student:
                    updated,

                  oldPhoto1Key:
                    existing.photo1Key,

                  oldPhoto2Key:
                    existing.photo2Key,
                });

                continue;
              }

              /*
              -----------------------------------------
              CREATE
              -----------------------------------------
              */

              const created =
                await transaction.student.create(
                  {
                    data: {
                      sequenceNumber:
                        student.sequenceNumber,

                      nim:
                        student.nim,

                      name:
                        student.name,

                      eventId,

                      isAbsent:
                        student.isAbsent,

                      photo1Key:
                        student.photo1Key,

                      photo2Key:
                        student.photo2Key,
                    },
                  },
                );

              result.push({
                action:
                  "CREATED",

                student:
                  created,

                oldPhoto1Key:
                  null,

                oldPhoto2Key:
                  null,
              });
            }

            return result;
            },
            {
              timeout: 30000,
            },
          );

      /*
      =================================================
      DELETE OLD PHOTOS
      =================================================

      Hanya photo lama dari student yang di-update.

      IMPORTANT:
      Gagal delete file lama tidak boleh membuat
      DB rollback karena transaction sudah selesai.
      =================================================
      */

      for (
        const item of importedStudents
      ) {
        if (
          item.oldPhoto1Key &&
          item.oldPhoto1Key !==
            item.student.photo1Key
        ) {
          try {
            await fs.rm(
              getPhotoDestination(
                item.oldPhoto1Key,
              ),
              {
                force: true,
              },
            );
          } catch (error) {
            console.error(
              "FAILED TO DELETE OLD PHOTO 1:",
              error,
            );
          }
        }

        if (
          item.oldPhoto2Key &&
          item.oldPhoto2Key !==
            item.student.photo2Key
        ) {
          try {
            await fs.rm(
              getPhotoDestination(
                item.oldPhoto2Key,
              ),
              {
                force: true,
              },
            );
          } catch (error) {
            console.error(
              "FAILED TO DELETE OLD PHOTO 2:",
              error,
            );
          }
        }
      }

      /*
      =================================================
      CLEAN TEMPORARY BATCH
      =================================================
      */

      await fs.rm(
        batchPath,
        {
          recursive: true,
          force: true,
        },
      );

      /*
      =================================================
      SUMMARY
      =================================================
      */

      const createdCount =
        importedStudents.filter(
          (item) =>
            item.action ===
            "CREATED",
        ).length;

      const updatedCount =
        importedStudents.filter(
          (item) =>
            item.action ===
            "UPDATED",
        ).length;

      const photosImported =
        copiedPhotoKeys.length;

      /*
      =================================================
      RETURN
      =================================================
      */

      return {
        batchId,

        eventId,

        importedCount:
          importedStudents.length,

        createdCount,

        updatedCount,

        photosImported,
      };
    } catch (error) {
      /*
      =================================================
      ROLLBACK COPIED PHOTOS
      =================================================

      Kalau DB transaction gagal,
      file baru yang sudah ter-copy dihapus.
      =================================================
      */

      for (
        const photoKey of copiedPhotoKeys
      ) {
        try {
          await fs.rm(
            getPhotoDestination(
              photoKey,
            ),
            {
              force: true,
            },
          );
        } catch (cleanupError) {
          console.error(
            "FAILED TO CLEANUP COPIED PHOTO:",
            cleanupError,
          );
        }
      }

      throw error;
    }
  };