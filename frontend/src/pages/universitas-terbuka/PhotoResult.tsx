import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router";

import {
  searchStudentByNimService,
  type PublicStudent,
} from "@/services/publicStudentService";

const API_URL = import.meta.env.VITE_BASE_URL_API;

function PhotoResult() {
  const [searchParams] = useSearchParams();

  const nim = searchParams.get("nim");

  const [student, setStudent] = useState<PublicStudent | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  // =====================================================
  // GET STUDENT
  // =====================================================

  useEffect(() => {
    const getStudent = async () => {
      if (!nim) {
        setErrorMessage("NIM is required.");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setErrorMessage("");

        const response = await searchStudentByNimService(nim);

        setStudent(response.data);
      } catch (error: any) {
        console.error("GAGAL MENGAMBIL STUDENT:", error);

        if (error?.response?.status === 404) {
          setErrorMessage("We couldn't find a student with that NIM.");
        } else {
          setErrorMessage("Something went wrong. Please try again.");
        }
      } finally {
        setIsLoading(false);
      }
    };

    getStudent();
  }, [nim]);

  // =====================================================
  // DOWNLOAD PHOTO
  // =====================================================

  const handleDownload = async (url: string, fileName: string) => {
    try {
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error("Failed to download photo.");
      }

      const blob = await response.blob();

      const blobUrl = window.URL.createObjectURL(blob);

      const link = document.createElement("a");

      link.href = blobUrl;
      link.download = fileName;

      document.body.appendChild(link);

      link.click();

      link.remove();

      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error("GAGAL DOWNLOAD FOTO:", error);
    }
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#071A33] px-6 text-white">
        <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-white/40">
          Loading your memories...
        </p>
      </main>
    );
  }

  // =====================================================
  // ERROR
  // =====================================================

  if (errorMessage || !student) {
    return (
      <main className="min-h-screen bg-[#071A33] px-6 py-24 text-white">
        <div className="mx-auto flex min-h-[70vh] max-w-3xl flex-col items-center justify-center text-center">
          <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-white/40">
            Graduation Photos
          </p>

          <h1 className="font-display mt-6 text-4xl font-semibold leading-[0.95] tracking-[-0.03em] sm:text-5xl">
            WE COULDN'T FIND
            <br />
            YOUR PHOTOS.
          </h1>

          <p className="mt-6 max-w-md text-sm leading-6 text-white/45">
            {errorMessage ?? "We couldn't find the student information."}
          </p>

          <Link
            to="/universitas-terbuka"
            className="mt-10 border-b border-white/30 pb-1 text-[10px] font-medium uppercase tracking-[0.15em] text-white transition hover:border-white"
          >
            Search Again →
          </Link>
        </div>
      </main>
    );
  }

  // =====================================================
  // PHOTO URL
  // =====================================================

  const photo1Url = student.photo1Key ? `${API_URL}${student.photo1Key}` : null;

  const photo2Url = student.photo2Key ? `${API_URL}${student.photo2Key}` : null;

  // =====================================================
  // PHOTO NOT AVAILABLE
  // =====================================================

  if (!photo1Url || !photo2Url) {
    return (
      <main className="min-h-screen bg-[#071A33] px-6 py-24 text-white">
        <div className="mx-auto flex min-h-[70vh] max-w-3xl flex-col items-center justify-center text-center">
          <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-white/40">
            {student.event.name}
          </p>

          <h1 className="font-display mt-6 text-4xl font-semibold leading-[0.95] tracking-[-0.03em] sm:text-5xl">
            YOUR PHOTOS
            <br />
            ARE COMING SOON.
          </h1>

          <p className="mt-6 max-w-md text-sm leading-6 text-white/45">
            Hi {student.name}, your graduation photos are not available yet.{" "}
            <a
              href={`https://wa.me/6285780709579?text=${encodeURIComponent(
                `Halo Revisual Production, saya ingin meminta bantuan terkait foto wisuda.

                  Nama:
                  NIM:
                  Kendala:
                  `,
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-4 transition-colors hover:text-white"
            >
              Click for Contact Admin
            </a>
          </p>

          <Link
            to="/universitas-terbuka"
            className="mt-10 border-b border-white/30 pb-1 text-[10px] font-medium uppercase tracking-[0.15em] text-white transition hover:border-white"
          >
            Search Again →
          </Link>
        </div>
      </main>
    );
  }

  // =====================================================
  // DATE
  // =====================================================

  const formattedDate = new Date(student.event.date).toLocaleDateString(
    "en-US",
    {
      month: "long",
      day: "numeric",
      year: "numeric",
    },
  );

  // =====================================================
  // MAIN
  // =====================================================

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#071A33] text-white">
      {/* =================================================
          BACKGROUND
      ================================================= */}

      <div
        className="pointer-events-none absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage:
            "url('/Universitas%20Terbuka%20Graduation%20Dreams.png')",
        }}
      />

      {/* Main overlay */}

      <div className="pointer-events-none absolute inset-0 bg-[#071A33]/55 sm:bg-[#071A33]/45" />

      {/* Top protection */}

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#071A33]/90 via-[#071A33]/30 to-[#071A33]/90" />

      {/* Bottom fade */}

      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[400px] bg-gradient-to-t from-[#071A33] via-[#071A33]/65 to-transparent" />

      {/* =================================================
          CONTENT
      ================================================= */}

      <div className="relative z-10 mx-auto max-w-[1400px] px-5 pb-20 pt-8 sm:px-8 sm:pb-24 sm:pt-12 lg:px-16 lg:pt-16">
        {/* =================================================
            TOP BAR
        ================================================= */}

        <div className="flex items-center justify-between">
          <Link
            to="/universitas-terbuka"
            className="text-[9px] font-medium uppercase tracking-[0.18em] text-white/45 transition hover:text-white sm:text-[11px]"
          >
            ← Search Again
          </Link>

          <p className="hidden text-[10px] font-medium uppercase tracking-[0.18em] text-white/25 sm:block">
            Revisual Production
          </p>
        </div>

        {/* =================================================
            HERO / INTRO
        ================================================= */}

        <section className="pt-14 sm:pt-20 lg:pt-28">
          <div className="grid gap-8 lg:grid-cols-[1fr_320px] lg:items-end lg:gap-16">
            {/* LEFT CONTENT */}

            <div>
              <p className="text-[9px] font-medium uppercase tracking-[0.2em] text-white/50 sm:text-xs">
                {student.event.name}
              </p>

              <h1 className="font-display mt-4 max-w-5xl text-[2.65rem] font-semibold leading-[0.94] tracking-[-0.045em] sm:mt-6 sm:text-6xl lg:text-8xl">
                Congratulations,
                <br />
                <span className="font-normal text-white/90">
                  {student.name}.
                </span>
              </h1>

              <p className="mt-5 max-w-xl text-xs leading-6 text-white/50 sm:mt-8 sm:text-base sm:leading-7">
                Here are your graduation photos.
                <br className="hidden sm:block" />
                Thank you for being part of this special moment.
              </p>
            </div>

            {/* =================================================
                DESKTOP META
            ================================================= */}

            <div className="hidden justify-end lg:flex">
              <div className="border-r border-white/20 pr-6 text-right">
                <div>
                  <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-white/30">
                    NIM
                  </p>

                  <p className="mt-2 text-sm text-white/80">{student.nim}</p>
                </div>

                <div className="mt-7">
                  <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-white/30">
                    Graduation Date
                  </p>

                  <p className="mt-2 text-sm text-white/80">{formattedDate}</p>
                </div>

                <div className="mt-7">
                  <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-white/30">
                    Event
                  </p>

                  <p className="mt-2 text-sm text-white/80">
                    {student.event.name}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* =================================================
              MOBILE META
          ================================================= */}

          <div className="mt-8 grid grid-cols-3 border-y border-white/10 py-5 lg:hidden">
            {/* NIM */}

            <div className="border-r border-white/10 pr-3">
              <p className="text-[8px] font-medium uppercase tracking-[0.16em] text-white/30">
                NIM
              </p>

              <p className="mt-1.5 text-[10px] text-white/75 sm:text-xs">
                {student.nim}
              </p>
            </div>

            {/* DATE */}

            <div className="border-r border-white/10 px-3">
              <p className="text-[8px] font-medium uppercase tracking-[0.16em] text-white/30">
                Graduation
              </p>

              <p className="mt-1.5 text-[10px] leading-4 text-white/75 sm:text-xs">
                {formattedDate}
              </p>
            </div>

            {/* EVENT */}

            <div className="pl-3 text-right">
              <p className="text-[8px] font-medium uppercase tracking-[0.16em] text-white/30">
                Event
              </p>

              <p className="mt-1.5 text-[10px] leading-4 text-white/75 sm:text-xs">
                {student.event.name}
              </p>
            </div>
          </div>

          {/* =================================================
              COLLECTION HEADER
          ================================================= */}

          <div className="mt-8 flex items-center justify-between sm:mt-14 lg:mt-20">
            <p className="text-[8px] font-medium uppercase tracking-[0.2em] text-white/30 sm:text-[10px]">
              Graduation Collection
            </p>

            <p className="text-[8px] font-medium uppercase tracking-[0.2em] text-white/30 sm:text-[10px]">
              02 Photos
            </p>
          </div>
        </section>

        {/* =================================================
            PHOTO GRID
        ================================================= */}

        <section className="mt-4 sm:mt-8 lg:mt-10">
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2 lg:gap-6">
            {/* =================================================
                PHOTO 01
            ================================================= */}

            <article className="group overflow-hidden rounded-[1.15rem] border border-white/10 bg-[#071A33]/80 shadow-2xl sm:rounded-[1.5rem]">
              <div className="relative aspect-[4/3] overflow-hidden">
                <img
                  src={photo1Url}
                  alt={`${student.name} graduation photo 1`}
                  className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.02]"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-black/10" />

                {/* Number */}

                <div className="absolute left-4 top-4 flex items-center gap-2 sm:left-5 sm:top-5 sm:gap-3">
                  <span className="text-[10px] font-medium tracking-[0.15em] text-white sm:text-xs">
                    01
                  </span>

                  <span className="h-px w-6 bg-white/60 sm:w-8" />
                </div>

                {/* Label */}

                <p className="absolute right-4 top-4 text-[8px] font-medium uppercase tracking-[0.15em] text-white/80 sm:right-5 sm:top-5 sm:text-[10px]">
                  Graduation Moment
                </p>
              </div>

              <div className="flex items-center justify-between gap-4 px-4 py-4 sm:px-6 sm:py-5">
                <div className="min-w-0">
                  <p className="text-xs font-medium text-white/75">
                    The moment.
                  </p>

                  <p className="mt-1 hidden text-xs leading-5 text-white/35 sm:block">
                    A story of dedication, growth, and new beginnings.
                  </p>
                </div>

                {/* DOWNLOAD */}

                <button
                  type="button"
                  onClick={() =>
                    handleDownload(photo1Url, `${student.nim}-photo-1.JPG`)
                  }
                  className="shrink-0 rounded-full bg-white px-4 py-2.5 text-[10px] font-medium text-[#071A33] transition hover:bg-white/90 active:scale-[0.98] sm:px-5 sm:py-3 sm:text-xs"
                >
                  Download ↓
                </button>
              </div>
            </article>

            {/* =================================================
                PHOTO 02
            ================================================= */}

            <article className="group overflow-hidden rounded-[1.15rem] border border-white/10 bg-[#071A33]/80 shadow-2xl sm:rounded-[1.5rem]">
              <div className="relative aspect-[4/3] overflow-hidden">
                <img
                  src={photo2Url}
                  alt={`${student.name} graduation photo 2`}
                  className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.02]"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-black/10" />

                {/* Number */}

                <div className="absolute left-4 top-4 flex items-center gap-2 sm:left-5 sm:top-5 sm:gap-3">
                  <span className="text-[10px] font-medium tracking-[0.15em] text-white sm:text-xs">
                    02
                  </span>

                  <span className="h-px w-6 bg-white/60 sm:w-8" />
                </div>

                {/* Label */}

                <p className="absolute right-4 top-4 text-[8px] font-medium uppercase tracking-[0.15em] text-white/80 sm:right-5 sm:top-5 sm:text-[10px]">
                  Graduation Moment
                </p>
              </div>

              <div className="flex items-center justify-between gap-4 px-4 py-4 sm:px-6 sm:py-5">
                <div className="min-w-0">
                  <p className="text-xs font-medium text-white/75">
                    The memory.
                  </p>

                  <p className="mt-1 hidden text-xs leading-5 text-white/35 sm:block">
                    A moment worth looking back on, always.
                  </p>
                </div>

                {/* DOWNLOAD */}

                <button
                  type="button"
                  onClick={() =>
                    handleDownload(photo2Url, `${student.nim}-photo-2.JPG`)
                  }
                  className="shrink-0 rounded-full bg-white px-4 py-2.5 text-[10px] font-medium text-[#071A33] transition hover:bg-white/90 active:scale-[0.98] sm:px-5 sm:py-3 sm:text-xs"
                >
                  Download ↓
                </button>
              </div>
            </article>
          </div>
        </section>

        {/* =================================================
            CLOSING
        ================================================= */}

        <section className="mt-20 sm:mt-28 lg:mt-36">
          <div className="grid gap-10 lg:grid-cols-2 lg:items-end">
            <div>
              <p className="text-[9px] font-medium uppercase tracking-[0.22em] text-white/30 sm:text-[10px]">
                Wishing You
              </p>

              <h2 className="font-display mt-4 text-4xl font-semibold leading-[0.95] tracking-[-0.04em] sm:mt-5 sm:text-5xl lg:text-6xl">
                A Brighter
                <br />
                Tomorrow.
              </h2>
            </div>

            <div className="lg:pb-1 lg:text-right">
              <p className="max-w-lg text-xs leading-6 text-white/40 sm:ml-auto sm:text-sm sm:leading-7">
                May this milestone be the beginning of new opportunities, bigger
                dreams, and more meaningful journeys ahead.
              </p>

              <Link
                to="/universitas-terbuka"
                className="mt-6 inline-flex border-b border-white/20 pb-1 text-[9px] font-medium uppercase tracking-[0.18em] text-white/50 transition hover:border-white hover:text-white sm:mt-8 sm:text-[10px]"
              >
                Search Another NIM →
              </Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

export default PhotoResult;
