import { getStoreSettingService } from "../services/storeSettingService.js";

// GET STORE SETTINGS 
export const getStoreSetting = async (req, res) => {
  try {
    const settings = await getStoreSettingService();

    return res.status(200).json({
      success: true,
      message: "Store settings retrieved successfully",
      data: settings,
    });
  } catch (err) {
    console.error("Get store settings error:", err);

    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};