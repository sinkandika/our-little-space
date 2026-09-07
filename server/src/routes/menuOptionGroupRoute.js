import express from "express";
import { attachOptionsToMenu, updateMenuOptions } from "../controllers/menuOptionGroupController.js";


const router = express.Router();

// ATTACH OPTION GROUPS TO MENU
router.post("/:menuId/options", attachOptionsToMenu);

// UPDATE OPTIONS ATTACHED TO MENU
router.put("/:menuId/options", updateMenuOptions);

export default router;