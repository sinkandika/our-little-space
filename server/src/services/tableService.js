import supabase from "../config/supabase.js"

// USER

// GET ALL TABLES
export const getAllTableService = async () => {
  const { data, error } = await supabase
  .from("tables")
  .select("*")
  .order("table_number", {ascending: true});

  if(error) {
    throw new Error(error.message);
  }

  return data;
};

// GET TABLES BY TABLE_NUMBER
export const getTableByNumberService = async (
  tableNumber
) => {
  const { data, error } = await supabase
  .from ("tables")
  .select("*")
  .eq("table_number", tableNumber)
  .eq("is_active", true)
  .single();

  if (error) {
    throw new Error ("Table not found");
  }

  return data;
};