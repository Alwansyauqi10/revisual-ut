import { prisma } from "../lib/prisma.js";

export const createEventService = async (
  name: string,
  date: Date,
) => {
  return prisma.event.create({
    data: {
      name,
      date,
    },
  });
};

export const getEventsService = async (
  search: string,
  page: number,
  limit: number,
) => {
  const skip = (page - 1) * limit;

  const where = search
    ? {
        name: {
          contains: search,
          mode: "insensitive" as const,
        },
      }
    : undefined;

  const [events, total] = await Promise.all([
    prisma.event.findMany({
      where,
      skip,
      take: limit,
      orderBy: {
        date: "desc",
      },
    }),

    prisma.event.count({
      where,
    }),
  ]);

  const totalPages = Math.ceil(total / limit);

  return {
    events,
    meta: {
      page,
      limit,
      total,
      totalPages,
    },
  };
};

export const getEventByIdService = async (
  id: number,
) => {
  return prisma.event.findUnique({
    where: {
      id,
    },
  });
};

export const updateEventService = async (
  id: number,
  name: string,
  date: Date,
) => {
  return prisma.event.update({
    where: {
      id,
    },
    data: {
      name,
      date,
    },
  });
};