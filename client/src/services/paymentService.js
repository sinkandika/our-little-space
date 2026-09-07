import axiosInstance from "../api/axios";

// UPDATE/PAY PAYMENT
export const payPayment = async (paymentId) => {
  const response = await axiosInstance.put(
    `/payments/${paymentId}/pay`
  );

  return response.data;
};