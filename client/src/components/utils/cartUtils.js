
// make order in "add to card" who has identical option merge in one (change quantity > 1)
export const areOptionsEqual = (optionsA, optionsB) => {
  if (optionsA.length !== optionsB.length) {
    return false;
  }

  const sortedA = [...optionsA].sort(
    (a, b) =>
      `${a.optionGroupId}-${a.optionValueId}`.localeCompare(
        `${b.optionGroupId}-${b.optionValueId}`
      )
  );

  const sortedB = [...optionsB].sort(
    (a, b) =>
      `${a.optionGroupId}-${a.optionValueId}`.localeCompare(
        `${b.optionGroupId}-${b.optionValueId}`
      )
  );

  return sortedA.every(
    (option, index) =>
      option.optionGroupId === sortedB[index].optionGroupId &&
      option.optionValueId === sortedB[index].optionValueId
  );
};

// ORDER FORMAT OPTIONS
export const formatOptions = (selectedOptions) => {
  return Object.entries(selectedOptions).flatMap(
    ([optionGroupId, value]) => {
      // Multiple choice
      if (Array.isArray(value)) {
        return value.map(optionValueId => ({
          optionGroupId,
          optionValueId,
        }));
      }

      // Single choice
      return [
        {
          optionGroupId,
          optionValueId: value,
        },
      ];
    }
  );
};

// GROUP MENU ITEMS
export const groupMenuItems = (menuDetails) => {
  if (!Array.isArray(menuDetails)) return [];

  return menuDetails.reduce((acc, item) => {
    const existingItem = acc.find(
      (groupedItem) => groupedItem.menuId === item.menuId
    );

    if (existingItem) {
      existingItem.quantity += item.quantity;
    } else {
      acc.push({
        menuId: item.menuId,
        name: item.menu?.name || "",
        quantity: item.quantity,
      });
    }

    return acc;
  }, []);
};

// GROUP MENU ITEMS
// SAME MENU IS GROUPED TOGETHER
// OPTIONS ARE ALSO GROUPED UNDER THE MENU
export const groupTrackOrderItems = (menuDetails) => {
  if (!Array.isArray(menuDetails)) return [];

  return menuDetails.reduce((acc, item) => {
    const existingItem = acc.find(
      (groupedItem) => groupedItem.menuId === item.menu_id
    );

    if (existingItem) {
      existingItem.quantity += item.quantity;

      item.order_item_options?.forEach((option) => {
        existingItem.options.push({
          groupName: option.option_groups?.name || "",
          valueName: option.option_values?.name || "",
        });
      });
    } else {
      acc.push({
        menuId: item.menu_id,
        name: item.menus?.name || "",
        quantity: item.quantity,
        options: (item.order_item_options || []).map((option) => ({
          groupName: option.option_groups?.name || "",
          valueName: option.option_values?.name || "",
        })),
      });
    }

    return acc;
  }, []);
};