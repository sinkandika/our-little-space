import supabase from "../config/supabase.js";

// USER

// GET ALL MENUS
export const getMenusService = async () => {
  const { data, error } = await supabase
  .from("menus")
  .select("*")
  .order("categories")
  .order("name");

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

// GET MENU DETAIL WITH THEIR OPTION
export const getMenuDetailService = async (menuId) => {
  // get menus
  const { data: menu, error: menuError } = await supabase
  .from("menus")
  .select("*")
  .eq("id", menuId)
  .single();

  if (menuError) {
    throw new Error(menuError.message);
  }

  // get menu_option_groups
  const { data: menuOptions, error: optionError } = await supabase
  .from("menu_option_groups")
  .select(`
    display_order,
    option_groups (
      *,
      option_values (*)
    )
  `)
  .eq("menu_id", menuId)
  .order("display_order");

  if (optionError) {
    throw new Error(optionError.message);
  }

  const optionGroups = menuOptions.map(
    ({ display_order, option_groups }) => ({
      ...option_groups,
      display_order,
      values: option_groups.option_values,
    })
  );

  return {
    ...menu,
    optionGroups, //option_groups become optionGroups
  };
};

// ADMIN

// POST MENU
export const createMenuService = async ({
  name,
  description,
  price,
  categories,
  is_available,
  image_url,
}) => {
  const { data, error } = await supabase
  .from("menus")
  .insert([
    {
      name,
      description,
      price,
      categories,
      is_available,
      image_url,
    },
  ])
  .select()
  .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

// PUT MENU
export const updateMenuService = async (
  id, // get menu id
  {
    name,
    description,
    price,
    categories,
    is_available,
    image_url,
  }
) => {
  const updateData = {
    name,
    description,
    price,
    categories,
    is_available,
  };

  // Only update image if a new one was uploaded
  if (image_url) {
    updateData.image_url = image_url;
  }

  const { data, error } = await supabase
  .from("menus")
  .update(updateData)
  .eq("id", id)
  .select()
  .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

// DELETE MENU
export const deleteMenuService = async (id) => {
  const { error } = await supabase
  .from("menus")
  .delete()
  .eq("id", id);

  if (error) {
    throw new Error(error.message);
  }
};