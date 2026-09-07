import supabase from "../config/supabase.js";


// GENERATE ORDER NUMBER
export const generateOrderNumber = async () => {
  const now = new Date();

  const startOfDay = new Date(now);
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date(now);
  endOfDay.setHours(23, 59, 59, 999);

  const { data, error } = await supabase
  .from("orders")
  .select("order_number")
  .gte("created_at", startOfDay.toISOString())
  .lte("created_at", endOfDay.toISOString())
  .not("order_number", "is", null)
  .order("created_at", { ascending: false })
  .limit(1);

  if (error) {
    throw new Error(error.message);
  }

  let nextNumber = 1;

  if (data?.length > 0 && data[0].order_number) {
    const lastNumber = parseInt(
      data[0].order_number.replace("#OLS", ""),
      10
    );

    nextNumber = lastNumber + 1;
  }

  return `#OLS${String(nextNumber).padStart(4, "0")}`;
};