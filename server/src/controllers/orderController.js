import { createOrderService, getActiveOrdersByTableService, getOrderService } from "../services/orderService.js";
import { createPaymentService, getPaymentByOrderService } from "../services/paymentService.js";

// GET ORDER DETAILS
export const getOrder = async (req, res) => {
  try {
    const { orderId } = req.params;

    if (!orderId) {
      return res.status(400).json({
        success: false,
        message: "Order ID is required",
      })
    }

    const order = await getOrderService(orderId);

    return res.status(200).json({
      success: true,
      data: order,
    });

  } catch (err) {
    console.error("Get order error:", err)

    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// CREATE ORDER
export const createOrder = async (req, res) => {
  try {
    const { tableId, items, paymentMethod } = req.body;

    if (!tableId) {
      return res.status(400).json({
        message: "Table ID is required",
      });
    }

    if (!items || items.length === 0) {
      return res.status(400).json({
        message: "Order items are required",
      });
    }

    // CREATE ORDER
    const order = await createOrderService({
      tableId,
      items,
    });

    // CREATE PAYMENT
    const payment = await createPaymentService({
      orderId: order.id,
      amount: order.total,
      paymentMethod: paymentMethod || "cash",
    });

    return res.status(201).json({
      success: true,
      message: "Order created successfully",
      data: {
        order,
        payment,
      },
    });

  } catch (err) {
    console.error("Create order error:", err);

    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// TRACK ORDER

/*
// GET ORDER AND PAYMENT DETAILS FOR TRACKING ORDER
export const getOrderTrack = async (req, res) => {
  try {
    const { orderId } = req.params;

    if (!orderId) {
      return res.status(400).json({
        success: false,
        message: "Order ID is required",
      });
    }

    // get order detail
    const order = await getOrderService(orderId);

    // get payment detail by order id
    const payment = await getPaymentByOrderService(orderId);

    return res.status(200).json({
      success:true,
      data: {
        order,
        payment,
      },
    });

  } catch (err) {
    console.error("Get order track error:", err);

    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};*/

// GET TABLE, ORDER AND PAYMENT DETAILS FOR TRACKING ORDER
export const getActiveOrdersByTable = async (req, res) => {
  try {
    const { tableNumber } = req.params;

    if (!tableNumber) {
      return res.status(400).json({
        success: false,
        message: "Table number is required",
      });
    }

    const { table, orders } =
      await getActiveOrdersByTableService(tableNumber);

    const ordersWithPayment = await Promise.all(
      orders.map(async (order) => {
        const payment = await getPaymentByOrderService(order.id);

        return {
          order,
          payment,
        };
      })
    );

    return res.status(200).json({
      success: true,
      data: {
        table,
        orders: ordersWithPayment,
      },
    });

  } catch (error) {
    console.error("Get active orders error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};