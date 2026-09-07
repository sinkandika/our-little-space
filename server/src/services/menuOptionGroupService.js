import supabase from "../config/supabase.js";

// MERGE OPTION GROUPS AND MENU
export const attachOptionsToMenuService = async (
  menuId,
  optionGroupIds,
) => {
  if (!optionGroupIds || optionGroupIds.length === 0) {
    return [];
  }

  const payload = optionGroupIds.map((optionGroupId, index) => ({
    menu_id: menuId,
    option_group_id: optionGroupId,
    display_order: index + 1,
  }));

  const { data, error } = await supabase
  .from("menu_option_groups")
  .insert(payload)
  .select();

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

// UPDATE OPTIONS ATTACHED TO MENU
export const updateMenuOptionsService = async (
  menuId,
  optionGroupIds
) => {

  // get existing option relationships
  const { data: existingOptions, error: existingError } = await supabase
  .from("menu_option_groups")
  .select("*")
  .eq("menu_id", menuId);

  if (existingError) {
    throw new Error(existingError.message);
  }

  // make sure we always work with an array
  const submittedIds = optionGroupIds || [];

  // find options that should be deleted
  const deletedOptions = existingOptions.filter(
    (existing) =>
      !submittedIds.includes(existing.option_group_id)
  );

  // delete removed options
  if (deletedOptions.length > 0) {
    const { error: deleteError } = await supabase
    .from("menu_option_groups")
    .delete()
    .in(
      "id",
      deletedOptions.map((option) => option.id)
    );

    if (deleteError) {
      throw new Error(deleteError.message);
    }
  }

  // find options that should be added
  const existingIds = existingOptions.map(
    (option) => option.option_group_id
  );

  const newOptionIds = submittedIds.filter(
    (id) => !existingIds.includes(id)
  );

  // add new options
  if (newOptionIds.length > 0) {
    const payload = newOptionIds.map(
      (optionGroupId, index) => ({
        menu_id: menuId,
        option_group_id: optionGroupId,
        display_order: index + 1,
      })
    );

    const { error: insertError } = await supabase
    .from("menu_option_groups")
    .insert(payload);

    if (insertError) {
      throw new Error(insertError.message);
    }
  }

  // get latest relationships
  const { data: updatedOptions, error: updatedError } =
    await supabase
    .from("menu_option_groups")
    .select("*")
    .eq("menu_id", menuId)
    .order("display_order");

  if (updatedError) {
    throw new Error(updatedError.message);
  }

  return updatedOptions;
};
