import {
  useRef,
  useState,
} from "react";

import {
  useNavigate,
  useParams,
} from "react-router";

import { isAxiosError } from "axios";

import {
  ArrowLeft,
  CheckCircle2,
  FileArchive,
  FileWarning,
  Loader2,
  Upload,
  Users,
  XCircle,
} from "lucide-react";

import {
  analyzeBulkImportService,
  importBulkImportService,
  type BulkImportAnalysis,
} from "@/services/bulkImportService";

const formatNumber = (
  value: number,
) => {
  return new Intl.NumberFormat(
    "id-ID",
  ).format(value);
};

const getErrorMessage = (
  error: unknown,
) => {
  if (
    isAxiosError(error)
  ) {
    return (
      error.response?.data
        ?.message ??
      error.message
    );
  }

  if (
    error instanceof Error
  ) {
    return error.message;
  }

  return "Something went wrong.";
};

export default function BulkImport() {
  const {
    eventId,
  } = useParams();

  const navigate =
    useNavigate();

  const fileInputRef =
    useRef<HTMLInputElement>(
      null,
    );

  const [
    selectedFile,
    setSelectedFile,
  ] = useState<File | null>(
    null,
  );

  const [
    analysis,
    setAnalysis,
  ] =
    useState<BulkImportAnalysis | null>(
      null,
    );

  const [
    isAnalyzing,
    setIsAnalyzing,
  ] = useState(false);

  const [
    isImporting,
    setIsImporting,
  ] = useState(false);

  const [
    reviewed,
    setReviewed,
  ] = useState(false);

  const [
    errorMessage,
    setErrorMessage,
  ] = useState("");

  const [
    successMessage,
    setSuccessMessage,
  ] = useState("");

  const numericEventId =
    Number(eventId);

  const handleFileChange = (
    file?: File,
  ) => {
    setErrorMessage("");
    setSuccessMessage("");
    setAnalysis(null);
    setReviewed(false);

    if (!file) {
      setSelectedFile(null);
      return;
    }

    if (
      !file.name
        .toLowerCase()
        .endsWith(".zip")
    ) {
      setSelectedFile(null);

      setErrorMessage(
        "Please select a ZIP file.",
      );

      return;
    }

    setSelectedFile(file);
  };

  const handleAnalyze =
    async () => {
      if (!selectedFile) {
        setErrorMessage(
          "Please select a ZIP file first.",
        );

        return;
      }

      if (
        !Number.isInteger(
          numericEventId,
        ) ||
        numericEventId <= 0
      ) {
        setErrorMessage(
          "Invalid event ID.",
        );

        return;
      }

      try {
        setIsAnalyzing(true);
        setErrorMessage("");
        setSuccessMessage("");
        setAnalysis(null);
        setReviewed(false);

        const response =
          await analyzeBulkImportService(
            numericEventId,
            selectedFile,
          );

        setAnalysis(
          response.data,
        );
      } catch (error) {
        setErrorMessage(
          getErrorMessage(error),
        );
      } finally {
        setIsAnalyzing(false);
      }
    };

  const handleImport =
    async () => {
      if (!analysis) {
        return;
      }

      if (!reviewed) {
        setErrorMessage(
          "Please confirm that you have reviewed the import.",
        );

        return;
      }

      if (
        analysis.summary
          .conflicts > 0
      ) {
        setErrorMessage(
          "This import contains conflicts. Resolve them before importing.",
        );

        return;
      }

      if (
        analysis.summary
          .invalid > 0
      ) {
        setErrorMessage(
          "This import contains invalid folders. Fix them before importing.",
        );

        return;
      }

      try {
        setIsImporting(true);
        setErrorMessage("");
        setSuccessMessage("");

        const response =
          await importBulkImportService(
            numericEventId,
            analysis.batchId,
          );

        setSuccessMessage(
          `Import completed. ${formatNumber(
            response.data.importedCount,
          )} students imported and ${formatNumber(
            response.data.photosImported,
          )} photos processed.`,
        );

        setAnalysis(null);
        setSelectedFile(null);
        setReviewed(false);

        if (
          fileInputRef.current
        ) {
          fileInputRef.current.value =
            "";
        }
      } catch (error) {
        setErrorMessage(
          getErrorMessage(error),
        );
      } finally {
        setIsImporting(false);
      }
    };

  const handleReset =
    () => {
      setSelectedFile(null);
      setAnalysis(null);
      setReviewed(false);
      setErrorMessage("");
      setSuccessMessage("");

      if (
        fileInputRef.current
      ) {
        fileInputRef.current.value =
          "";
      }
    };

  return (
    <div className="min-h-screen bg-[#F5F7FA]">
      <div className="mx-auto max-w-7xl px-6 py-8 lg:px-8">
        {/* HEADER */}
        <div className="mb-8">
          <button
            type="button"
            onClick={() =>
              navigate(
                `/admin/events/${eventId}/students`,
              )
            }
            className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition hover:text-[#071A33]"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Students
          </button>

          <div>
            <p className="mb-2 text-sm font-semibold uppercase tracking-[0.18em] text-[#071A33]/60">
              Student Management
            </p>

            <h1 className="text-3xl font-bold tracking-tight text-[#071A33] md:text-4xl">
              Bulk Import
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500 md:text-base">
              Import student data and graduation
              photos from a ZIP file.
            </p>
          </div>
        </div>

        {/* ERROR */}
        {errorMessage && (
          <div className="mb-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            <XCircle className="mt-0.5 h-5 w-5 shrink-0" />

            <div>
              <p className="font-semibold">
                Import failed
              </p>

              <p className="mt-1">
                {errorMessage}
              </p>
            </div>
          </div>
        )}

        {/* SUCCESS */}
        {successMessage && (
          <div className="mb-6 flex items-start gap-3 rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-700">
            <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" />

            <div>
              <p className="font-semibold">
                Import successful
              </p>

              <p className="mt-1">
                {successMessage}
              </p>
            </div>
          </div>
        )}

        {/* UPLOAD CARD */}
        <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm md:p-8">
          <div className="mb-6 flex items-start gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#071A33] text-white">
              <FileArchive className="h-5 w-5" />
            </div>

            <div>
              <h2 className="text-lg font-semibold text-[#071A33]">
                Upload ZIP
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Select a ZIP containing the student
                folders.
              </p>
            </div>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept=".zip,application/zip"
            className="hidden"
            onChange={(event) =>
              handleFileChange(
                event.target.files?.[0],
              )
            }
          />

          {!selectedFile ? (
            <button
              type="button"
              onClick={() =>
                fileInputRef.current?.click()
              }
              className="group flex min-h-56 w-full flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50 px-6 text-center transition hover:border-[#071A33] hover:bg-gray-100"
            >
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-white shadow-sm">
                <Upload className="h-6 w-6 text-[#071A33]" />
              </div>

              <p className="font-semibold text-[#071A33]">
                Choose ZIP file
              </p>

              <p className="mt-1 text-sm text-gray-500">
                Upload your student photo batch
              </p>

              <span className="mt-4 rounded-lg bg-[#071A33] px-4 py-2 text-sm font-semibold text-white transition group-hover:bg-[#0B2A50]">
                Browse ZIP
              </span>
            </button>
          ) : (
            <div className="rounded-2xl border border-[#071A33]/10 bg-[#071A33]/[0.03] p-5">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex min-w-0 items-center gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white shadow-sm">
                    <FileArchive className="h-5 w-5 text-[#071A33]" />
                  </div>

                  <div className="min-w-0">
                    <p className="truncate font-semibold text-[#071A33]">
                      {selectedFile.name}
                    </p>

                    <p className="mt-1 text-sm text-gray-500">
                      {(
                        selectedFile.size /
                        1024 /
                        1024
                      ).toFixed(2)}{" "}
                      MB
                    </p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={handleReset}
                    disabled={
                      isAnalyzing ||
                      isImporting
                    }
                    className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Remove
                  </button>

                  <button
                    type="button"
                    onClick={
                      handleAnalyze
                    }
                    disabled={
                      isAnalyzing ||
                      isImporting
                    }
                    className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#071A33] px-5 py-2 text-sm font-semibold text-white transition hover:bg-[#0B2A50] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isAnalyzing && (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    )}

                    {isAnalyzing
                      ? "Analyzing..."
                      : "Analyze ZIP"}
                  </button>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* PREVIEW */}
        {analysis && (
          <section className="mt-8">
            {/* SUMMARY */}
            <div className="mb-6">
              <div className="mb-4">
                <p className="text-sm font-semibold uppercase tracking-[0.16em] text-gray-400">
                  Import Preview
                </p>

                <h2 className="mt-1 text-2xl font-bold text-[#071A33]">
                  Review before importing
                </h2>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <SummaryCard
                  icon={
                    <Users className="h-5 w-5" />
                  }
                  label="Students"
                  value={
                    analysis.summary
                      .totalStudents
                  }
                />

                <SummaryCard
                  icon={
                    <CheckCircle2 className="h-5 w-5" />
                  }
                  label="Present"
                  value={
                    analysis.summary
                      .present
                  }
                />

                <SummaryCard
                  icon={
                    <FileWarning className="h-5 w-5" />
                  }
                  label="Absent"
                  value={
                    analysis.summary
                      .absent
                  }
                />

                <SummaryCard
                  icon={
                    <FileArchive className="h-5 w-5" />
                  }
                  label="Photos 2/2"
                  value={
                    analysis.summary
                      .photos2
                  }
                />
              </div>
            </div>

            {/* PHOTO SUMMARY */}
            <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <MiniSummary
                label="0 photos"
                value={
                  analysis.summary
                    .photos0
                }
              />

              <MiniSummary
                label="1 photo"
                value={
                  analysis.summary
                    .photos1
                }
              />

              <MiniSummary
                label="2 photos"
                value={
                  analysis.summary
                    .photos2
                }
              />

              <MiniSummary
                label="More than 2"
                value={
                  analysis.summary
                    .moreThan2
                }
              />
            </div>

            {/* CONFLICTS */}
            {analysis.conflicts
              .length > 0 && (
              <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-5">
                <div className="flex items-start gap-3">
                  <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />

                  <div>
                    <h3 className="font-semibold text-red-800">
                      {analysis.conflicts.length}{" "}
                      conflict
                      {analysis.conflicts.length !==
                      1
                        ? "s"
                        : ""}{" "}
                      found
                    </h3>

                    <div className="mt-3 space-y-2">
                      {analysis.conflicts.map(
                        (
                          conflict,
                        ) => (
                          <div
                            key={`${conflict.nim}-${conflict.reason}`}
                            className="rounded-lg bg-white p-3 text-sm"
                          >
                            <p className="font-semibold text-gray-800">
                              {conflict.nim} —{" "}
                              {conflict.name}
                            </p>

                            <p className="mt-1 text-red-600">
                              {
                                conflict.reason
                              }
                            </p>
                          </div>
                        ),
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* INVALID FOLDERS */}
            {analysis.invalidFolders
              .length > 0 && (
              <div className="mb-6 rounded-2xl border border-amber-200 bg-amber-50 p-5">
                <div className="flex items-start gap-3">
                  <FileWarning className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />

                  <div>
                    <h3 className="font-semibold text-amber-800">
                      {
                        analysis
                          .invalidFolders
                          .length
                      }{" "}
                      invalid folder
                      {analysis.invalidFolders
                        .length !== 1
                        ? "s"
                        : ""}{" "}
                      found
                    </h3>

                    <div className="mt-3 space-y-2">
                      {analysis.invalidFolders.map(
                        (
                          folder,
                        ) => (
                          <div
                            key={`${folder.folderName}-${folder.reason}`}
                            className="rounded-lg bg-white p-3 text-sm"
                          >
                            <p className="font-semibold text-gray-800">
                              {
                                folder.folderName
                              }
                            </p>

                            <p className="mt-1 text-amber-700">
                              {
                                folder.reason
                              }
                            </p>
                          </div>
                        ),
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* STUDENT TABLE */}
            <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
              <div className="border-b border-gray-200 px-6 py-5">
                <h3 className="font-semibold text-[#071A33]">
                  Student Preview
                </h3>

                <p className="mt-1 text-sm text-gray-500">
                  Review the students detected from
                  the ZIP.
                </p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full min-w-[850px] text-left text-sm">
                  <thead className="bg-gray-50 text-xs uppercase tracking-wider text-gray-500">
                    <tr>
                      <th className="px-6 py-4">
                        No.
                      </th>

                      <th className="px-6 py-4">
                        NIM
                      </th>

                      <th className="px-6 py-4">
                        Name
                      </th>

                      <th className="px-6 py-4">
                        Attendance
                      </th>

                      <th className="px-6 py-4">
                        Photos
                      </th>

                      <th className="px-6 py-4">
                        Result
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-100">
                    {analysis.students.map(
                      (
                        student,
                        index,
                      ) => (
                        <tr
                          key={`${student.nim}-${index}`}
                          className="transition hover:bg-gray-50"
                        >
                          <td className="px-6 py-4 font-medium text-gray-500">
                            {
                              student.sequenceNumber
                            }
                          </td>

                          <td className="px-6 py-4 font-semibold text-[#071A33]">
                            {
                              student.nim
                            }
                          </td>

                          <td className="px-6 py-4 text-gray-700">
                            {
                              student.name
                            }
                          </td>

                          <td className="px-6 py-4">
                            <StatusBadge
                              type={
                                student.isAbsent
                                  ? "absent"
                                  : "present"
                              }
                              label={
                                student.isAbsent
                                  ? "ABSENT"
                                  : "PRESENT"
                              }
                            />
                          </td>

                          <td className="px-6 py-4 font-medium text-gray-700">
                            {
                              student.photoStatus
                            }
                          </td>

                          <td className="px-6 py-4">
                            <ResultBadge
                              result={
                                student.result
                              }
                            />
                          </td>
                        </tr>
                      ),
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* APPROVAL */}
            <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <label className="flex cursor-pointer items-start gap-3">
                <input
                  type="checkbox"
                  checked={reviewed}
                  onChange={(
                    event,
                  ) =>
                    setReviewed(
                      event.target
                        .checked,
                    )
                  }
                  disabled={
                    isImporting ||
                    analysis.summary
                      .conflicts >
                      0 ||
                    analysis.summary
                      .invalid >
                      0
                  }
                  className="mt-1 h-4 w-4 rounded border-gray-300 text-[#071A33] focus:ring-[#071A33]"
                />

                <span>
                  <span className="block font-semibold text-[#071A33]">
                    I have reviewed this
                    import
                  </span>

                  <span className="mt-1 block text-sm leading-5 text-gray-500">
                    I confirm that the student
                    data, attendance status, and
                    photo counts are ready to be
                    imported.
                  </span>
                </span>
              </label>

              <div className="mt-6 flex flex-col-reverse gap-3 border-t border-gray-100 pt-6 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() =>
                    navigate(
                      `/admin/events/${eventId}/students`,
                    )
                  }
                  disabled={
                    isImporting
                  }
                  className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={
                    handleImport
                  }
                  disabled={
                    !reviewed ||
                    isImporting ||
                    analysis.summary
                      .conflicts >
                      0 ||
                    analysis.summary
                      .invalid >
                      0
                  }
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#071A33] px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-[#0B2A50] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {isImporting && (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  )}

                  {isImporting
                    ? "Importing..."
                    : "Approve & Import"}
                </button>
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

/*
=====================================================
SUMMARY CARD
=====================================================
*/

function SummaryCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#071A33]/5 text-[#071A33]">
          {icon}
        </div>

        <span className="text-2xl font-bold text-[#071A33]">
          {formatNumber(value)}
        </span>
      </div>

      <p className="mt-4 text-sm font-medium text-gray-500">
        {label}
      </p>
    </div>
  );
}

/*
=====================================================
MINI SUMMARY
=====================================================
*/

function MiniSummary({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white px-5 py-4">
      <div className="flex items-center justify-between gap-4">
        <span className="text-sm text-gray-500">
          {label}
        </span>

        <span className="font-bold text-[#071A33]">
          {formatNumber(value)}
        </span>
      </div>
    </div>
  );
}

/*
=====================================================
STATUS BADGE
=====================================================
*/

function StatusBadge({
  type,
  label,
}: {
  type:
    | "present"
    | "absent";
  label: string;
}) {
  const className =
    type === "present"
      ? "bg-green-50 text-green-700 ring-green-200"
      : "bg-red-50 text-red-700 ring-red-200";

  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${className}`}
    >
      {label}
    </span>
  );
}

/*
=====================================================
RESULT BADGE
=====================================================
*/

function ResultBadge({
  result,
}: {
  result:
    | "READY"
    | "MISSING_PHOTOS"
    | "ABSENT"
    | "TOO_MANY_PHOTOS";
}) {
  const config = {
    READY: {
      label: "READY",
      className:
        "bg-green-50 text-green-700 ring-green-200",
    },

    MISSING_PHOTOS: {
      label: "MISSING PHOTOS",
      className:
        "bg-amber-50 text-amber-700 ring-amber-200",
    },

    ABSENT: {
      label: "ABSENT",
      className:
        "bg-gray-100 text-gray-700 ring-gray-200",
    },

    TOO_MANY_PHOTOS: {
      label: "MORE THAN 2",
      className:
        "bg-red-50 text-red-700 ring-red-200",
    },
  } as const;

  const item =
    config[result];

  return (
    <span
      className={`inline-flex whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${item.className}`}
    >
      {item.label}
    </span>
  );
}