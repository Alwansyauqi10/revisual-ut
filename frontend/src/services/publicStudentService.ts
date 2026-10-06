import { axiosInstance } from "../lib/axios";

export interface PublicStudentEvent {
  id: number;
  name: string;
  date: string;
}

export interface PublicStudent {
  id: any;
  nim: string;
  name: string;
  event: PublicStudentEvent;
  photo1Key?: string;
  photo2Key?: string;
}

export interface PublicStudentSearchResponse {
  message: string;
  data: PublicStudent;
}

export const searchStudentByNimService = async (
  nim: string,
) => {
  const response =
    await axiosInstance.get<PublicStudentSearchResponse>(
      "/students/search",
      {
        params: {
          nim,
        },
      },
    );

  return response.data;
};