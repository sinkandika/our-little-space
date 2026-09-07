import axiosInstance from "../api/axios";

// GET ALL OPTIONS
export const getAllOption = async () => {
  const response = await axiosInstance.get("/menu-options");
  return response.data;
};

// CREATE OPTION
export const createOption = async (optionData) => {
  const response = await axiosInstance.post(
    "/menu-options",
    optionData
  );
  return response.data;
};

// UPDATE OPTION
export const updateOption = async (optionId, optionData) => {
  const response = await axiosInstance.put(
    `/menu-options/${optionId}`,
    optionData
  );
  return response.data;
};

// DELETE OPTION
export const deleteOption = async (optionId) => {
  const response = await axiosInstance.delete(
    `/menu-options/${optionId}`
  );
  return response.data;
};
