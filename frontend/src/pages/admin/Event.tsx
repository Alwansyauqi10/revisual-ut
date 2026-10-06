import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";

import { Button } from "@/components/ui/button";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import {
  createEventService,
  getEventsService,
  updateEventService,
} from "@/services/eventService";

import { clearAuth } from "@/services/authStorage";

interface Event {
  id: number;
  name: string;
  date: string;
  photosAvailable: boolean;
  photoDeletedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

function Events() {
  const navigate = useNavigate();

  // =========================================================
  // EVENTS
  // =========================================================

  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // =========================================================
  // SEARCH
  // =========================================================

  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");

  const SEARCH_DEBOUNCE_DELAY = 400;

  // =========================================================
  // PAGINATION
  // =========================================================

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalEvents, setTotalEvents] = useState(0);

  const EVENTS_PER_PAGE = 5;

  // =========================================================
  // CREATE
  // =========================================================

  const [isCreateDialogOpen, setIsCreateDialogOpen] =
    useState(false);

  const [eventName, setEventName] = useState("");
  const [eventDate, setEventDate] = useState("");

  const [isCreating, setIsCreating] = useState(false);
  const [createError, setCreateError] = useState("");

  // =========================================================
  // EDIT
  // =========================================================

  const [isEditDialogOpen, setIsEditDialogOpen] =
    useState(false);

  const [editingEvent, setEditingEvent] =
    useState<Event | null>(null);

  const [editEventName, setEditEventName] = useState("");
  const [editEventDate, setEditEventDate] = useState("");

  const [isUpdating, setIsUpdating] = useState(false);
  const [editError, setEditError] = useState("");

  // =========================================================
  // GET EVENTS
  // =========================================================

  const getEvents = async () => {
    try {
      setIsLoading(true);

      const data = await getEventsService({
        search,
        page: currentPage,
        limit: EVENTS_PER_PAGE,
      });

      setEvents(data.data);
      setTotalEvents(data.meta.total);
      setTotalPages(data.meta.totalPages);
    } catch (error) {
      console.error("GAGAL MENGAMBIL EVENTS:", error);

      setEvents([]);
      setTotalEvents(0);
      setTotalPages(0);
    } finally {
      setIsLoading(false);
    }
  };

  // =========================================================
  // INITIAL LOAD / PAGINATION / SEARCH
  // =========================================================

  useEffect(() => {
    getEvents();
  }, [search, currentPage]);

  // =========================================================
  // SEARCH - DEBOUNCE
  // =========================================================

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setSearch(searchInput.trim());
      setCurrentPage(1);
    }, SEARCH_DEBOUNCE_DELAY);

    return () => {
      window.clearTimeout(timeout);
    };
  }, [searchInput]);

  // =========================================================
  // CLEAR SEARCH
  // =========================================================

  const handleClearSearch = () => {
    setSearchInput("");
    setSearch("");
    setCurrentPage(1);
  };

  // =========================================================
  // CREATE EVENT
  // =========================================================

  const handleCreateEvent = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    if (!eventName.trim() || !eventDate) {
      setCreateError(
        "Event name and date are required.",
      );
      return;
    }

    try {
      setIsCreating(true);
      setCreateError("");

      await createEventService(
        eventName.trim(),
        eventDate,
      );

      setEventName("");
      setEventDate("");
      setIsCreateDialogOpen(false);

      setCurrentPage(1);

      // Refresh current event list.
      if (currentPage === 1) {
        await getEvents();
      }
    } catch (error) {
      console.error(
        "GAGAL MEMBUAT EVENT:",
        error,
      );

      setCreateError(
        "Failed to create event. Please try again.",
      );
    } finally {
      setIsCreating(false);
    }
  };

  // =========================================================
  // OPEN EDIT
  // =========================================================

  const handleOpenEdit = (event: Event) => {
    setEditingEvent(event);
    setEditEventName(event.name);
    setEditEventDate(event.date.slice(0, 10));
    setEditError("");
    setIsEditDialogOpen(true);
  };

  // =========================================================
  // UPDATE EVENT
  // =========================================================

  const handleUpdateEvent = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    if (!editingEvent) {
      return;
    }

    if (
      !editEventName.trim() ||
      !editEventDate
    ) {
      setEditError(
        "Event name and date are required.",
      );
      return;
    }

    try {
      setIsUpdating(true);
      setEditError("");

      const response = await updateEventService(
        editingEvent.id,
        editEventName.trim(),
        editEventDate,
      );

      setEvents((currentEvents) =>
        currentEvents.map((currentEvent) =>
          currentEvent.id === editingEvent.id
            ? response.data
            : currentEvent,
        ),
      );

      setIsEditDialogOpen(false);
      setEditingEvent(null);
      setEditEventName("");
      setEditEventDate("");
    } catch (error) {
      console.error(
        "GAGAL UPDATE EVENT:",
        error,
      );

      setEditError(
        "Failed to update event. Please try again.",
      );
    } finally {
      setIsUpdating(false);
    }
  };

  // =========================================================
  // LOGOUT
  // =========================================================

  const handleLogout = () => {
    clearAuth();

    navigate("/admin/login", {
      replace: true,
    });
  };

  // =========================================================
  // EVENT DATE
  // =========================================================

  const formatEventDate = (date: string) => {
    return new Date(date).toLocaleDateString(
      "en-US",
      {
        month: "long",
        day: "numeric",
        year: "numeric",
      },
    );
  };

  // =========================================================
  // UI
  // =========================================================

  return (
    <main className="min-h-screen bg-[#F5F7FA] px-6 py-12 text-[#071A33] lg:py-16">
      <div className="mx-auto max-w-7xl">

        {/* =====================================================
            HEADER
        ===================================================== */}

        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">

          <div className="min-w-0">
            <div className="mt-7 flex flex-wrap items-center gap-3">
              <span className="rounded-full border border-[#071A33]/8 bg-white px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#071A33]/55 shadow-sm">
                Event Management
              </span>

              <span className="text-xs text-[#071A33]/40">
                Graduation Events
              </span>
            </div>

            <h1 className="font-display mt-4 text-4xl font-semibold tracking-[-0.03em] sm:text-5xl">
              EVENTS.
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-[#071A33]/50">
              Manage graduation events and
              student records for Revisual
              Production.
            </p>
          </div>

          {/* HEADER ACTIONS */}

          <div className="flex shrink-0 gap-3">

            {/* CREATE EVENT */}

            <Dialog
              open={isCreateDialogOpen}
              onOpenChange={(open) => {
                setIsCreateDialogOpen(open);

                if (!open && !isCreating) {
                  setEventName("");
                  setEventDate("");
                  setCreateError("");
                }
              }}
            >
              <DialogTrigger asChild>
                <Button
                  type="button"
                  className="h-11 rounded-xl bg-[#071A33] px-5 text-sm font-medium text-white shadow-sm transition hover:bg-[#0B2545] hover:shadow-md"
                >
                  <span className="mr-2 text-base leading-none">
                    +
                  </span>
                  Create Event
                </Button>
              </DialogTrigger>

              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle className="font-display text-2xl">
                    Create Event
                  </DialogTitle>

                  <DialogDescription>
                    Add a new graduation event
                    for Revisual Production.
                  </DialogDescription>
                </DialogHeader>

                <form
                  onSubmit={handleCreateEvent}
                  className="mt-4 space-y-5"
                >

                  {/* EVENT NAME */}

                  <div className="space-y-2">
                    <label
                      htmlFor="event-name"
                      className="text-sm font-medium"
                    >
                      Event Name
                    </label>

                    <input
                      id="event-name"
                      type="text"
                      value={eventName}
                      onChange={(event) =>
                        setEventName(
                          event.target.value,
                        )
                      }
                      placeholder="UT Pusat Wilayah 1"
                      disabled={isCreating}
                      className="h-11 w-full rounded-lg border border-[#071A33]/10 bg-white px-3 text-sm outline-none transition placeholder:text-[#071A33]/30 focus:border-[#071A33]/30 focus:ring-2 focus:ring-[#071A33]/10 disabled:opacity-50"
                    />
                  </div>

                  {/* EVENT DATE */}

                  <div className="space-y-2">
                    <label
                      htmlFor="event-date"
                      className="text-sm font-medium"
                    >
                      Event Date
                    </label>

                    <input
                      id="event-date"
                      type="date"
                      value={eventDate}
                      onChange={(event) =>
                        setEventDate(
                          event.target.value,
                        )
                      }
                      disabled={isCreating}
                      className="h-11 w-full rounded-lg border border-[#071A33]/10 bg-white px-3 text-sm outline-none transition focus:border-[#071A33]/30 focus:ring-2 focus:ring-[#071A33]/10 disabled:opacity-50"
                    />
                  </div>

                  {/* ERROR */}

                  {createError && (
                    <p className="text-sm text-red-600">
                      {createError}
                    </p>
                  )}

                  {/* ACTIONS */}

                  <div className="flex justify-end gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() =>
                        setIsCreateDialogOpen(false)
                      }
                      disabled={isCreating}
                    >
                      Cancel
                    </Button>

                    <Button
                      type="submit"
                      disabled={isCreating}
                      className="bg-[#071A33] text-white hover:bg-[#0B2545]"
                    >
                      {isCreating
                        ? "Creating..."
                        : "Create Event"}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>

            {/* LOGOUT */}

            <Button
              type="button"
              variant="outline"
              onClick={handleLogout}
              className="h-11 rounded-xl border-[#071A33]/9 bg-white px-5 text-sm font-medium text-[#071A33]/70 transition hover:bg-[#F5F7FA] hover:text-[#071A33]"
            >
              Logout
            </Button>
          </div>
        </div>

        {/* =====================================================
            SEARCH / SUMMARY
        ===================================================== */}

        <div className="mt-10 rounded-2xl border border-[#071A33]/7 bg-white p-3 shadow-[0_10px_35px_rgba(7,26,51,0.04)]">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">

            {/* SEARCH INPUT */}

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
                  <circle
                    cx="11"
                    cy="11"
                    r="7"
                  />
                  <path d="m20 20-4-4" />
                </svg>
              </span>

              <input
                type="text"
                value={searchInput}
                onChange={(event) =>
                  setSearchInput(
                    event.target.value,
                  )
                }
                placeholder="Search by event name..."
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

                  <span
                    aria-hidden="true"
                    className="text-sm leading-none"
                  >
                    ×
                  </span>
                </button>
              )}
            </div>

            {/* SUMMARY */}

            <div className="flex h-12 shrink-0 items-center justify-center rounded-xl bg-[#F5F7FA] px-4 text-xs text-[#071A33]/45">
              {isLoading ? (
                <span className="inline-flex items-center gap-2">
                  <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-[#071A33]/15 border-t-[#071A33]/60" />

                  Searching
                </span>
              ) : (
                <span>
                  {totalEvents}{" "}
                  {totalEvents === 1
                    ? "event"
                    : "events"}
                </span>
              )}
            </div>
          </div>

          {/* SEARCH INFO */}

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
                Search updates automatically
                as you type.
              </p>
            )}
          </div>
        </div>

        {/* =====================================================
            EVENT TABLE
        ===================================================== */}

        <div className="mt-5 overflow-hidden rounded-2xl border border-[#071A33]/7 bg-white shadow-[0_10px_35px_rgba(7,26,51,0.04)]">

          {/* TABLE HEADER */}

          <div className="flex items-center justify-between border-b border-[#071A33]/6 px-5 py-4 sm:px-6">
            <div>
              <p className="text-sm font-semibold">
                Events
              </p>

              <p className="mt-0.5 text-xs text-[#071A33]/40">
                {isLoading
                  ? "Updating event list..."
                  : `${totalEvents} ${
                      totalEvents === 1
                        ? "record"
                        : "records"
                    }`}
              </p>
            </div>

            <span className="hidden rounded-full bg-[#F5F7FA] px-3 py-1.5 text-[11px] font-medium text-[#071A33]/45 sm:inline-flex">
              Page {currentPage} of{" "}
              {Math.max(totalPages, 1)}
            </span>
          </div>

          {/* LOADING */}

          {isLoading && events.length === 0 ? (
            <div className="space-y-3 p-5 sm:p-6">
              {Array.from({ length: 5 }).map(
                (_, index) => (
                  <div
                    key={index}
                    className="h-[70px] animate-pulse rounded-xl bg-[#F5F7FA]"
                  />
                ),
              )}
            </div>
          ) : events.length > 0 ? (
            <div className="overflow-x-auto">

              <table className="w-full min-w-[800px] border-collapse">

                {/* TABLE HEAD */}

                <thead>
                  <tr className="border-b border-[#071A33]/6 bg-[#FBFCFD] text-left">

                    <th className="px-6 py-4 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#071A33]/40">
                      Event
                    </th>

                    <th className="px-6 py-4 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#071A33]/40">
                      Date
                    </th>

                    <th className="px-6 py-4 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#071A33]/40">
                      Photo Status
                    </th>

                    <th className="px-6 py-4 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#071A33]/40">
                      Students
                    </th>

                    <th className="px-6 py-4 text-right text-[10px] font-semibold uppercase tracking-[0.16em] text-[#071A33]/40">
                      Actions
                    </th>
                  </tr>
                </thead>

                {/* TABLE BODY */}

                <tbody>
                  {events.map((event) => (
                    <tr
                      key={event.id}
                      className="group border-b border-[#071A33]/5 last:border-b-0"
                    >

                      {/* EVENT */}

                      <td className="px-6 py-4 align-middle">
                        <div className="flex items-center gap-3">

                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#E8F1F8]">
                            <span className="font-display text-xs font-semibold text-[#071A33]/35">
                              UT
                            </span>
                          </div>

                          <div className="min-w-0">
                            <p className="text-sm font-medium text-[#071A33]/80">
                              {event.name}
                            </p>

                            <p className="mt-0.5 text-xs text-[#071A33]/35">
                              Universitas Terbuka
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* DATE */}

                      <td className="px-6 py-4 align-middle">
                        <span className="text-sm text-[#071A33]/60">
                          {formatEventDate(
                            event.date,
                          )}
                        </span>
                      </td>

                      {/* PHOTO STATUS */}

                      <td className="px-6 py-4 align-middle">
                        {event.photosAvailable ? (
                          <span className="inline-flex rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.1em] text-emerald-600">
                            Available
                          </span>
                        ) : (
                          <span className="inline-flex rounded-full bg-[#F5F7FA] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.1em] text-[#071A33]/35">
                            Unavailable
                          </span>
                        )}
                      </td>

                      {/* STUDENTS */}

                      <td className="px-6 py-4 align-middle">
                        <Link
                          to={`/admin/events/${event.id}/students`}
                          className="inline-flex rounded-lg bg-[#071A33] px-3 py-2 text-xs font-medium text-white transition hover:bg-[#0B2545]"
                        >
                          Students
                        </Link>
                      </td>

                      {/* ACTIONS */}

                      <td className="px-6 py-4 align-middle">
                        <div className="flex justify-end gap-2">

                          <button
                            type="button"
                            onClick={() =>
                              handleOpenEdit(
                                event,
                              )
                            }
                            className="rounded-lg border border-[#071A33]/9 px-3 py-2 text-xs font-medium text-[#071A33]/70 transition hover:border-[#071A33]/15 hover:bg-[#F5F7FA] hover:text-[#071A33]"
                          >
                            Edit
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* UPDATE LOADING */}

              {isLoading && (
                <div className="flex items-center justify-center gap-2 border-t border-[#071A33]/5 bg-white py-3 text-xs text-[#071A33]/40">
                  <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-[#071A33]/15 border-t-[#071A33]/60" />

                  Updating results...
                </div>
              )}
            </div>
          ) : (
            /* EMPTY STATE */

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
                  <circle
                    cx="11"
                    cy="11"
                    r="7"
                  />

                  <path d="m20 20-4-4" />
                </svg>
              </div>

              <p className="mt-4 text-sm font-medium">
                {search
                  ? "No events found"
                  : "No events yet"}
              </p>

              <p className="mx-auto mt-1 max-w-sm text-xs leading-5 text-[#071A33]/40">
                {search
                  ? `No event matches “${search}”. Try a different event name.`
                  : "Create the first graduation event to get started."}
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

        {/* =====================================================
            PAGINATION
        ===================================================== */}

        {totalPages > 1 && (
          <div className="mt-5 flex flex-col items-center justify-between gap-3 sm:flex-row">

            <p className="text-xs text-[#071A33]/40">
              Page {currentPage} of{" "}
              {totalPages}
            </p>

            <div className="flex items-center gap-1.5">

              {/* PREVIOUS */}

              <Button
                type="button"
                variant="outline"
                disabled={currentPage === 1}
                onClick={() =>
                  setCurrentPage(
                    (page) => page - 1,
                  )
                }
                className="h-9 rounded-lg px-3 text-xs"
              >
                ← Previous
              </Button>

              {/* PAGE NUMBERS */}

              <div className="flex items-center gap-1.5">
                {Array.from(
                  {
                    length: Math.min(
                      totalPages,
                      5,
                    ),
                  },
                  (_, index) => {
                    if (totalPages <= 5) {
                      return index + 1;
                    }

                    if (currentPage <= 3) {
                      return index + 1;
                    }

                    if (
                      currentPage >=
                      totalPages - 2
                    ) {
                      return (
                        totalPages -
                        4 +
                        index
                      );
                    }

                    return (
                      currentPage -
                      2 +
                      index
                    );
                  },
                ).map((page) => (
                  <button
                    key={page}
                    type="button"
                    onClick={() =>
                      setCurrentPage(page)
                    }
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

              {/* NEXT */}

              <Button
                type="button"
                variant="outline"
                disabled={
                  currentPage === totalPages
                }
                onClick={() =>
                  setCurrentPage(
                    (page) => page + 1,
                  )
                }
                className="h-9 rounded-lg px-3 text-xs"
              >
                Next →
              </Button>
            </div>
          </div>
        )}

        {/* =====================================================
            EDIT EVENT DIALOG
        ===================================================== */}

        <Dialog
          open={isEditDialogOpen}
          onOpenChange={(open) => {
            setIsEditDialogOpen(open);

            if (!open && !isUpdating) {
              setEditingEvent(null);
              setEditEventName("");
              setEditEventDate("");
              setEditError("");
            }
          }}
        >
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="font-display text-2xl">
                Edit Event
              </DialogTitle>

              <DialogDescription>
                Update the graduation event
                information.
              </DialogDescription>
            </DialogHeader>

            <form
              onSubmit={handleUpdateEvent}
              className="mt-4 space-y-5"
            >

              {/* EVENT NAME */}

              <div className="space-y-2">
                <label
                  htmlFor="edit-event-name"
                  className="text-sm font-medium"
                >
                  Event Name
                </label>

                <input
                  id="edit-event-name"
                  type="text"
                  value={editEventName}
                  onChange={(event) =>
                    setEditEventName(
                      event.target.value,
                    )
                  }
                  disabled={isUpdating}
                  className="h-11 w-full rounded-lg border border-[#071A33]/10 bg-white px-3 text-sm outline-none transition focus:border-[#071A33]/30 focus:ring-2 focus:ring-[#071A33]/10 disabled:opacity-50"
                />
              </div>

              {/* EVENT DATE */}

              <div className="space-y-2">
                <label
                  htmlFor="edit-event-date"
                  className="text-sm font-medium"
                >
                  Event Date
                </label>

                <input
                  id="edit-event-date"
                  type="date"
                  value={editEventDate}
                  onChange={(event) =>
                    setEditEventDate(
                      event.target.value,
                    )
                  }
                  disabled={isUpdating}
                  className="h-11 w-full rounded-lg border border-[#071A33]/10 bg-white px-3 text-sm outline-none transition focus:border-[#071A33]/30 focus:ring-2 focus:ring-[#071A33]/10 disabled:opacity-50"
                />
              </div>

              {/* ERROR */}

              {editError && (
                <p className="text-sm text-red-600">
                  {editError}
                </p>
              )}

              {/* ACTIONS */}

              <div className="flex justify-end gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() =>
                    setIsEditDialogOpen(false)
                  }
                  disabled={isUpdating}
                >
                  Cancel
                </Button>

                <Button
                  type="submit"
                  disabled={isUpdating}
                  className="bg-[#071A33] text-white hover:bg-[#0B2545]"
                >
                  {isUpdating
                    ? "Saving..."
                    : "Save Changes"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </main>
  );
}

export default Events;