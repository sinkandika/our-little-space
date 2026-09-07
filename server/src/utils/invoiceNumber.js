import supabase from "../config/supabase.js";

// GENERATE INVOICE NUMBER
export const generateInvoiceNumber = async () => {
  const now = new Date();

  const startOfDay = new Date(now);
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date(now);
  endOfDay.setHours(23, 59, 59, 999);

  const { data, error } = await supabase
    .from("payments")
    .select("invoice_number")
    .gte("created_at", startOfDay.toISOString())
    .lte("created_at", endOfDay.toISOString())
    .not("invoice_number", "is", null)
    .order("created_at", { ascending: false })
    .limit(1);

  if (error) {
    throw new Error(error.message);
  }

  let nextNumber = 1;

  if (data?.length > 0 && data[0].invoice_number) {
    const lastNumber = parseInt(
      data[0].invoice_number.slice(-4),
      10
    );

    nextNumber = lastNumber + 1;
  }

  const datePart = now
    .toISOString()
    .slice(2, 10)
    .replace(/-/g, "");

  return `#INV${datePart}${String(nextNumber).padStart(4, "0")}`;
};