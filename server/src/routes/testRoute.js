import express from "express";
import supabase from "../config/supabase.js";
import { generateOrderNumber } from "../utils/orderNumber.js";
import { generateInvoiceNumber } from "../utils/invoiceNumber.js";

const router = express.Router();

// TEST ROUTE
router.get("/", async (req, res) => {
  const { data, error } = await supabase
    .from("kitchen_users")
    .select("");

  if (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }

  res.json({
    success: true,
    data,
  });
});

// TEST ORDER NUMBER
router.get("/order-number", async (req, res) => {
  try {
    const orderNumber = await generateOrderNumber();

    return res.status(200).json({
      orderNumber,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: error.message,
    });
  }
});

// TEST INVOICE NUMBER
router.get("/invoice-number", async (req, res) => {
  try {
    const invoiceNumber = await generateInvoiceNumber();

    return res.status(200).json({
      invoiceNumber,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: error.message,
    });
  }
});

export default router;