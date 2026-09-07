import supabase from "../config/supabase.js";

// GET STORE SETTINGS 
export const getStoreSettingService = async () => {
  const { data, error } = await supabase
  .from ("store_settings")
  .select("*")
  .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
};