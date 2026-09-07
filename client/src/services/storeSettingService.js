import axiosInstance from "../api/axios";

// GET STORE SETTINGs
export const getStoreSettings = async () => {
  const response = await axiosInstance.get("/store-settings");
  return response.data;
};
