import express from "express";

import { createOrder, getActiveOrdersByTable, getOrder } from "../controllers/orderController.js";

const router = express.Router();

// GET TABLE, ORDER AND PAYMENT DETAILS FOR TRACKING ORDER
router.get("/table/:tableNumber/track", getActiveOrdersByTable);

// GET ORDER DETAILS
router.get("/:orderId", getOrder);

// CREATE ORDER
router.post("/create-order", createOrder);

// GET ORDER AND PAYMENT DETAILS FOR TRACKING ORDER
//router.get("/:orderId/track", getOrderTrack);

export default router;