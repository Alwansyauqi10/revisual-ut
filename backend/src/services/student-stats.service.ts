import { prisma } from "../lib/prisma.js";

export const getStudentStatsService = async (
  eventId: number,
) => {
  const event = await prisma.event.findUnique({
    where: { id: eventId },
    select: { id: true },
  });

  if (!event) {
    return null;
  }

  const [
    totalStudents,
    present,
    absent,
    photos0,
    photos1,
    photos2,
  ] = await Promise.all([
    prisma.student.count({
      where: {
        eventId,
      },
    }),

    prisma.student.count({
      where: {
        eventId,
        isAbsent: false,
      },
    }),

    prisma.student.count({
      where: {
        eventId,
        isAbsent: true,
      },
    }),

    prisma.student.count({
      where: {
        eventId,
        photo1Key: null,
        photo2Key: null,
      },
    }),

    prisma.student.count({
      where: {
        eventId,
        OR: [
          {
            photo1Key: {
              not: null,
            },
            photo2Key: null,
          },
          {
            photo1Key: null,
            photo2Key: {
              not: null,
            },
          },
        ],
      },
    }),

    prisma.student.count({
      where: {
        eventId,
        photo1Key: {
          not: null,
        },
        photo2Key: {
          not: null,
        },
      },
    }),
  ]);

  return {
    totalStudents,
    present,
    absent,
    photos0,
    photos1,
    photos2,
  };
};