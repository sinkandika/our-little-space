import { createOptionService, deleteOptionService, getOptionService, updateOptionService } from "../services/menuOptionService.js";

// GET OPTION GROUP AND THEIR VALUE
export const getOption = async (req, res) => {
  try {
    const option = await getOptionService();

    res.status(200).json({
      success: true,
      data: option,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// POST MENU OPTION GROUP
export const createOption = async (req, res) => {
  try {
    const option = await createOptionService(req.body);

    res.status(201).json({
      success: true,
      message: "option create successfully",
      data: option,
    })
  } catch (err) {

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// PUT MENU OPTION
export const updateOption = async (req, res) => {
  // update group
  try {
    const { optionId } = req.params;

    const option = await updateOptionService(optionId, req.body);

    res.status(200).json({
      success: true,
      message: "Option updated successfully",
      data: option,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// DELETE MENU OPTION
export const deleteOption = async (req, res) => {
  try {
    const { optionId } = req.params;

    const option = await deleteOptionService(optionId);

    res.status(200).json({
      success: true,
      message: option.message,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};