
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
  deletePhotoFile(student.photo3Key);

  return deletedStudent;
};

type UpdateStudentPhotosInput = {
  photo1Key?: string;
  photo2Key?: string;
  photo3Key?: string;
};

export const updateStudentPhotosService = async (
  studentId: number,
  eventId: number,
  photos: UpdateStudentPhotosInput,
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

  const updatedStudent = await prisma.student.update({
    where: {
      id: studentId,
    },
    data: {
      ...(photos.photo1Key !== undefined
        ? { photo1Key: photos.photo1Key }
        : {}),
      ...(photos.photo2Key !== undefined
        ? { photo2Key: photos.photo2Key }
        : {}),
      ...(photos.photo3Key !== undefined
        ? { photo3Key: photos.photo3Key }
        : {}),
    },
  });

  if (
    photos.photo1Key !== undefined &&
    student.photo1Key &&
    student.photo1Key !== photos.photo1Key
  ) {
    deletePhotoFile(student.photo1Key);
  }

  if (
    photos.photo2Key !== undefined &&
    student.photo2Key &&
    student.photo2Key !== photos.photo2Key
  ) {
    deletePhotoFile(student.photo2Key);
  }

  if (
    photos.photo3Key !== undefined &&
    student.photo3Key &&
    student.photo3Key !== photos.photo3Key
  ) {
    deletePhotoFile(student.photo3Key);
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
