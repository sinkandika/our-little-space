import supabase from "../config/supabase.js";
import { generateOrderNumber } from "../utils/orderNumber.js";
import { getStoreSettingService } from "./storeSettingService.js";

// GET ORDERS DETAILS
export const getOrderService = async (orderId) => {
  const { data, error } = await supabase
    .from("orders")
    .select(`
      id,
      order_number,
      table_id,
      status,
      subtotal,
      tax_rate,
      tax_amount,
      discount_rate,
      discount_amount,
      total,
      created_at,

      tables (
        id,
        table_number,
        table_name
      ),

      order_items (
        id,
        menu_id,
        quantity,
        unit_price,
        subtotal,

        menus (
          id,
          name,
          price
        ),

        order_item_options (
          id,
          option_group_id,
          option_value_id,

          option_groups (
            id,
            name
          ),

          option_values (
            id,
            name,
            price_adjustment
          )
        )
      )
    `)
    .eq("id", orderId)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

// MY ORDER

// CREATE ORDER
export const createOrderService = async ({ tableId, items }) => {

  // generate order number
  const orderNumber = await generateOrderNumber();

  // get current store_settings
  const settings = await getStoreSettingService();

  const taxRate = Number(settings.tax_rate) || 0;
  const discountRate = Number(settings.discount_rate) || 0;

  // Create the order
  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      order_number: orderNumber,
      table_id: tableId,
      status: "pending",
      subtotal: 0,
      tax_rate: taxRate,
      tax_amount: 0,
      discount_rate: discountRate,
      discount_amount: 0,
      total: 0,
    })
    .select()
    .single();

  if (orderError) {
    throw new Error(orderError.message);
  }

  let subtotal = 0;

  // Create each order item
  for (const item of items) {
    // Get menu price
    const { data: menu, error: menuError } = await supabase
      .from("menus")
      .select("price")
      .eq("id", item.menuId)
      .single();

    if (menuError) {
      throw new Error(menuError.message);
    }

    // Get selected option prices
    let optionTotal = 0;

    if (item.options?.length > 0) {
      const optionValueIds = item.options.map(
        (option) => option.optionValueId
      );

      const { data: optionValues, error: optionError } = await supabase
        .from("option_values")
        .select("price_adjustment")
        .in("id", optionValueIds);

      if (optionError) {
        throw new Error(optionError.message);
      }

      optionTotal = optionValues.reduce(
        (sum, option) => sum + Number(option.price_adjustment || 0),
        0
      );
    }

    // Price for one configured item
    const unitPrice = Number(menu.price) + optionTotal;

    // Price × quantity
    const itemSubtotal = unitPrice * item.quantity;

    // Create order item
    const { data: orderItem, error: orderItemError } = await supabase
      .from("order_items")
      .insert({
        order_id: order.id,
        menu_id: item.menuId,
        quantity: item.quantity,
        unit_price: unitPrice,
        subtotal: itemSubtotal,
      })
      .select()
      .single();

    if (orderItemError) {
      throw new Error(orderItemError.message);
    }

    // Save selected options
    if (item.options?.length > 0) {
      const orderItemOptions = item.options.map((option) => ({
        order_item_id: orderItem.id,
        option_group_id: option.optionGroupId,
        option_value_id: option.optionValueId,
      }));

      const { error: optionsError } = await supabase
        .from("order_item_options")
        .insert(orderItemOptions);

      if (optionsError) {
        throw new Error(optionsError.message);
      }
    }

    subtotal += itemSubtotal;
  }

  // Update order total
  // calculate tax
  const taxAmount = subtotal * (taxRate/100);

  // calculate discount
  const discountAmount = subtotal * (discountRate/100);

  // calculate total/grand total
  const total = subtotal + taxAmount - discountAmount;

  const { data: updatedOrder, error: updateError } = await supabase
    .from("orders")
    .update({
      subtotal,
      tax_rate: taxRate,
      tax_amount: taxAmount,
      discount_rate: discountRate,
      discount_amount: discountAmount,
      total,
    })
    .eq("id", order.id)
    .select()
    .single();

  if (updateError) {
    throw new Error(updateError.message);
  }

  return updatedOrder;

};

// UPDATE ORDER STATUS (merge in paymentController)
export const updateOrderStatusService = async (orderId, status) => {
  const { data: order, error } = await supabase
    .from("orders")
    .update({
      status,
    })
    .eq("id", orderId)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return order;
};

// TRACK ORDER

// GET ORDERS BY TABLE NUMBER
export const getActiveOrdersByTableService = async (tableNumber) => {
  // First find the table
  const { data: table, error: tableError } = await supabase
    .from("tables")
    .select("id, table_number, table_name")
    .eq("table_number", tableNumber)
    .single();

  if (tableError) {
    throw new Error(tableError.message);
  }

  // Get active orders for this table
  const { data, error } = await supabase
    .from("orders")
    .select(`
      id,
      order_number,
      table_id,
      status,
      subtotal,
      tax_rate,
      tax_amount,
      discount_rate,
      discount_amount,
      total,
      created_at,

      order_items (
        id,
        menu_id,
        quantity,
        unit_price,
        subtotal,

        menus (
          id,
          name,
          price
        ),

        order_item_options (
          id,
          option_group_id,
          option_value_id,

          option_groups (
            id,
            name
          ),

          option_values (
            id,
            name,
            price_adjustment
          )
        )
      )
    `)
    .eq("table_id", table.id)
    .in("status", ["waiting", "preparing", "ready"])
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return {
    table,
    orders: data,
  };
};