
// MENU

// TOTAL (PER ITEM PLUS THEIR OPTION) 
export const calculateOrderTotal = (menu, order) => {
  if (!menu || !order) {
    return 0;
  }

  let total = Number(menu.price) || 0;

  menu.optionGroups?.forEach((group) => {
    const selected = order.selectedOptions[group.id];

    if (!selected) {
      return;
    }

    // Multiple choice
    if (group.multiple_choice) {
      selected.forEach((valueId) => {
        const value = group.values.find(
          (value) => value.id === valueId
        );

        if (value) {
          total += Number(value.price_adjustment) || 0;
        }
      });

      return;
    }

    // Single choice
    const value = group.values.find(
      (value) => value.id === selected
    );

    if (value) {
      total += Number(value.price_adjustment) || 0;
    }
  });

  return total;
};

// GRAND TOTAL (ALL ITEMS AND OPTIONS)
export const calculateGrandTotal = (menu, orders) => {
  if (!menu || !orders?.length) {
    return 0;
  }

  return orders.reduce((total, order) => {
    return total + calculateOrderTotal(menu, order);
  }, 0);
};

// ORDER DEFAULT OPTION
export const getDefaultOptions = (menu) => {
  const selectedOptions = {};

  menu.optionGroups?.forEach((group) => {
    if (!group.values?.length) {
      return;
    }

    // Single choice → select first option
    if (!group.multiple_choice) {
      selectedOptions[group.id] = group.values[0].id;
    }

    // Multiple choice → nothing selected initially
    else {
      selectedOptions[group.id] = [];
    }
  });

  return selectedOptions;
};

// MY ORDER

// SUBTOTAL (ALL CART ITEMS INCLUDING OPTIONS)
export const calculateCartSubtotal = (menuDetails) => {
  if (!menuDetails?.length) {
    return 0;
  }

  return menuDetails.reduce((total, item) => {
    let itemTotal = Number(item.menu.price) || 0;

    item.options?.forEach((selectedOption) => {
      const group = item.menu.optionGroups?.find(
        group => group.id === selectedOption.optionGroupId
      );

      const value = group?.option_values?.find(
        value => value.id === selectedOption.optionValueId
      );

      if (value) {
        itemTotal += Number(value.price_adjustment) || 0;
      }
    });

    return total + itemTotal * item.quantity;
  }, 0);
};