import { payPaymentService } from "../services/paymentService.js";
import { updateOrderStatusService } from "../services/orderService.js";

// GET PAYMENT BY ORDER ID
/*export const getPaymentByOrder = async (req, res) => {
  try {
    const { orderId } = req.params;

    if (!orderId) {
      return res.status(400).json({
        success: false,
        message: "Order ID is required",
      });
    }

    const payment = await getPaymentByOrderService (orderId);

    return res.status(200).json({
      success: true,
      data: payment,
    });

  } catch (error) {
    console.error("Get payment error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};*/

// UPDATE PAYMENT STATUS TO PAID AND ORDER TO WAITING
export const payPayment = async (req, res) => {
  try {
    const { paymentId } = req.params;

    if (!paymentId) {
      return res.status(400).json({
        message: "Payment ID is required",
      });
    }

    // update payment
    const payment = await payPaymentService(paymentId);

    // update order status
    const order = await updateOrderStatusService(
      payment.order_id,
      "waiting"
    );

    return res.status(200).json({
      success: true,
      message: "Payment completed successfully",
      data: {
        payment,
        order,
      },
    });
  } catch (error) {
    console.error("Pay payment error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};