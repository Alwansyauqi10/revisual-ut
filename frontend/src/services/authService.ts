import { axiosInstance } from "../lib/axios";

export interface LoginResponse {
  message: string;
  data: {
    user: {
      id: number;
      name: string;
      email: string;
      role: "SUPER_ADMIN" | "ADMIN" | "USER";
    };
    token: string;
  };
}

export const loginService = async (
  email: string,
  password: string,
) => {
  const response =
    await axiosInstance.post<LoginResponse>(
      "/auth/login",
      {
        email,
        password,
      },
    );

  return response.data;
};