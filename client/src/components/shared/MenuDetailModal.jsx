import { useEffect, useRef, useState } from "react";
import { getMenuDetail } from "../../services/menuService";
import { calculateGrandTotal, calculateOrderTotal, getDefaultOptions } from "../utils/orderCalculation";
import { Minus, Plus, X } from "lucide-react";
import { useCart } from "../../context/CartContext";
import { areOptionsEqual, formatOptions } from "../utils/cartUtils";

function MenuDetailModal({ isOpen, onClose, menuId }) {

  const [orders, setOrders] = useState ([
    {
      id: 1,
      selectedOptions: {},
    }
  ])
  const [menu, setMenu] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successAdded, setSuccessAdded] = useState(false);

  const { setCartItems } = useCart();

  // SCROLL WHEN ADDED NEW ITEM
  const bottomRef = useRef(null);

  useEffect(() => {
    if (orders.length > 0) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [orders.length]);

  // STOP SCROLLING IN BACKGROUND
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isOpen])

  // RESET MODAL STATE
  useEffect(() => {
    if (!isOpen) {
      setOrders([
        {
          id: 1,
          selectedOptions: {},
        }
      ])
      setMenu(null);
      setError(null);
    }
  }, [isOpen]);

  // FETCH MENU DETAIL
  useEffect(() => {
    if (!isOpen || !menuId) return;

    let isCancelled = false;

    const fetchMenuDetail = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await getMenuDetail(menuId);

        if (!isCancelled) {
          setMenu(res.data);

          setOrders([
            {
              id: 1,
              selectedOptions: getDefaultOptions(res.data),
            },
          ]);
        }
      } catch (err) {
        console.error("Error fetching menu detail", err);

        if (!isCancelled) {
          setError("Failed to load menu details.");
        }
      } finally {
        if (!isCancelled) {
          setLoading(false);
        }
      }
    };

    fetchMenuDetail();

    return () => {
      isCancelled = true;
    };
  }, [isOpen, menuId]);

  // HANDLE OPTION CLICK
  const handleOptionClick = (orderId, group, valueId) => {

    setOrders(prev =>
      prev.map(order => {
        if (order.id !== orderId) {
          return order;
        }

        const selectedOptions = order.selectedOptions;

        // checkbox group (multiple choice)
        if (group.multiple_choice) {

          const current = selectedOptions[group.id] || [];

          const updated = current.includes(valueId)
            ? current.filter(id => id !== valueId)
            : [...current, valueId];

          return {
            ...order,
            selectedOptions: {
              ...selectedOptions,
              [group.id]: updated,
            },
          };
        }

        // radio button (one choice)
        return {
          ...order,
          selectedOptions: {
            ...selectedOptions,
            [group.id]: valueId,
          },
        };
      })
    );
  };

  // ADD ORDER BUTTON
  const handleAddOrder = () => {
    setOrders(prev => {
      return [
        ...prev,
        {
          id: prev.length + 1,
          selectedOptions: getDefaultOptions(menu),
        },
      ];
    });
  };
  
  // REMOVE ORDER BUTTON
  const handleRemoveOrder = () => {
    setOrders(prev => {
      if (prev.length <= 1) {
        return prev;
      }

      return prev.slice(0, -1);
    });
  };

  // ADD TO CART TO LOCAL STORAGE
  const handleAddToCart = () => {
    const items = orders.map(item => ({
      menuId: menu.id,
      quantity: 1,
      options: formatOptions(item.selectedOptions),
    }));

    setCartItems(prev => {
      const updatedCart = [...prev];

      items.forEach(newItem => {
        const existingItemIndex = updatedCart.findIndex(
          cartItem =>
            cartItem.menuId === newItem.menuId &&
            areOptionsEqual(cartItem.options, newItem.options)
        );

        if (existingItemIndex !== -1) {
          updatedCart[existingItemIndex] = {
            ...updatedCart[existingItemIndex],
            quantity:
              updatedCart[existingItemIndex].quantity + newItem.quantity,
          };
        } else {
          updatedCart.push(newItem);
        }
      });

      return updatedCart;
    });

    setSuccessAdded(true);

    setTimeout(() => {
      if(onClose) {
        onClose();
      }

      setSuccessAdded(false);
    }, 800);

    
  };

  // PREVENT CLOSE CLICK
  const preventCloseClick =  (e) => e.stopPropagation();

  if (!isOpen || !menuId) return null;

  return (
    <div 
    onClick={onClose}
    className="fixed inset-0 bg-black/50 flex justify-center items-center z-90"
    >
      <div 
      onClick={preventCloseClick}
      className="bg-color-5 xl:max-h-5/6 max-h-200 overflow-y-auto scrollbar:none [&::-webkit-scrollbar]:hidden max-w-2xl p-6 flex flex-col gap-y-4 rounded-2xl"
      >
        <div className="flex">
          <div className="flex justify-center items-center w-full">
            <p className="font-semibold text-xl">Order Details</p>
          </div>
          <div className="relative">
            <button
              type="button"
              onClick={onClose}
              className="absolute top-0 right-0 text-color-4 hover:text-color-1 transition duration-300"
            >
              <X className="w-5 h-5"/>
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col justify-center items-center py-10 px-5 gap-4">
            <div className="w-12 h-12 rounded-full border-color-2 border-t-color-1 border-4 animate-[spin_0.5s_linear_infinite] "></div>
            <p>Loading details.... </p>
          </div>
        ) : error ? (
          <div className="min-w-70 py-4">
            <p className="text-red-500">{error}</p>
          </div>
        ) : menu ? (
          <>
            <div className="flex flex-col gap-y-4">
              {menu.image_url ? (
                <img
                  src={menu.image_url}
                  alt={menu.name}
                  className="aspect-4/3 object-cover bg-color-6 rounded-2xl"
                />
              ) : (
                <div className="aspect-4/3 bg-gray-200 rounded flex items-center justify-center">
                  No Image
                </div>
              )}

              <div className="flex flex-col gap-y-2 py-4">
                <div className="flex flex-row justify-between text-color-4">
                  <p className="font-bold text-lg">
                    {menu.name}
                  </p>
                  <p className="font-bold text-xl">
                    Rp {Number(menu.price).toLocaleString("id-ID")}
                  </p>
                </div>

                <p className="text-color-9">
                  {menu.description}
                </p>
              </div>
            </div>

            <div>
              <div className="flex flex-col gap-y-4">
                {orders.map((order, index) => (
                  <div
                    key={order.id}
                    className="border-t border-color-2 flex flex-col py-6 gap-y-4"
                  >

                    <div className="flex flex-row justify-between">
                      <p className="bg-color-6 w-fit rounded-full px-3 py-2 text-xs text-color-8 font-semibold">
                        Order #{index + 1}
                      </p>
                      <p className="text-color-4 font-semibold text-xs">
                        Rp {calculateOrderTotal(menu, order).toLocaleString("id-ID")}
                      </p>
                    </div>

                    {menu.optionGroups?.map((group) => (
                      <div 
                      key={group.id} 
                      className="flex flex-col gap-y-2">

                        <p className="font-bold text-color-4">
                          {group.name}
                        </p>

                        <div className="flex flex-wrap gap-3">
                          {group.values.map((value) => {

                            const selected = order.selectedOptions[group.id];

                            const isSelected = group.multiple_choice
                              ? selected?.includes(value.id)
                              : selected === value.id;

                            return (
                              <button
                                key={value.id}
                                type="button"
                                onClick={() => handleOptionClick( order.id, group, value.id )}
                                className={`
                                  rounded-full px-4 py-2 transition duration-300
                                  ${
                                    isSelected
                                      ? "bg-color-2 text-white"
                                      : "bg-white text-color-4 hover:bg-color-6"
                                  }
                                `}
                              >

                                <span>
                                  {value.name}
                                </span>

                                {Number(value.price_adjustment) > 0 && (
                                  <span className="ml-1">
                                    + Rp{" "}
                                    {Number(value.price_adjustment).toLocaleString("id-ID")}
                                  </span>
                                )}

                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
                <div ref={bottomRef}></div>
              </div>
            </div>

            <div className="text-xs md:text-base flex bg-white bottom-0 sticky p-4 shadow-2xl z-90 rounded-2xl justify-between shrink-0">
              <div className="flex flex-col justify-center text-color-4">
                <p className="font-bold">
                  Grand Total
                </p>
                <p>
                  Rp {calculateGrandTotal(menu, orders).toLocaleString("id-ID")}
                </p>
              </div>

              <div className="flex flex-row gap-x-4">
                <div className="flex flex-row justify-center items-center gap-x-3 text-color-4">
                  <button
                    type="button"
                    onClick={handleRemoveOrder}
                    disabled={orders.length === 1}
                    className="p-2 rounded-full border-color-4 disabled:opacity-30 flex justify-center items-center hover:bg-color-6 transition duration-300 disabled:hover:bg-white"
                  >
                    <Minus className="w-5 h-5" />
                  </button>
                  <span className="font-semibold">
                    {orders.length}
                  </span>
                  <button
                    type="button"
                    onClick={handleAddOrder}
                    className="p-2 rounded-full border-color-4 flex justify-center items-center hover:bg-color-6 transition duration-300"
                  >
                    <Plus className="w-5 h-5"/>
                  </button>
                </div>
                <button 
                onClick={handleAddToCart}
                disabled={successAdded}
                className={`
                     text-white rounded-full px-4 md:px-6 transition duration-300
                    ${successAdded 
                      ? "bg-green-600 hover:bg-none" 
                      : "bg-color-1 hover:bg-color-1/80"
                    }
                  `}
                >
                  {successAdded
                    ? "Item Added!"
                    : "Add to Cart"
                  }
                </button>
              </div>
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
};

export default MenuDetailModal;