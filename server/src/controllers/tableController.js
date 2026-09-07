import { 
  getAllTableService, 
  getTableByNumberService 
} from "../services/tableService.js";
// GET ALL TABLES
export const getAllTable = async (req, res) => {
  try {
    const tables = await getAllTableService();

    res.status(200).json({
      success: true,
      data: tables,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      data: err.message,
    })
  }
};

// GET TABLES BY NUMBER
export const getTableByNumber = async (req, res) => {
  try {
    const { tableNumber } = req.params;

    const table = await getTableByNumberService( tableNumber );

    res.status(200).json({
      success: true,
      data: table,
    });
  } catch (err) {
    res.status(404).json({
      success: false,
      message: err.message,
    });
  }
};