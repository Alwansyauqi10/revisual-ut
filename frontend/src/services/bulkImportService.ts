import { axiosInstance } from "@/lib/axios";

export interface BulkImportPhoto {
  absolutePath: string;
  originalName: string;
}

export interface BulkImportStudent {
  sequenceNumber: number;
  name: string;
  nim: string;
  isAbsent: boolean;
  folderName: string;
  photos: BulkImportPhoto[];
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

export interface BulkImportSummary {
  totalStudents: number;
  present: number;
  absent: number;
  photos0: number;
  photos1: number;
  photos2: number;
  moreThan2: number;
  conflicts: number;
  invalid: number;
}

export interface BulkImportConflict {
  nim: string;
  name: string;
  reason: string;
}

export interface BulkImportInvalidFolder {
  folderName: string;
  reason: string;
}

export interface BulkImportAnalysis {
  batchId: string;
  eventId: number;
  summary: BulkImportSummary;
  students: BulkImportStudent[];
  conflicts: BulkImportConflict[];
  invalidFolders: BulkImportInvalidFolder[];
}

export interface BulkImportAnalyzeResponse {
  message: string;
  data: BulkImportAnalysis;
}

export interface BulkImportResult {
  batchId: string;
  eventId: number;
  importedCount: number;
  createdCount: number;
  updatedCount: number;
  photosImported: number;
}

export interface BulkImportResponse {
  message: string;
  data: BulkImportResult;
}

export const analyzeBulkImportService = async (
  eventId: number,
  file: File,
) => {
  const formData = new FormData();

  formData.append("file", file);

  const response =
    await axiosInstance.post<BulkImportAnalyzeResponse>(
      `/events/${eventId}/analyze`,
      formData,
    );

  return response.data;
};

export const importBulkImportService = async (
  eventId: number,
  batchId: string,
) => {
  const response =
    await axiosInstance.post<BulkImportResponse>(
      `/events/${eventId}/import`,
      {
        batchId,
      },
    );

  return response.data;
};