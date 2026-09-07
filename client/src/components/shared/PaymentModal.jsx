import { useEffect, useState } from "react";
import { payPayment } from "../../services/paymentService";

function PaymentModal ({ isOpen, payment, onClose, onPaymentSuccess }) {

  const [isLoadingPayment, setIsLoadingPayment] = useState(false)

  // HANDLE PAY NOW
  const handlePay = async () => {

    setIsLoadingPayment(true);

    try {
      const res = await payPayment(payment.id);

      alert("Payment success", res);

      onPaymentSuccess(res.data);
    } catch (err) {
      console.error("Failed to process Payment:", err);
    } finally {
      setIsLoadingPayment(false);
      onClose();
    }
  };

  //STOP SCROLLING
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isOpen])

  // PREVENT CLOSE
  const preventCloseClick = (e) => e.preventPropagation();

  if (!isOpen || !payment) {
    return null;
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/20 z-90">
      <div 
      onClose={preventCloseClick}
      className="flex flex-col bg-white p-6 rounded-2xl w-xl h-100 max-h-screen text-color-4 font-medium"
      >
        <div>
          <p className="text-color-4 text-xl font-bold border-b border-color-2 pb-4">
            Payment Order
          </p>
        </div>
        
        <div className="flex flex-col gap-y-2 py-4">
          <div className="flex flex-row justify-between">
            <p>
              Payment Method:
            </p>
            <p className="capitalize">
              {payment.payment_method}
            </p>
          </div>
          <div className="flex flex-row justify-between">
            <p>
              Amount:
            </p>
            <p>
              Rp {Number(payment.amount).toLocaleString("id-ID")}
            </p>
          </div>
        </div>

        <div className="mt-auto flex flex-row justify-end gap-x-2">
          <button 
          onClick={onClose}
          className="bg-delete-1 rounded py-2 px-4 text-white hover:bg-delete-1/80 transition duration-300"
          >
            Cancel
          </button>
          <button
          onClick={handlePay}
          disabled={isLoadingPayment}
          className={`
            rounded py-2 px-4 text-white transition duration-300
            ${isLoadingPayment
              ? "bg-color-2/80 hover:bg-none"
              : "bg-color-1 hover:bg-color-1/80"
            }
          `}
          >
            {isLoadingPayment
              ? "Waiting..."
              : "Pay Now"
            }
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;