import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getTrackOrders } from "../../services/orderService";
import TrackOrderCard from "../../components/shared/TrackOrderCard";
import TrackOrderDetailModal from "../../components/shared/TrackOrderDetailModal";


function TrackOrder() {
  const { tableNumber } = useParams();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // FETCH TRACKING ORDER BY TABLE
  useEffect(() => {
    const fetchOrders = async () => {

      setLoading(true);

      try {
        setLoading(true);

        const result = await getTrackOrders(tableNumber);

        setOrders(result.data.orders);
        console.log(result.data.orders);
      } catch (error) {
        console.error("Failed to get track orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [tableNumber]);

  // OPEN/CLOSE MODAL
  const handleViewDetails = (orderData) => {
    setSelectedOrder(orderData);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedOrder(null);
    setIsModalOpen(false);
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-color-6 p-6 rounded-tl-[50px] w-full gap-6">
      {loading ? (
        <div className="flex flex-col justify-center items-center py-10 gap-4 w-full">
          <div className="w-12 h-12 rounded-full border-color-2 border-t-color-1 border-4 animate-[spin_0.5s_linear_infinite] "></div>
          <p>Loading order.... </p>
        </div>
      ) : orders && orders.length > 0 ? (
        <div className="flex flex-wrap gap-4"> 
          {orders.map((item) => (
            <TrackOrderCard
            key={item.key}
            orderData={item}
            onViewDetails={handleViewDetails}
            />
          ))}
        </div>
      ) : (
        <div className="flex justify-center w-full">
          <p className="text-lg">
            No order found
          </p>
        </div>
      )}

      <TrackOrderDetailModal
      isOpen={isModalOpen}
      orderData={selectedOrder}
      onClose={handleCloseModal}
      />

    </div>
  );
}

export default TrackOrder;