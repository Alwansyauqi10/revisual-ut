import path from "node:path";

export interface ParsedStudentFolder {
  sequenceNumber: number;
  name: string;
  nim: string;
  isAbsent: boolean;
  folderName: string;
}

export interface ParsedPhotoFile {
  absolutePath: string;
  originalName: string;
}

export interface BulkImportStudentPreview
  extends ParsedStudentFolder {
  photos: ParsedPhotoFile[];
  photoCount: number;
  photoStatus:
    | "0/2"
    | "1/2"
    | "2/2"
    | "MORE_THAN_2";
  result:
    | "READY"
    | "MISSING_PHOTOS"
    | "ABSENT"
    | "TOO_MANY_PHOTOS";
}

export interface ParseFolderResult {
  success: true;
  data: ParsedStudentFolder;
}

export interface ParseFolderError {
  success: false;
  error: string;
}

export const parseStudentFolderName = (
  folderName: string,
): ParseFolderResult | ParseFolderError => {
  const normalized = folderName.trim();

  if (!normalized) {
    return {
      success: false,
      error: "Folder name is empty.",
    };
  }

  /*
  =====================================================
  ATTENDANCE
  =====================================================

  Support both:

  50.Nama_123456789_GA HADIR
  50.Nama_123456789_GA_HADIR

  GA HADIR = ABSENT
  */

  const upperFolderName =
    normalized.toUpperCase();

  const absentSuffixes = [
    "_GA HADIR",
    "_GA_HADIR",
  ];

  const absentSuffix =
    absentSuffixes.find((suffix) =>
      upperFolderName.endsWith(suffix),
    );

  const isAbsent = Boolean(absentSuffix);

  const folderWithoutAttendance =
    absentSuffix
      ? normalized.slice(
          0,
          normalized.length -
            absentSuffix.length,
        )
      : normalized;

  /*
  =====================================================
  SEQUENCE NUMBER
  =====================================================
  */

  const firstDotIndex =
    folderWithoutAttendance.indexOf(".");

  if (firstDotIndex === -1) {
    return {
      success: false,
      error:
        "Invalid folder format. Expected: SEQUENCE.NAME_NIM",
    };
  }

  const sequenceText =
    folderWithoutAttendance
      .slice(0, firstDotIndex)
      .trim();

  const remaining =
    folderWithoutAttendance
      .slice(firstDotIndex + 1)
      .trim();

  if (!sequenceText) {
    return {
      success: false,
      error:
        "Sequence number is missing.",
    };
  }

  if (!/^\d+$/.test(sequenceText)) {
    return {
      success: false,
      error: `Invalid sequence number: "${sequenceText}".`,
    };
  }

  const sequenceNumber =
    Number(sequenceText);

  if (
    !Number.isSafeInteger(
      sequenceNumber,
    ) ||
    sequenceNumber <= 0
  ) {
    return {
      success: false,
      error:
        "Sequence number must be a positive integer.",
    };
  }

  /*
  =====================================================
  NAME + NIM
  =====================================================
  */

  const lastUnderscoreIndex =
    remaining.lastIndexOf("_");

  if (lastUnderscoreIndex === -1) {
    return {
      success: false,
      error:
        'Invalid folder format. NIM separator "_" was not found.',
    };
  }

  const name =
    remaining
      .slice(0, lastUnderscoreIndex)
      .trim();

  const nim =
    remaining
      .slice(lastUnderscoreIndex + 1)
      .trim();

  if (!name) {
    return {
      success: false,
      error: "Student name is missing.",
    };
  }

  if (!nim) {
    return {
      success: false,
      error: "NIM is missing.",
    };
  }

  if (!/^\d+$/.test(nim)) {
    return {
      success: false,
      error: `Invalid NIM: "${nim}".`,
    };
  }

  return {
    success: true,

    data: {
      sequenceNumber,
      name,
      nim,
      isAbsent,
      folderName: normalized,
    },
  };
};

export const isSupportedPhotoFile = (
  fileName: string,
): boolean => {
  const extension =
    path
      .extname(fileName)
      .toLowerCase();

  return [
    ".jpg",
    ".jpeg",
    ".png",
    ".webp",
  ].includes(extension);
};

export const getPhotoStatus = (
  photoCount: number,
): BulkImportStudentPreview["photoStatus"] => {
  if (photoCount === 0) {
    return "0/2";
  }

  if (photoCount === 1) {
    return "1/2";
  }

  if (photoCount === 2) {
    return "2/2";
  }

  return "MORE_THAN_2";
};

export const getImportResult = (
  isAbsent: boolean,
  photoCount: number,
): BulkImportStudentPreview["result"] => {
  /*
  GA HADIR tetap dianggap ABSENT
  walaupun folder kosong.
  */

  if (isAbsent) {
    return "ABSENT";
  }

  /*
  Present tanpa foto / foto kurang
  tetap valid untuk import.
  */

  if (
    photoCount === 0 ||
    photoCount === 1
  ) {
    return "MISSING_PHOTOS";
  }

  if (photoCount === 2) {
    return "READY";
  }

  return "TOO_MANY_PHOTOS";
};

export const buildStudentPreview = (
  parsedStudent: ParsedStudentFolder,
  photos: ParsedPhotoFile[],
): BulkImportStudentPreview => {
  const photoCount =
    photos.length;

  return {
    ...parsedStudent,

    photos,

    photoCount,

    photoStatus:
      getPhotoStatus(photoCount),

    result:
      getImportResult(
        parsedStudent.isAbsent,
        photoCount,
      ),
  };
};