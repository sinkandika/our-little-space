import { attachOptionsToMenuService, updateMenuOptionsService } from "../services/menuOptionGroupService.js";

// MERGE OPTION GROUPS AND MENU
export const attachOptionsToMenu = async (req, res) => {
  try {
    const { menuId } = req.params;

    const optionGroupIds = req.body.option_group_ids || []; 

    if (!Array.isArray(optionGroupIds)) {
      return res.status(400).json({
        success: false,
        message: "option_group_ids must be array",
      });
    }

    const data = await attachOptionsToMenuService(
      menuId,
      optionGroupIds
    );

    res.status(201).json({
      success: true,
      message: "Option groups attached to menu successfully",
      data,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// UPDATE OPTIONS ATTACHED TO MENU
export const updateMenuOptions = async (req, res) => {
  try {
    const { menuId } = req.params;

    const optionGroupIds = req.body.option_group_ids || [];

    if (!Array.isArray(optionGroupIds)) {
      return res.status(400).json({
        success: false,
        message: "option_group_ids must be an array",
      });
    }

    const data = await updateMenuOptionsService(
      menuId,
      optionGroupIds
    );

    res.status(200).json({
      success: true,
      message: "Menu options updated successfully",
      data,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};