import { useState } from "react";
import { useCart } from "../../context/CartContext";
import { useEffect } from "react";
import { getMenuDetail } from "../../services/menuService";
import { createOrder } from "../../services/orderService";
import { areOptionsEqual, groupMenuItems } from "../../components/utils/cartUtils";
import paymentMethods from "../../data/paymentMethods";
import { calculateCartSubtotal} from "../../components/utils/orderCalculation";
import { getStoreSettings } from "../../services/storeSettingService";
import PaymentModal from "../../components/shared/PaymentModal";
import deleteItem from "../../assets/delete-item.svg";

function MyOrder() {

  const { cartItems, setCartItems } = useCart();
  const [menuDetails, setMenuDetails] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [storeSettings, setStoreSettings] = useState(null);

  const [payment, setPayment] = useState(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  const [isLoadingOrder, setIsLoadingOrder] = useState(false);
 
  // FETCH MENU DETAILS
  useEffect(() => {
    const fetchMenuDetails = async () => {

      try {
        const details = await Promise.all(
          cartItems.map(async (item) => {
            const res = await getMenuDetail(item.menuId);

            return {
              ...item,
              menu: res.data,
            };
          })
        );

        setMenuDetails(details);
      } catch (error) {
        console.error("Failed to fetch menu details:", error);
      } 
    };

    if (cartItems.length > 0) {
      fetchMenuDetails();
    } else {
      setMenuDetails([]);
    }
  }, [cartItems]);

  // FETCH STORE SETTINGS
  useEffect(() => {
    const fetchStoreSettings = async () => {
      try {
        const res = await getStoreSettings();

        setStoreSettings(res.data);
      } catch (error) {
        console.error("Failed to fetch store settings", error);
      }
    };

    fetchStoreSettings();
  }, []);

  // HANDLE ORDER
  const handleOrder = async () => {

    setIsLoadingOrder(true); 

    try {
      const tableId = localStorage.getItem("tableId");

      if (!tableId) {
        console.error("Table ID not found");
        return;
      }

      if (cartItems.length === 0) {
        console.error("Cart is empty");
        return;
      }

      const orderData = {
        tableId,
        items: cartItems,
        paymentMethod,
      };
      // save into orders db
      const res = await createOrder(orderData); // will call backend include calculation 

      console.log("Order created:", res);

      const payment = res.data.payment; // get payments db data and open payment modal 
      setPayment(payment);
      setIsPaymentModalOpen(true);

    } catch (error) {
      console.error("Failed to create order:", error);
    } finally {
      setIsLoadingOrder(false)
    }
  };

  // HANDLE DELETE ORDER
  const handleDeleteItem = (menuId, options) => {
    setCartItems(prev =>
      prev.filter(
        item =>
          !(
            item.menuId === menuId &&
            areOptionsEqual(item.options, options)
          )
      )
    );
  };

  // GROUP MENU NAME (EVEN WITH DIFFERENT OPTIONS) INTO ONE
  const groupItems = groupMenuItems(menuDetails);

  // PAYMENT DETAILS
  const subtotal = calculateCartSubtotal(menuDetails);

  const taxRate = Number(storeSettings?.tax_rate) || 0;
  const discountRate = Number(storeSettings?.discount_rate) || 0;

  const taxAmount = subtotal * (taxRate / 100); // frontend calculation
  const discountAmount = subtotal * (discountRate / 100); // frontend calculation

  const total = subtotal + taxAmount - discountAmount; // frontend calculation

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-color-6 p-6 rounded-tl-[50px] w-full gap-6">

      {cartItems.length === 0 ? (
        <div className="bg-white flex flex-2 flex-col p-6 rounded-2xl">
          <p className="text-color-4 text-xl font-bold border-b border-color-2 pb-4">
            My Order
          </p>
          <div className="flex flex-col justify-center items-center h-full text-xl font-medium text-color-4">
            <p>
              Your cart is empty
            </p>
            <p className="text-sm text-color-4/60">
              let's order something good
              </p>
          </div>
        </div>
      ) : (
        <div className="bg-white flex flex-2 flex-col p-6 rounded-2xl">
          <p className="text-color-4 text-xl font-bold border-b border-color-2 pb-4">
            My Order
          </p>
          {menuDetails.map((item, index) => (
            <div 
            key={`${item.menuId}-${index}`}
            className="flex flex-col md:flex-row border-b border-color-2 justify-between py-4 gap-y-2"
            >
              <div className="flex flex-col md:flex-row gap-4 font-medium">
                <div className="flex justify-center items-center">
                  <div className=" justify-center items-center w-fit bg-color-3 rounded-2xl flex">
                    <img
                      src={item.menu.image_url}
                      alt={item.menu.name}
                      className="aspect-square object-cover max-w-40"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-y-2">
                  <div className="flex flex-row md:flex-col justify-between md:justify-start">
                    <p className=" text-color-4">
                      {item.menu.name}
                    </p>
                    <p className="text-color-4 text-sm">
                      Qty: {item.quantity}
                    </p>
                  </div>
                  <div>
                    {item.options.map((selectedOption) => {
                      const group = item.menu.optionGroups.find(
                        group => group.id === selectedOption.optionGroupId
                      );
                      const value = group?.option_values.find(
                        value => value.id === selectedOption.optionValueId
                      );
                      return (
                        <p
                        key={selectedOption.optionValueId}
                        className="text-color-9 text-sm"
                        >
                        {value?.name}
                        </p>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="flex flex-row md:flex-col justify-between md:justify-start items-center gap-y-4 font-medium">
                <p>Rp {Number(item.menu.price).toLocaleString("id-ID")}</p>
                
                <button
                onClick={() => handleDeleteItem(item.menuId, item.options)}
                className="bg-delete-1 hover:bg-delete-1/80 rounded-full p-2 transition duration-300"
                >
                  <img
                  src={deleteItem}
                  alt="trash"
                  className="w-4 h-4 "
                  />
                </button>
              </div>
            </div>
          ))}
          
        </div>
      )}

      <div className="bg-white flex flex-1 flex-col p-6 rounded-2xl">
        <p className="text-color-4 text-xl font-bold border-b border-color-2 pb-4">
          Payment
        </p>

        <div className="border-b border-color-2 py-4 flex flex-col gap-y-2 text-color-4 font-medium">
          <p className="">
            Item Details
          </p>
          <div className="text-sm flex flex-col gap-y-1">
            {groupItems.map((item) => (
              <div 
              key={item.menuId}
              className="flex flex-row justify-between"
              >
                <p>
                  {item.name}
                </p>
                <p>
                   x{item.quantity}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="border-b border-color-2 py-4 flex flex-col gap-y-2 text-color-4 font-medium">
          <p>
            Payment Details
          </p>
          <div className="text-sm flex flex-col gap-y-1">
            <div className="flex flex-row justify-between">
              <p>
                Subtotal:
              </p>
              <p>
                Rp {subtotal.toLocaleString("id-ID")}
              </p>
            </div>
            <div className="flex flex-row justify-between">
              <p>
                Tax ({taxRate}%):
              </p>
              <p>
               Rp {taxAmount.toLocaleString("id-ID")}
              </p>
            </div>
            <div className="flex flex-row justify-between">
              <p>
                Discount ({discountRate}%):
              </p>
              <p>
               Rp {discountAmount.toLocaleString("id-ID")}
              </p>
            </div>
            <div className="flex flex-row justify-between">
              <p>
                Grand Total:
              </p>
              <p>
                Rp {total.toLocaleString("id-ID")}
              </p>
            </div>
          </div>
        </div>

        <div className="border-b border-color-2 py-4 flex flex-col gap-y-2 text-color-4 font-medium">
          <p>Payment Method</p>
          {paymentMethods.map((payMet) => {
            const IconComponent = payMet.icon; // for assets icon
            const LucideIcon = typeof payMet.icon === "function" || (typeof payMet.icon === "object" && payMet.icon !== null); // for lucide Icon
            return (
                <label 
                key={payMet.key}
                className="flex flex-row justify-between"
                >
                  <div className="flex flex-row gap-x-2 text-sm">
                    {payMet.icon && (
                      LucideIcon ? (
                        <IconComponent className="w-6 h-6 text-color-4" />
                      ) : (
                        <img
                        src={payMet.icon}
                        alt={payMet.label}
                        className="w-6 h-6 object-contain" />
                      )
                    )}
                    {payMet.label}
                  </div>
                  <input
                  type="radio"
                  name="paymentMethod"
                  disabled={cartItems.length === 0}
                  value={payMet.key}
                  checked={paymentMethod === payMet.key}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                </label>
            )
          })}
        </div>

        <div className="flex py-4 justify-center">
          <button
          onClick={handleOrder}
          disabled={isLoadingOrder || cartItems.length === 0}
          className={`
              rounded-full py-2 text-white font-medium w-full transition duration-300
            ${(isLoadingOrder || cartItems.length === 0)
              ? "bg-color-2/80 hover:bg-none"
              : "bg-color-1 hover:bg-color-1/80"
            }
          `}
          >
            {isLoadingOrder
              ? "Waiting..."
              : cartItems.length === 0 
                ? "Cart is Empty"
                : "Order Now"
            }
          </button>
        </div>
      </div>

      <PaymentModal
      isOpen={isPaymentModalOpen}
      payment={payment}
      onClose={() => setIsPaymentModalOpen(false)}
      onPaymentSuccess={(data) => {
        console.log("Order is now waiting:", data.order);

        setCartItems([]);
        setIsPaymentModalOpen(false);
      }}
      />

    </div>
  );
}

export default MyOrder;