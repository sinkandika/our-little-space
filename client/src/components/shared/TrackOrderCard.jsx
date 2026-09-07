import orderStatus from "../../data/orderStatus";
import { groupTrackOrderItems } from "../utils/cartUtils";
import { formatDateTime } from "../utils/date";


function TrackOrderCard({ orderData, onViewDetails }) {

  const { order, payment } = orderData;

  // ICON STATUS
  const status = orderStatus[order.status];

  // GROUP MENU NAME (EVEN WITH DIFFERENT OPTIONS) INTO ONE
  const groupedItems = groupTrackOrderItems(order.order_items);

  return (
    <div className="w-sm max-h-200 flex flex-col items-center rounded-2xl bg-white p-4 text-color-4 font-semibold shadow-xl">

      <div className="bg-color-6 rounded-full p-2 overflow-y-auto"></div>

      <div className="flex flex-col text-left w-full gap-y-1 border-b border-color-2 py-2">
        <p className="text-xl font-bold">
          {order.order_number || "#Null"}
        </p>
        <p className="text-sm text-color-4/60">
          {formatDateTime(order.created_at)}
        </p>
      </div>

      <div className="w-full min-h-50 font-semibold flex flex-col py-4 gap-y-2 border-b border-color-2 text-sm">
        <div className="flex justify-between">
          <p>Item</p>
          <p>Qty</p>
        </div>
        {groupedItems.map((item) => (
          <div key={item.menuId}>
            <div className="flex justify-between text-color-4/60">
              <p>
                {item.name}
              </p>
              <p className="pr-1">
                x{item.quantity}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-col w-full py-4 gap-y-1 border-b text-sm">
        <div className="flex flex-row justify-between">
          <p>Grand Total:</p>
          <p>
            Rp {(order.total).toLocaleString("id-ID")}
          </p>
        </div>
        <div className="flex flex-row justify-between">
          <p>
            Payment:
          </p>
          <p className="font-medium text-gray-900 capitalize">
            {payment.payment_method}
          </p>
        </div>
      </div>

      <div className="w-full flex flex-row gap-x-4 py-4">
        <div className="flex justify-center items-center">
          <img
          src={status.icon}
          alt={status.label}
          className={status.iconClassname}
          />
        </div>
        <div className="flex flex-col">
          <p>
            {status.label}
          </p>
          <p className="text-sm text-color-4/60">
            {status.description}
          </p>
        </div>
      </div>

      <div className="w-full mt-auto">
        <button
          onClick={() => onViewDetails(orderData)}
          className="w-full rounded-full bg-color-2 hover:bg-color-1 transition duration-300 px-4 py-3 text-sm font-medium text-white"
        >
          View Details
        </button>
      </div>

    </div>
  );
}

export default TrackOrderCard;