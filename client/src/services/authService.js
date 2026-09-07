import axiosInstance from "../api/axios"

// LOGIN
export const loginUser = async (credentials) => {
  const response = await axiosInstance.post(
    "/auth/login",
    credentials
  );

  return response.data;
};