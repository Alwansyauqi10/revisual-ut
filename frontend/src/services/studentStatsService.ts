import { axiosInstance } from "@/lib/axios";

export interface StudentStats {
  totalStudents: number;
  present: number;
  absent: number;
  photos0: number;
  photos1: number;
  photos2: number;
}

export const getStudentStatsService =
  async (
    eventId: number,
  ) => {
    const response =
      await axiosInstance.get<{
        message: string;
        data: StudentStats;
      }>(
        `/events/${eventId}/students/stats`,
      );

    return response.data;
  };