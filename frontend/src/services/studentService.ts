import { axiosInstance } from "../lib/axios";

export interface GetStudentsParams {
  search?: string;
  page?: number;
  limit?: number;
}

export const getStudentsService = async (
  eventId: number,
  params?: GetStudentsParams,
) => {
  const response = await axiosInstance.get(
    `/events/${eventId}/students`,
    { params },
  );

  return response.data;
};

export const createStudentService = async (
  eventId: number,
  sequenceNumber: number,
  nim: string,
  name: string,
) => {
  const response = await axiosInstance.post(
    `/events/${eventId}/students`,
    {
      sequenceNumber,
      nim,
      name,
      isAbsent: false,
    },
  );

  return response.data;
};

export const updateStudentService = async (
  eventId: number,
  studentId: number,
  sequenceNumber: number,
  nim: string,
  name: string,
  isAbsent: boolean,
) => {
  const response = await axiosInstance.put(
    `/events/${eventId}/students/${studentId}`,
    {
      sequenceNumber,
      nim,
      name,
      isAbsent,
    },
  );

  return response.data;
};

export const deleteStudentService = async (
  eventId: number,
  studentId: number,
) => {
  const response = await axiosInstance.delete(
    `/events/${eventId}/students/${studentId}`,
  );

  return response.data;
};


export const uploadStudentPhotosService = async (
  eventId: number,
  studentId: number,
  photos: {
    photo1?: File;
    photo2?: File;
    photo3?: File;
  },
) => {
  const formData = new FormData();

  if (photos.photo1) {
    formData.append("photo1", photos.photo1);
  }

  if (photos.photo2) {
    formData.append("photo2", photos.photo2);
  }

  if (photos.photo3) {
    formData.append("photo3", photos.photo3);
  }

  if (
    !photos.photo1 &&
    !photos.photo2 &&
    !photos.photo3
  ) {
    throw new Error("At least one photo must be selected.");
  }

  const response = await axiosInstance.post(
    `/events/${eventId}/students/${studentId}/photos`,
    formData,
  );

  return response.data;
};
