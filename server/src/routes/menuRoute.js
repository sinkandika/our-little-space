import express from "express";
import { 
  getMenus,
  createMenu,
  updateMenu,
  deleteMenu,
  getMenuDetail,
} from "../controllers/menuController.js";
import { adminOnly, authenticate } from "../middleware/authMiddleware.js";
import upload from "../middleware/upload.js";

const router = express.Router();

// GET ALL MENUS
router.get("/", getMenus);

// GET MENU DETAIL BY MENU ID
router.get("/:id", getMenuDetail);

// POST MENUS AND IMAGE CLOUDINARY
router.post(
  "/", 
  authenticate, 
  adminOnly, 
  upload.single("image"), 
  createMenu
);

// PUT MENU
router.put(
  "/:id",
  authenticate,
  adminOnly,
  upload.single("image"),
  updateMenu
);

// DELETE MENU
router.delete(
  "/:id",
  authenticate,
  adminOnly,
  deleteMenu
)

export default router;