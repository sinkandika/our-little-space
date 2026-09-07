import axiosInstance from "../api/axios"

// GET ALL TABLE
export const getAllTables = async () => {
  const response = await axiosInstance.get("/tables")
  return response.data;
};

// GET TABLES BY NUMBER
export const getTableByNumber = async (tableNumber) => {
  const response = await axiosInstance.get(`/tables/${tableNumber}`);
  return response.data;
};