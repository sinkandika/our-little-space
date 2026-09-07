import supabase from "../config/supabase.js";
import { generateInvoiceNumber } from "../utils/invoiceNumber.js";

// GET PAYMENT BY ORDER ID
export const getPaymentByOrderService = async (orderId) => {
  const { data, error } = await supabase
  .from("payments")
  .select(`
    id,
    order_id,
    payment_method,
    amount,
    status,
    paid_at,
    created_at,
    invoice_number
  `)
  .eq("order_id", orderId)
  .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

// MY ORDER

// CREATE PAYMENT (merge in orderController)
export const createPaymentService = async ({
  orderId,
  amount,
  paymentMethod,
}) => {

  const invoiceNumber = await generateInvoiceNumber();

  const { data: payment, error } = await supabase
    .from("payments")
    .insert({
      invoice_number: invoiceNumber,
      order_id: orderId,
      payment_method: paymentMethod,
      amount,
      status: "pending",
    })
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return payment;
};

// UPDATE PAYMENT STATUS TO PAID
export const payPaymentService = async (paymentId) => {
  const { data: payment, error: paymentError } = await supabase
    .from("payments")
    .update({
      status: "paid",
      paid_at: new Date().toISOString(),
    })
    .eq("id", paymentId)
    .select()
    .single();

  if (paymentError) {
    throw new Error(paymentError.message);
  }

  return payment;
};

