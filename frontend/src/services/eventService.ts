import { axiosInstance } from "../lib/axios";

export interface GetEventsParams {
  search?: string;
  page?: number;
  limit?: number;
}

export const getEventsService = async (
  params?: GetEventsParams,
) => {
  const response = await axiosInstance.get("/events", {
    params,
  });

  return response.data;
};

export const createEventService = async (
  name: string,
  date: string,
) => {
  const response = await axiosInstance.post("/events", {
    name,
    date,
  });

  return response.data;
};

export const updateEventService = async (
  id: number,
  name: string,
  date: string,
) => {
  const response = await axiosInstance.put(`/events/${id}`, {
    name,
    date,
  });

  return response.data;
};