import axiosInstance from "../api/axios"

// VIEW ALL MENUS
export const getAllMenus = async () => {
  const response = await axiosInstance.get("/menus")
  return response.data;
};

// VIEW MENU DETAIL
export const getMenuDetail = async (id) => {
  const response = await axiosInstance.get(`/menus/${id}`);
  return response.data;
}

// CREATE MENU WITH IMAGE CLOUDINARY
export const createMenu = async (formData) => {
  const response = await axiosInstance.post(
    "/menus",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
}

// UPDATE MENU
export const updateMenu = async (
  id,
  formData,
) => {
  const response = await axiosInstance.put(
    `/menus/${id}`,
    formData
  );

  return response.data;
};

// DELETE MENU
export const deleteMenu = async (id)  => {
  const response = await axiosInstance.delete(`/menus/${id}`);

  return response.data;
}