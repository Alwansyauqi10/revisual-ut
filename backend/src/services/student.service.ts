import { prisma } from "../lib/prisma.js";
import { deletePhotoFile } from "../lib/photo-storage.js";

export const createStudentService = async (
  sequenceNumber: number,
  nim: string,
  name: string,
  eventId: number,
  isAbsent: boolean = false,
) => {
  return prisma.student.create({
    data: {
      sequenceNumber,
      nim,
      name,
      eventId,
      isAbsent,
    },
  });
};

export const getStudentsByEventService = async (
  eventId: number,
  search: string = "",
  page: number = 1,
  limit: number = 10,
) => {
  const skip = (page - 1) * limit;

  const where = {
    eventId,
    ...(search
      ? {
          OR: [
            {
              nim: {
                contains: search,
                mode: "insensitive" as const,
              },
            },
            {
              name: {
                contains: search,
                mode: "insensitive" as const,
              },
            },
          ],
        }
      : {}),
  };

  const [students, total] = await Promise.all([
    prisma.student.findMany({
      where,
      orderBy: {
        sequenceNumber: "asc",
      },
      skip,
      take: limit,
    }),

    prisma.student.count({
      where,
    }),
  ]);

  return {
    students,
    total,
  };
};

export const getStudentByIdService = async (
  studentId: number,
  eventId: number,
) => {
  const student = await prisma.student.findUnique({
    where: {
      id: studentId,
    },
  });

  if (!student) {
    return null;
  }

  if (student.eventId !== eventId) {
    return null;
  }

  return student;
};

export const updateStudentService = async (
  studentId: number,
  eventId: number,
  sequenceNumber: number,
  nim: string,
  name: string,
  isAbsent?: boolean,
) => {
  const student = await prisma.student.findUnique({
    where: {
      id: studentId,
    },
  });

  if (!student) {
    return null;
  }

  if (student.eventId !== eventId) {
    return null;
  }

  return prisma.student.update({
    where: {
      id: studentId,
    },
    data: {
      sequenceNumber,
      nim,
      name,
      ...(isAbsent !== undefined ? { isAbsent } : {}),
    },
  });
};

export const deleteStudentService = async (
  studentId: number,
  eventId: number,
) => {
  const student = await prisma.student.findUnique({
    where: {
      id: studentId,
    },
  });

  if (!student) {
    return null;
  }

  if (student.eventId !== eventId) {
    return null;
  }

  const deletedStudent = await prisma.student.delete({
    where: {
      id: studentId,
    },
  });

  deletePhotoFile(student.photo1Key);
  deletePhotoFile(student.photo2Key);

  return deletedStudent;
};

export const updateStudentPhotosService = async (
  studentId: number,
  eventId: number,
  photo1Key: string | null,
  photo2Key: string | null,
) => {
  const student = await prisma.student.findUnique({
    where: {
      id: studentId,
    },
  });

  if (!student) {
    return null;
  }

  if (student.eventId !== eventId) {
    return null;
  }

  const oldPhoto1Key = student.photo1Key;
  const oldPhoto2Key = student.photo2Key;

  const updatedStudent = await prisma.student.update({
    where: {
      id: studentId,
    },
    data: {
      photo1Key,
      photo2Key,
    },
  });

  if (
    oldPhoto1Key &&
    oldPhoto1Key !== photo1Key
  ) {
    deletePhotoFile(oldPhoto1Key);
  }

  if (
    oldPhoto2Key &&
    oldPhoto2Key !== photo2Key
  ) {
    deletePhotoFile(oldPhoto2Key);
  }

  return updatedStudent;
};

export const getStudentByNimService = async (
  nim: string,
) => {
  return prisma.student.findUnique({
    where: {
      nim,
    },
    include: {
      event: true,
    },
  });
};