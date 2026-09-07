import { 
  createMenuService,
  deleteMenuService,
  getMenuDetailService,
  getMenusService, 
  updateMenuService
} from "../services/menuService.js"
import { uploadImageService } from "../services/uploadImageService.js";

// GET ALL MENUS
export const getMenus = async (req, res) => {
  try {
    const menus = await getMenusService();

    res.status(200).json({
      success: true,
      data: menus,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// GET MENU DETAIL BY MENU ID
export const getMenuDetail = async (req, res) => {
  try {
    const { id } = req.params;

    const menus = await getMenuDetailService(id);

    res.status(200).json({
      success: true,
      data: menus,
    })
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
}

// POST MENU AND IMAGE CLOUDINARY
export const createMenu = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      categories,
      is_available,
    } = req.body;

    // image can null
    let image_url = null;

    // Upload Image if provided
    if (req.file) {
      const result = await uploadImageService(
      req.file.buffer
      );

      image_url = result.secure_url;

    };
    
    // save menu to db
      const menu = await createMenuService({
        name, 
        description,
        price,
        categories,
        is_available,
        image_url,
      });
      
      res.status(201).json({
        success: true,
        message: "Menu created successfully",
        data: menu,
      });
      
  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

// PUT MENU
export const updateMenu = async (req, res) => {
  try {
    const { id } = req.params; // get menu id

    const {
      name,
      description,
      price,
      categories,
      is_available,
    } = req.body;

    // image can benull
    let image_url = null;

    // Upload new image if provided
    if (req.file) {
      const result = await uploadImageService(
        req.file.buffer
      );

      image_url = result.secure_url;
    }

    // Update menu
    const menu = await updateMenuService(id, {
      name,
      description,
      price,
      categories,
      is_available,
      image_url,
    });

    res.status(200).json({
      success: true,
      message: "Menu updated successfully",
      data: menu,
    });

  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// DELETE MENU
export const deleteMenu = async (req, res) => {
  try {
    const { id } = req.params;

    await deleteMenuService(id);

    res.status(200).json({
      success: true,
      message: "Menu deleted successfully",
    });
    
  } catch (err) {
      console.error(err);

      res.status(500).json({
        success: false,
        message: err.message,
      });
    }
};