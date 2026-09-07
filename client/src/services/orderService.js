import axiosInstance from "../api/axios"

// CREATE ORDER
export const createOrder = async (orderData) => {
  const response = await axiosInstance.post("/orders/create-order", orderData);
  return response.data;
};

// GET TABLE, ORDER AND PAYMENT DETAILS FOR TRACKING ORDER
export const getTrackOrders = async (tableNumber) => {
  const response = await axiosInstance.get(
    `/orders/table/${tableNumber}/track`
  );

  return response.data;
};