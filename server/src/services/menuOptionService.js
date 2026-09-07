import supabase from "../config/supabase.js";

// ADMIN

// GET OPTION GROUP AND THEIR VALUE
export const getOptionService = async () => {
  const { data, error } = await supabase
  .from("option_groups")
  .select(`
    *,
    option_values(*)
  `)
  .order("display_order");

  if (error) {
    throw new Error(error.message);
  }

  return data.map(({ option_values, ...group }) => ({
    ...group,
    values: option_values, // change option_values into values
  }));
};

// POST MENU OPTION
export const createOptionService = async (optionData) => {
  const {
    name,
    required,
    multiple_choice,
    display_order,
    values,
  } = optionData;

  // create group
  const { data: group, error: groupError } = await supabase
    .from("option_groups")
    .insert({
      name,
      required,
      multiple_choice,
      display_order,
    })
    .select()
    .single();

  if (groupError) {
    throw new Error(groupError.message);
  }

  // create values
  let optionValues = [];

  if (values?.length) {
    const payload = values.map((val) => ({
      option_group_id: group.id,
      name: val.name,
      price_adjustment: val.price_adjustment ?? 0,
      display_order: val.display_order ?? 1,
    }));

    const { data, error: valueError } = await supabase
      .from("option_values")
      .insert(payload)
      .select();

    if (valueError) {
      throw new Error(valueError.message);
    }

    optionValues = data;
  }

  return {
    ...group,
    values: optionValues,
  };
};

// PUT MENU OPTION
export const updateOptionService = async (optionId, optionData) => {
  // update group
  const {
    name,
    required,
    multiple_choice,
    display_order,

    values = [],
  } = optionData;

  const { data: option, error: groupError } = await supabase
  .from("option_groups")
  .update({
    name,
    required,
    multiple_choice,
    display_order,
  }) 
  .eq("id", optionId)
  .select()
  .single();

  if (groupError) {
    throw new Error(groupError.message);
  }

  // update values
  // get existing value
  const { data: existingValue, error: existingError } = await supabase
  .from("option_values")
  .select("*")
  .eq("option_group_id", optionId);

  if (existingError) {
    throw new Error(existingError.message);
  }

  // update/edit existing value
  const existingSubmittedValues = values.filter((val) => val.id);

  for (const value of existingSubmittedValues) {
    const { error } = await supabase
    .from("option_values")
    .update({
      name: value.name,
      price_adjustment: value.price_adjustment,
      display_order: value.display_order,
    })
    .eq("id", value.id);

    if (error) {
      throw new Error(error.message);
    }
  };

  // compare existing and submitted value
  const submittedIds = values
  .filter((val) => val.id)
  .map((val) => val.id);

  const deletedValues = existingValue.filter((val) => !submittedIds.includes(val.id))

  // delete removed values
  if (deletedValues.length > 0) {
    await supabase
    .from("option_values")
    .delete()
    .in(
      "id",
      deletedValues.map((val) => val.id)
    );
  };

  // create/add new value
  const newValues = values.filter((val) => !val.id); // if there is no id = create new value

  if (newValues.length > 0) {
    const payload = newValues.map((val) => ({
      option_group_id: optionId,
      name: val.name,
      price_adjustment: val.price_adjustment ?? 0,
      display_order: val.display_order ?? 1,
    }));

    const { error } = await supabase
    .from("option_values")
    .insert(payload);

    if (error) {
      throw new Error(error.message);
    }
  }

  // get latest values (just for response)
  const { data: updatedValues, error: valueError } = await supabase
  .from("option_values")
  .select("*")
  .eq("option_group_id", optionId)
  .order("display_order");

  if (valueError) {
    throw new Error(valueError.message);
  };

  return {
    ...option,
    values: updatedValues,
  };
};

// DELETE MENU OPTION
export const deleteOptionService = async (optionId) => {
  const { error } = await supabase
  .from("option_groups")
  .delete()
  .eq("id", optionId);

  if (error) {
    throw new Error(error.message);
  }

  return {
    message: "Option deleted successfully",
  };
};