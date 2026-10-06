import { isAxiosError } from "axios";
import { useEffect, useState, type FormEvent } from "react";
import { Link, useParams } from "react-router";
import StudentStatsDashboard from "@/components/admin/StudentStatsDashboard";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { axiosInstance } from "@/lib/axios";
import {
  createStudentService,
  deleteStudentService,
  getStudentsService,
  updateStudentService,
  uploadStudentPhotosService,
} from "@/services/studentService";

interface Student {
  id: number;
  sequenceNumber: number;
  nim: string;
  name: string;
  eventId: number;
  isAbsent: boolean;
  photo1Key: string | null;
  photo2Key: string | null;
  createdAt: string;
  updatedAt: string;
}

interface Event {
  id: number;
  name: string;
  date: string;
}

const API_URL = "http://localhost:8000";

function Students() {
  const { eventId } = useParams();
  const parsedEventId = Number(eventId);

  const [students, setStudents] = useState<Student[]>([]);
  const [event, setEvent] = useState<Event | null>(null);

  const [isLoading, setIsLoading] = useState(true);

  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalStudents, setTotalStudents] = useState(0);

  const STUDENTS_PER_PAGE = 10;
  const SEARCH_DEBOUNCE_DELAY = 400;

  // =========================================================
  // CREATE
  // =========================================================

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const [studentSequenceNumber, setStudentSequenceNumber] = useState("");
  const [studentNim, setStudentNim] = useState("");
  const [studentName, setStudentName] = useState("");

  const [isCreating, setIsCreating] = useState(false);
  const [createError, setCreateError] = useState("");

  const [createPhoto1, setCreatePhoto1] = useState<File | null>(null);
  const [createPhoto2, setCreatePhoto2] = useState<File | null>(null);

  // =========================================================
  // EDIT
  // =========================================================

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const [editingStudent, setEditingStudent] = useState<Student | null>(null);

  const [editStudentSequenceNumber, setEditStudentSequenceNumber] =
    useState("");
  const [editStudentNim, setEditStudentNim] = useState("");
  const [editStudentName, setEditStudentName] = useState("");

  const [isUpdating, setIsUpdating] = useState(false);
  const [editError, setEditError] = useState("");

  const [editPhoto1, setEditPhoto1] = useState<File | null>(null);
  const [editPhoto2, setEditPhoto2] = useState<File | null>(null);

  // =========================================================
  // DELETE
  // =========================================================

  const [deletingStudentId, setDeletingStudentId] = useState<number | null>(
    null,
  );

  // =========================================================
  // GET STUDENTS
  // =========================================================

  const getStudents = async () => {
    try {
      setIsLoading(true);

      const data = await getStudentsService(parsedEventId, {
        search,
        page: currentPage,
        limit: STUDENTS_PER_PAGE,
      });

      setStudents(data.data);
      setTotalStudents(data.meta.total);
      setTotalPages(data.meta.totalPages);
    } catch (error) {
      console.error("GAGAL MENGAMBIL STUDENTS:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // =========================================================
  // GET EVENT
  // =========================================================

  const getEvent = async () => {
    try {
      const response = await axiosInstance.get(`/events/${parsedEventId}`);

      setEvent(response.data.data);
    } catch (error) {
      console.error("GAGAL MENGAMBIL EVENT:", error);
    }
  };

  // =========================================================
  // INITIAL LOAD
  // =========================================================

  useEffect(() => {
    if (!parsedEventId || Number.isNaN(parsedEventId)) {
      return;
    }

    getEvent();
  }, [parsedEventId]);

  useEffect(() => {
    if (!parsedEventId || Number.isNaN(parsedEventId)) {
      return;
    }

    getStudents();
  }, [parsedEventId, search, currentPage]);

  // =========================================================
  // SEARCH - DEBOUNCE
  // =========================================================

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setSearch(searchInput.trim());
      setCurrentPage(1);
    }, SEARCH_DEBOUNCE_DELAY);

    return () => window.clearTimeout(timeout);
  }, [searchInput]);

  const handleClearSearch = () => {
    setSearchInput("");
    setSearch("");
    setCurrentPage(1);
  };

  // =========================================================
  // CREATE STUDENT
  // =========================================================

  const handleCreateStudent = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!studentSequenceNumber.trim()) {
      setCreateError("Sequence number is required.");
      return;
    }

    if (!studentNim.trim() || !studentName.trim()) {
      setCreateError("NIM and name are required.");
      return;
    }

    const sequenceNumber = Number(studentSequenceNumber);

    if (!Number.isInteger(sequenceNumber) || sequenceNumber < 1) {
      setCreateError("Sequence number must be a positive integer.");
      return;
    }

    if (!createPhoto1 || !createPhoto2) {
      setCreateError("Photo 1 and Photo 2 are required.");
      return;
    }

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

    const maxFileSize = 10 * 1024 * 1024;

    for (const photo of [createPhoto1, createPhoto2]) {
      if (!allowedTypes.includes(photo.type)) {
        setCreateError("Only JPG, PNG, and WebP images are allowed.");
        return;
      }

      if (photo.size > maxFileSize) {
        setCreateError("Each photo must be 10 MB or smaller.");
        return;
      }
    }

    let createdStudentId: number | null = null;

    try {
      setIsCreating(true);
      setCreateError("");

      const studentResponse = await createStudentService(
        parsedEventId,
        sequenceNumber,
        studentNim.trim(),
        studentName.trim(),
      );

      const studentId = studentResponse.data.id;

      createdStudentId = studentId;

      await uploadStudentPhotosService(
        parsedEventId,
        studentId,
        createPhoto1,
        createPhoto2,
      );

      await getStudents();

      setStudentSequenceNumber("");
      setStudentNim("");
      setStudentName("");

      setCreatePhoto1(null);
      setCreatePhoto2(null);

      setIsCreateDialogOpen(false);
    } catch (error) {
      console.error("GAGAL MEMBUAT STUDENT:", error);

      /*
       * Kalau student berhasil dibuat tetapi upload photo gagal,
       * student akan dihapus kembali supaya tidak meninggalkan
       * data student tanpa photo.
       */
      if (createdStudentId !== null) {
        try {
          await deleteStudentService(parsedEventId, createdStudentId);
        } catch (rollbackError) {
          console.error("GAGAL ROLLBACK STUDENT:", rollbackError);
        }
      }

      const responseMessage = isAxiosError(error)
        ? error.response?.data?.message
        : null;

      setCreateError(
        responseMessage ||
          "Failed to add student and photos. Please try again.",
      );
    } finally {
      setIsCreating(false);
    }
  };

  // =========================================================
  // OPEN EDIT
  // =========================================================

  const handleOpenEdit = (student: Student) => {
    setEditingStudent(student);

    setEditStudentSequenceNumber(String(student.sequenceNumber));

    setEditStudentNim(student.nim);
    setEditStudentName(student.name);

    setEditPhoto1(null);
    setEditPhoto2(null);

    setEditError("");

    setIsEditDialogOpen(true);
  };

  // =========================================================
  // UPDATE STUDENT
  // =========================================================

  const handleUpdateStudent = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!editingStudent) {
      return;
    }

    if (!editStudentSequenceNumber.trim()) {
      setEditError("Sequence number is required.");
      return;
    }

    if (!editStudentNim.trim() || !editStudentName.trim()) {
      setEditError("NIM and name are required.");
      return;
    }

    const sequenceNumber = Number(editStudentSequenceNumber);

    if (!Number.isInteger(sequenceNumber) || sequenceNumber < 1) {
      setEditError("Sequence number must be a positive integer.");
      return;
    }

    if (editPhoto1 || editPhoto2) {
      if (!editPhoto1 || !editPhoto2) {
        setEditError("Please select both Photo 1 and Photo 2.");
        return;
      }

      const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

      const maxFileSize = 10 * 1024 * 1024;

      for (const photo of [editPhoto1, editPhoto2]) {
        if (!allowedTypes.includes(photo.type)) {
          setEditError("Only JPG, PNG, and WebP images are allowed.");
          return;
        }

        if (photo.size > maxFileSize) {
          setEditError("Each photo must be 10 MB or smaller.");
          return;
        }
      }
    }

    try {
      setIsUpdating(true);
      setEditError("");

      const studentResponse = await updateStudentService(
        parsedEventId,
        editingStudent.id,
        sequenceNumber,
        editStudentNim.trim(),
        editStudentName.trim(),
        editingStudent.isAbsent,
      );

      let updatedStudent = studentResponse.data;

      if (editPhoto1 && editPhoto2) {
        const photoResponse = await uploadStudentPhotosService(
          parsedEventId,
          editingStudent.id,
          editPhoto1,
          editPhoto2,
        );

        updatedStudent = photoResponse.data;
      }

      setStudents((currentStudents) =>
        currentStudents.map((student) =>
          student.id === editingStudent.id ? updatedStudent : student,
        ),
      );

      setIsEditDialogOpen(false);
      setEditingStudent(null);

      setEditStudentSequenceNumber("");
      setEditStudentNim("");
      setEditStudentName("");

      setEditPhoto1(null);
      setEditPhoto2(null);
    } catch (error) {
      console.error("GAGAL UPDATE STUDENT:", error);

      const responseMessage = isAxiosError(error)
        ? error.response?.data?.message
        : null;

      setEditError(
        responseMessage || "Failed to update student. Please try again.",
      );
    } finally {
      setIsUpdating(false);
    }
  };

  // =========================================================
  // DELETE STUDENT
  // =========================================================

  const handleDeleteStudent = async (student: Student) => {
    const confirmed = window.confirm(`Delete student "${student.name}"?`);

    if (!confirmed) {
      return;
    }

    try {
      setDeletingStudentId(student.id);

      await deleteStudentService(parsedEventId, student.id);

      if (students.length === 1 && currentPage > 1) {
        setCurrentPage((page) => page - 1);
      } else {
        await getStudents();
      }
    } catch (error) {
      console.error("GAGAL DELETE STUDENT:", error);

      const responseMessage = isAxiosError(error)
        ? error.response?.data?.message
        : null;

      window.alert(
        responseMessage || "Failed to delete student. Please try again.",
      );
    } finally {
      setDeletingStudentId(null);
    }
  };

  // =========================================================
  // PHOTO URL
  // =========================================================

  const getPhotoUrl = (photoKey: string | null) => {
    if (!photoKey) {
      return null;
    }

    return `${API_URL}${photoKey}`;
  };

  // =========================================================
  // UI
  // =========================================================

  return (
    <main className="min-h-screen bg-[#F5F7FA] px-6 py-12 text-[#071A33] lg:py-16">
      <div className="mx-auto max-w-7xl">
        {/* HEADER */}

        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="min-w-0">
            <Link
              to="/admin/events"
              className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.16em] text-[#071A33]/40 transition hover:text-[#071A33]"
            >
              <span aria-hidden="true">←</span>
              Back to Events
            </Link>

            <div className="mt-7 flex flex-wrap items-center gap-3">
              <span className="rounded-full border border-[#071A33]/8 bg-white px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#071A33]/55 shadow-sm">
                Student Management
              </span>

              {event && (
                <span className="text-xs text-[#071A33]/40">
                  {new Date(event.date).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
              )}
            </div>

            <h1 className="font-display mt-4 text-4xl font-semibold tracking-[-0.03em] sm:text-5xl">
              {event?.name ?? "Graduation Event"}
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-[#071A33]/50">
              Manage student records and graduation photos for this event.
            </p>
          </div>

          <div className="flex shrink-0 items-center gap-3">
            <Link
              to={`/admin/events/${eventId}/import`}
              className="inline-flex h-11 items-center rounded-xl border border-[#071A33]/10 bg-white px-5 text-sm font-medium text-[#071A33] shadow-sm transition hover:border-[#071A33]/20 hover:bg-[#F5F7FA] hover:shadow-md"
            >
              Bulk Import
            </Link>

            <Button
              type="button"
              onClick={() => {
                setStudentSequenceNumber("");
                setStudentNim("");
                setStudentName("");

                setCreatePhoto1(null);
                setCreatePhoto2(null);

                setCreateError("");
                setIsCreateDialogOpen(true);
              }}
              className="h-11 shrink-0 rounded-xl bg-[#071A33] px-5 text-sm font-medium text-white shadow-sm transition hover:bg-[#0B2545] hover:shadow-md"
            >
              <span className="mr-2 text-base leading-none">+</span>
              Add Student
            </Button>
          </div>
        </div>

        {/* Dashboard */}
        <StudentStatsDashboard eventId={parsedEventId} />

        {/* SEARCH / SUMMARY */}

        <div className="mt-10 rounded-2xl border border-[#071A33]/7 bg-white p-3 shadow-[0_10px_35px_rgba(7,26,51,0.04)]">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative min-w-0 flex-1">
              <span
                aria-hidden="true"
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#071A33]/35"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="11" cy="11" r="7" />
                  <path d="m20 20-4-4" />
                </svg>
              </span>

              <input
                type="text"
                value={searchInput}
                onChange={(event) => setSearchInput(event.target.value)}
                placeholder="Search by NIM or student name..."
                className="h-12 w-full rounded-xl border border-[#071A33]/8 bg-[#F8FAFC] pl-11 pr-24 text-sm outline-none transition placeholder:text-[#071A33]/30 focus:border-[#071A33]/20 focus:bg-white focus:ring-4 focus:ring-[#071A33]/5"
              />

              {searchInput && (
                <button
                  type="button"
                  onClick={handleClearSearch}
                  aria-label="Clear search"
                  className="absolute right-3 top-1/2 inline-flex -translate-y-1/2 items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs font-medium text-[#071A33]/45 transition hover:bg-[#071A33]/5 hover:text-[#071A33]"
                >
                  <span>Clear</span>
                  <span aria-hidden="true" className="text-sm leading-none">
                    ×
                  </span>
                </button>
              )}
            </div>

            <div className="flex h-12 shrink-0 items-center justify-center rounded-xl bg-[#F5F7FA] px-4 text-xs text-[#071A33]/45">
              {isLoading ? (
                <span className="inline-flex items-center gap-2">
                  <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-[#071A33]/15 border-t-[#071A33]/60" />
                  Searching
                </span>
              ) : (
                <span>
                  {totalStudents} {totalStudents === 1 ? "student" : "students"}
                </span>
              )}
            </div>
          </div>

          <div className="flex min-h-5 items-center px-1 pt-2">
            {search ? (
              <p className="text-xs text-[#071A33]/40">
                Showing results for{" "}
                <span className="font-medium text-[#071A33]/65">
                  “{search}”
                </span>
              </p>
            ) : (
              <p className="text-xs text-[#071A33]/35">
                Search updates automatically as you type.
              </p>
            )}
          </div>
        </div>

        {/* STUDENT TABLE */}

        <div className="mt-5 overflow-hidden rounded-2xl border border-[#071A33]/7 bg-white shadow-[0_10px_35px_rgba(7,26,51,0.04)]">
          <div className="flex items-center justify-between border-b border-[#071A33]/6 px-5 py-4 sm:px-6">
            <div>
              <p className="text-sm font-semibold">Students</p>

              <p className="mt-0.5 text-xs text-[#071A33]/40">
                {isLoading
                  ? "Updating student list..."
                  : `${totalStudents} ${
                      totalStudents === 1 ? "record" : "records"
                    }`}
              </p>
            </div>

            <span className="hidden rounded-full bg-[#F5F7FA] px-3 py-1.5 text-[11px] font-medium text-[#071A33]/45 sm:inline-flex">
              Page {currentPage} of {Math.max(totalPages, 1)}
            </span>
          </div>

          {isLoading && students.length === 0 ? (
            <div className="space-y-3 p-5 sm:p-6">
              {Array.from({ length: 5 }).map((_, index) => (
                <div
                  key={index}
                  className="h-[82px] animate-pulse rounded-xl bg-[#F5F7FA]"
                />
              ))}
            </div>
          ) : students.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1100px] border-collapse">
                <thead>
                  <tr className="border-b border-[#071A33]/6 bg-[#FBFCFD] text-left">
                    <th className="px-6 py-4 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#071A33]/40">
                      No.
                    </th>

                    <th className="px-6 py-4 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#071A33]/40">
                      NIM
                    </th>

                    <th className="px-6 py-4 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#071A33]/40">
                      Name
                    </th>

                    <th className="px-6 py-4 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#071A33]/40">
                      Photo 1
                    </th>

                    <th className="px-6 py-4 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#071A33]/40">
                      Photo 2
                    </th>

                    <th className="px-6 py-4 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#071A33]/40">
                      Status
                    </th>

                    <th className="px-6 py-4 text-right text-[10px] font-semibold uppercase tracking-[0.16em] text-[#071A33]/40">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {students.map((student) => {
                    const photo1Url = getPhotoUrl(student.photo1Key);

                    const photo2Url = getPhotoUrl(student.photo2Key);

                    return (
                      <tr
                        key={student.id}
                        className="group border-b border-[#071A33]/5 last:border-b-0"
                      >
                        {/* NO */}

                        <td className="px-6 py-4 align-middle">
                          <span className="font-mono text-xs font-medium text-[#071A33]/55">
                            {student.sequenceNumber}
                          </span>
                        </td>

                        {/* NIM */}

                        <td className="px-6 py-4 align-middle">
                          <span className="font-mono text-xs font-medium text-[#071A33]/75">
                            {student.nim}
                          </span>
                        </td>

                        {/* NAME */}

                        <td className="px-6 py-4 align-middle">
                          <span className="text-sm font-medium text-[#071A33]/80">
                            {student.name}
                          </span>
                        </td>

                        {/* PHOTOS */}

                        {[photo1Url, photo2Url].map((photoUrl, photoIndex) => (
                          <td
                            key={`${student.id}-photo-${photoIndex}`}
                            className="px-6 py-4 align-middle"
                          >
                            {photoUrl ? (
                              <a
                                href={photoUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="block w-fit overflow-hidden rounded-lg ring-1 ring-[#071A33]/7 transition hover:ring-[#071A33]/20"
                              >
                                <img
                                  src={photoUrl}
                                  alt={`${student.name} Photo ${
                                    photoIndex + 1
                                  }`}
                                  className="h-14 w-[88px] object-cover transition duration-300 group-hover:scale-[1.02] hover:scale-105"
                                />
                              </a>
                            ) : (
                              <div className="flex h-14 w-[88px] items-center justify-center rounded-lg bg-[#F5F7FA] text-[9px] font-medium uppercase tracking-[0.12em] text-[#071A33]/25">
                                No photo
                              </div>
                            )}
                          </td>
                        ))}

                        {/* STATUS */}

                        <td className="px-6 py-4 align-middle">
                          {student.isAbsent ? (
                            <span className="inline-flex rounded-full bg-red-50 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-red-600">
                              Absent
                            </span>
                          ) : (
                            <span className="inline-flex rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-emerald-600">
                              Present
                            </span>
                          )}
                        </td>

                        {/* ACTIONS */}

                        <td className="px-6 py-4 align-middle">
                          <div className="flex justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => handleOpenEdit(student)}
                              className="rounded-lg border border-[#071A33]/9 px-3 py-2 text-xs font-medium text-[#071A33]/70 transition hover:border-[#071A33]/15 hover:bg-[#F5F7FA] hover:text-[#071A33]"
                            >
                              Edit
                            </button>

                            <button
                              type="button"
                              onClick={() => handleDeleteStudent(student)}
                              disabled={deletingStudentId === student.id}
                              className="rounded-lg border border-red-100 px-3 py-2 text-xs font-medium text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              {deletingStudentId === student.id
                                ? "Deleting..."
                                : "Delete"}
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              {isLoading && (
                <div className="flex items-center justify-center gap-2 border-t border-[#071A33]/5 bg-white py-3 text-xs text-[#071A33]/40">
                  <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-[#071A33]/15 border-t-[#071A33]/60" />
                  Updating results...
                </div>
              )}
            </div>
          ) : (
            <div className="px-6 py-20 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#F5F7FA] text-[#071A33]/35">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="11" cy="11" r="7" />
                  <path d="m20 20-4-4" />
                </svg>
              </div>

              <p className="mt-4 text-sm font-medium">
                {search ? "No students found" : "No students yet"}
              </p>

              <p className="mx-auto mt-1 max-w-sm text-xs leading-5 text-[#071A33]/40">
                {search
                  ? `No student matches “${search}”. Try a different NIM or name.`
                  : "Add the first student to this graduation event to get started."}
              </p>

              {search && (
                <button
                  type="button"
                  onClick={handleClearSearch}
                  className="mt-5 text-xs font-medium text-[#071A33] underline underline-offset-4"
                >
                  Clear search
                </button>
              )}
            </div>
          )}
        </div>

        {/* PAGINATION */}

        {totalPages > 1 && (
          <div className="mt-5 flex flex-col items-center justify-between gap-3 sm:flex-row">
            <p className="text-xs text-[#071A33]/40">
              Page {currentPage} of {totalPages}
            </p>

            <div className="flex items-center gap-1.5">
              <Button
                type="button"
                variant="outline"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((page) => page - 1)}
                className="h-9 rounded-lg px-3 text-xs"
              >
                ← Previous
              </Button>

              <div className="flex items-center gap-1.5">
                {Array.from(
                  {
                    length: Math.min(totalPages, 5),
                  },
                  (_, index) => {
                    if (totalPages <= 5) {
                      return index + 1;
                    }

                    if (currentPage <= 3) {
                      return index + 1;
                    }

                    if (currentPage >= totalPages - 2) {
                      return totalPages - 4 + index;
                    }

                    return currentPage - 2 + index;
                  },
                ).map((page) => (
                  <button
                    key={page}
                    type="button"
                    onClick={() => setCurrentPage(page)}
                    className={`h-9 min-w-9 rounded-lg px-3 text-xs font-medium transition ${
                      currentPage === page
                        ? "bg-[#071A33] text-white shadow-sm"
                        : "border border-[#071A33]/8 bg-white text-[#071A33]/55 hover:bg-[#F5F7FA] hover:text-[#071A33]"
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>

              <Button
                type="button"
                variant="outline"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((page) => page + 1)}
                className="h-9 rounded-lg px-3 text-xs"
              >
                Next →
              </Button>
            </div>
          </div>
        )}

        {/* =================================================
            CREATE STUDENT DIALOG
        ================================================= */}

        <Dialog
          open={isCreateDialogOpen}
          onOpenChange={(open) => {
            setIsCreateDialogOpen(open);

            if (!open && !isCreating) {
              setStudentSequenceNumber("");
              setStudentNim("");
              setStudentName("");

              setCreatePhoto1(null);
              setCreatePhoto2(null);

              setCreateError("");
            }
          }}
        >
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle className="font-display text-2xl">
                Add Student
              </DialogTitle>

              <DialogDescription>
                Add a student to this graduation event.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleCreateStudent} className="mt-4 space-y-5">
              {/* SEQUENCE NUMBER */}

              <div className="space-y-2">
                <label
                  htmlFor="student-sequence"
                  className="text-sm font-medium"
                >
                  Sequence Number
                </label>

                <input
                  id="student-sequence"
                  type="number"
                  min="1"
                  value={studentSequenceNumber}
                  onChange={(event) =>
                    setStudentSequenceNumber(event.target.value)
                  }
                  placeholder="1"
                  disabled={isCreating}
                  className="h-11 w-full rounded-lg border border-[#071A33]/10 bg-white px-3 text-sm outline-none transition placeholder:text-[#071A33]/30 focus:border-[#071A33]/30 focus:ring-2 focus:ring-[#071A33]/10 disabled:opacity-50"
                />

                <p className="text-xs text-[#071A33]/40">
                  Student order number from the graduation list.
                </p>
              </div>

              {/* NIM */}

              <div className="space-y-2">
                <label htmlFor="student-nim" className="text-sm font-medium">
                  NIM
                </label>

                <input
                  id="student-nim"
                  type="text"
                  value={studentNim}
                  onChange={(event) => setStudentNim(event.target.value)}
                  placeholder="065114344"
                  disabled={isCreating}
                  className="h-11 w-full rounded-lg border border-[#071A33]/10 bg-white px-3 text-sm outline-none transition placeholder:text-[#071A33]/30 focus:border-[#071A33]/30 focus:ring-2 focus:ring-[#071A33]/10 disabled:opacity-50"
                />
              </div>

              {/* NAME */}

              <div className="space-y-2">
                <label htmlFor="student-name" className="text-sm font-medium">
                  Name
                </label>

                <input
                  id="student-name"
                  type="text"
                  value={studentName}
                  onChange={(event) => setStudentName(event.target.value)}
                  placeholder="Muhammad Alwan Syauqi"
                  disabled={isCreating}
                  className="h-11 w-full rounded-lg border border-[#071A33]/10 bg-white px-3 text-sm outline-none transition placeholder:text-[#071A33]/30 focus:border-[#071A33]/30 focus:ring-2 focus:ring-[#071A33]/10 disabled:opacity-50"
                />
              </div>

              {/* PHOTO 1 */}

              <div className="space-y-2">
                <label htmlFor="create-photo-1" className="text-sm font-medium">
                  Photo 1
                </label>

                <input
                  id="create-photo-1"
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  disabled={isCreating}
                  onChange={(event) => {
                    setCreatePhoto1(event.target.files?.[0] ?? null);
                  }}
                  className="block w-full cursor-pointer rounded-lg border border-[#071A33]/10 bg-white text-sm file:mr-4 file:border-0 file:bg-[#071A33] file:px-4 file:py-2.5 file:text-sm file:font-medium file:text-white hover:file:bg-[#0B2545]"
                />

                {createPhoto1 && (
                  <p className="text-xs text-[#071A33]/45">
                    Selected: {createPhoto1.name}
                  </p>
                )}
              </div>

              {/* PHOTO 2 */}

              <div className="space-y-2">
                <label htmlFor="create-photo-2" className="text-sm font-medium">
                  Photo 2
                </label>

                <input
                  id="create-photo-2"
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  disabled={isCreating}
                  onChange={(event) => {
                    setCreatePhoto2(event.target.files?.[0] ?? null);
                  }}
                  className="block w-full cursor-pointer rounded-lg border border-[#071A33]/10 bg-white text-sm file:mr-4 file:border-0 file:bg-[#071A33] file:px-4 file:py-2.5 file:text-sm file:font-medium file:text-white hover:file:bg-[#0B2545]"
                />

                {createPhoto2 && (
                  <p className="text-xs text-[#071A33]/45">
                    Selected: {createPhoto2.name}
                  </p>
                )}
              </div>

              <p className="text-xs leading-5 text-[#071A33]/40">
                Supported formats: JPG, PNG, and WebP.
                <br />
                Maximum file size: 10 MB per photo.
              </p>

              {createError && (
                <p className="text-sm text-red-600">{createError}</p>
              )}

              <div className="flex justify-end gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsCreateDialogOpen(false)}
                  disabled={isCreating}
                >
                  Cancel
                </Button>

                <Button
                  type="submit"
                  disabled={isCreating}
                  className="bg-[#071A33] text-white hover:bg-[#0B2545]"
                >
                  {isCreating ? "Creating..." : "Add Student"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>

        {/* =================================================
            EDIT STUDENT DIALOG
        ================================================= */}

        <Dialog
          open={isEditDialogOpen}
          onOpenChange={(open) => {
            setIsEditDialogOpen(open);

            if (!open && !isUpdating) {
              setEditingStudent(null);

              setEditStudentSequenceNumber("");
              setEditStudentNim("");
              setEditStudentName("");

              setEditPhoto1(null);
              setEditPhoto2(null);

              setEditError("");
            }
          }}
        >
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle className="font-display text-2xl">
                Edit Student
              </DialogTitle>

              <DialogDescription>
                Update student information and graduation photos.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleUpdateStudent} className="mt-4 space-y-5">
              {/* ABSENT INFO */}

              {editingStudent?.isAbsent && (
                <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.12em] text-red-600">
                    Absent
                  </p>

                  <p className="mt-1 text-xs leading-5 text-red-600/70">
                    This student is marked as absent. The status is managed by
                    the attendance/import process.
                  </p>
                </div>
              )}

              {/* SEQUENCE */}

              <div className="space-y-2">
                <label
                  htmlFor="edit-student-sequence"
                  className="text-sm font-medium"
                >
                  Sequence Number
                </label>

                <input
                  id="edit-student-sequence"
                  type="number"
                  min="1"
                  value={editStudentSequenceNumber}
                  onChange={(event) =>
                    setEditStudentSequenceNumber(event.target.value)
                  }
                  disabled={isUpdating}
                  className="h-11 w-full rounded-lg border border-[#071A33]/10 bg-white px-3 text-sm outline-none transition focus:border-[#071A33]/30 focus:ring-2 focus:ring-[#071A33]/10 disabled:opacity-50"
                />
              </div>

              {/* NIM */}

              <div className="space-y-2">
                <label
                  htmlFor="edit-student-nim"
                  className="text-sm font-medium"
                >
                  NIM
                </label>

                <input
                  id="edit-student-nim"
                  type="text"
                  value={editStudentNim}
                  onChange={(event) => setEditStudentNim(event.target.value)}
                  disabled={isUpdating}
                  className="h-11 w-full rounded-lg border border-[#071A33]/10 bg-white px-3 text-sm outline-none transition focus:border-[#071A33]/30 focus:ring-2 focus:ring-[#071A33]/10 disabled:opacity-50"
                />
              </div>

              {/* NAME */}

              <div className="space-y-2">
                <label
                  htmlFor="edit-student-name"
                  className="text-sm font-medium"
                >
                  Name
                </label>

                <input
                  id="edit-student-name"
                  type="text"
                  value={editStudentName}
                  onChange={(event) => setEditStudentName(event.target.value)}
                  disabled={isUpdating}
                  className="h-11 w-full rounded-lg border border-[#071A33]/10 bg-white px-3 text-sm outline-none transition focus:border-[#071A33]/30 focus:ring-2 focus:ring-[#071A33]/10 disabled:opacity-50"
                />
              </div>

              {/* PHOTOS */}

              <div className="grid gap-5 sm:grid-cols-2">
                {/* PHOTO 1 */}

                <div className="space-y-2">
                  <label htmlFor="edit-photo-1" className="text-sm font-medium">
                    Photo 1
                  </label>

                  {editingStudent?.photo1Key ? (
                    <img
                      src={getPhotoUrl(editingStudent.photo1Key) ?? ""}
                      alt={`${editingStudent.name} Photo 1`}
                      className="h-24 w-full rounded-lg object-cover"
                    />
                  ) : (
                    <div className="flex h-24 items-center justify-center rounded-lg bg-[#F5F7FA] text-[10px] uppercase tracking-[0.1em] text-[#071A33]/30">
                      No Photo
                    </div>
                  )}

                  <input
                    id="edit-photo-1"
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    disabled={isUpdating}
                    onChange={(event) =>
                      setEditPhoto1(event.target.files?.[0] ?? null)
                    }
                    className="block w-full cursor-pointer rounded-lg border border-[#071A33]/10 bg-white text-xs file:mr-3 file:border-0 file:bg-[#071A33] file:px-3 file:py-2.5 file:text-xs file:font-medium file:text-white hover:file:bg-[#0B2545]"
                  />

                  {editPhoto1 && (
                    <p className="text-xs text-[#071A33]/45">
                      Selected: {editPhoto1.name}
                    </p>
                  )}
                </div>

                {/* PHOTO 2 */}

                <div className="space-y-2">
                  <label htmlFor="edit-photo-2" className="text-sm font-medium">
                    Photo 2
                  </label>

                  {editingStudent?.photo2Key ? (
                    <img
                      src={getPhotoUrl(editingStudent.photo2Key) ?? ""}
                      alt={`${editingStudent.name} Photo 2`}
                      className="h-24 w-full rounded-lg object-cover"
                    />
                  ) : (
                    <div className="flex h-24 items-center justify-center rounded-lg bg-[#F5F7FA] text-[10px] uppercase tracking-[0.1em] text-[#071A33]/30">
                      No Photo
                    </div>
                  )}

                  <input
                    id="edit-photo-2"
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    disabled={isUpdating}
                    onChange={(event) =>
                      setEditPhoto2(event.target.files?.[0] ?? null)
                    }
                    className="block w-full cursor-pointer rounded-lg border border-[#071A33]/10 bg-white text-xs file:mr-3 file:border-0 file:bg-[#071A33] file:px-3 file:py-2.5 file:text-xs file:font-medium file:text-white hover:file:bg-[#0B2545]"
                  />

                  {editPhoto2 && (
                    <p className="text-xs text-[#071A33]/45">
                      Selected: {editPhoto2.name}
                    </p>
                  )}
                </div>
              </div>

              <p className="text-xs leading-5 text-[#071A33]/40">
                Leave both photo fields empty to keep the current photos.
                <br />
                To replace photos, select both Photo 1 and Photo 2.
                <br />
                Supported formats: JPG, PNG, and WebP. Maximum 10 MB per photo.
              </p>

              {editError && <p className="text-sm text-red-600">{editError}</p>}

              <div className="flex justify-end gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsEditDialogOpen(false)}
                  disabled={isUpdating}
                >
                  Cancel
                </Button>

                <Button
                  type="submit"
                  disabled={isUpdating}
                  className="bg-[#071A33] text-white hover:bg-[#0B2545]"
                >
                  {isUpdating ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </main>
  );
}

export default Students;
