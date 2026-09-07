import { X } from "lucide-react";
import { formatDateTime } from "../utils/date";
import { useEffect } from "react";

function TrackOrderDetailModal({ isOpen, orderData, onClose }) {

  // STOP SCROLLING
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isOpen])

  if (!isOpen || !orderData) return null;

  const { order, payment } = orderData;

  // PREVENT CLOSE CLICK
  const preventCloseClick =  (e) => e.stopPropagation();

  

  return (
    <div 
    onClick={onClose}
    className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
    >
      <div 
      onClick={preventCloseClick}
      className="w-full max-w-xl xl:max-h-5/6 max-h-screen rounded-2xl overflow-y-auto scrollbar:none [&::-webkit-scrollbar]:hidden bg-white p-6 text-color-4"
      >

        <div className="relative">
          <button
              onClick={onClose}
              className="absolute right-0 top-0 hover:text-color-1 transistion duration-300"
            >
              <X className="w-5 h-5"/>
            </button>
        </div>

        <div className="flex items-center justify-between border-b border-color-2 py-4">
          <div>
            <h2 className="text-xl font-semibold">
              {order.order_number || "#NULL"}
            </h2>

            <p className="text-sm">
              {formatDateTime(order.created_at)}
            </p>
          </div>
        </div>

        <div className="overflow-x-auto border-b">
          <table className="w-full text-left divide-y">
            <thead>
              <tr className="border-b text-sm font-semibold border-none">
                <th className="py-3 px-4">Item</th>
                <th className="py-3 px-4 text-center">Quantity</th>
                <th className="py-3 px-4 text-right">Subtotal</th>
              </tr>
            </thead>

            <tbody className="">
              {order.order_items.map((item) => (
                <tr key={item.id} className="align-top">
                  <td className="p-4">
                    <p className="font-medium ">
                      {item.menus?.name}
                    </p>
                    {item.order_item_options?.length > 0 && (
                      <div className="mt-1 text-xs space-y-0.5">
                        {item.order_item_options.map((option) => (
                          <div key={option.id}>
                            <span className="font-medium">{option.option_groups?.name}</span>:{" "}
                            {option.option_values?.name}
                          </div>
                        ))}
                      </div>
                    )}
                  </td>


                  <td className="p-4 text-center">
                    x{item.quantity}
                  </td>


                  <td className="p-4 text-right">
                    Rp {Number(item.subtotal).toLocaleString("id-ID")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="py-4 border-b flex flex-col gap-y-1">
          <div className="flex justify-between text-sm">
            <span>Subtotal</span>
            <span>
              Rp {Number(order.subtotal).toLocaleString("id-ID")}
            </span>
          </div>

          <div className="flex justify-between text-sm">
            <span>
              Tax ({order.tax_rate}%)
            </span>
            <span>
              Rp {Number(order.tax_amount).toLocaleString("id-ID")}
            </span>
          </div>

          {Number(order.discount_amount) > 0 && (
            <div className="flex justify-between text-sm">
              <span>
                Discount ({order.discount_rate}%)
              </span>
              <span>
                -Rp {Number(order.discount_amount).toLocaleString()}
              </span>
            </div>
          )}

          <div className="flex justify-between font-semibold">
            <span>Grand Total</span>
            <span>
              Rp {Number(order.total).toLocaleString("id-ID")}
            </span>
          </div>
        </div>

        <div className="py-4 flex flex-col gap-y-1 text-sm">
          <div className="flex justify-between">
            <span>Invoice</span>
            <span>{payment.invoice_number}</span>
          </div>

          <div className="flex justify-between">
            <span>Payment Method</span>
            <span className="capitalize">
              {payment.payment_method}
            </span>
          </div>

          <div className="flex justify-between">
            <span>Amount</span>
            <span>
              Rp {Number(payment.amount).toLocaleString("id-ID")}
            </span>
          </div>

          <div className="flex justify-between">
            <span>Status</span>
            <span>{payment.status}</span>
          </div>

          {payment.paid_at && (
            <div className="flex justify-between">
              <span>Paid At</span>
              <span>
                {formatDateTime(payment.paid_at)}
              </span>
            </div>
          )}
        </div>

        {/* Close */}
        <button
          onClick={onClose}
          className="w-full rounded-xl border border-color-4 bg-white hover:bg-color-2 hover:text-white px-4 py-3 transition duration-300"
        >
          Close
        </button>

      </div>
    </div>
  );
}

export default TrackOrderDetailModal;