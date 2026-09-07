import axiosInstance from "../api/axios"

// MERGE MENUS AND OPTION GROUPS
export const attachOptionsToMenu = async (menuId, optionGroupIds) => {
  const response = await axiosInstance.post(
    `/menu-option-groups/${menuId}/options`,
    {
      option_group_ids: optionGroupIds,
    }
  );

  return response.data;
}

// UPDATE OPTIONS ATTACHED TO MENU
export const updateMenuOptions = async (menuId, optionGroupIds) => {
  const response = await axiosInstance.put(
    `/menu-option-groups/${menuId}/options`,
    {
      option_group_ids: optionGroupIds,
    }
  );

  return response.data;
};