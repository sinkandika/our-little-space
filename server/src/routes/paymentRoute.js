import express from "express";
import { payPayment } from "../controllers/paymentController.js";

const router = express.Router();

// GET PAYMENT BY ORDER ID
//router.get("/order/:orderId", getPaymentByOrder);

// UPDATE PAYMENT STATUS TO PAID
router.put("/:paymentId/pay", payPayment);

export default router;