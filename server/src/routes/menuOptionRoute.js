import express from "express";
import { 
  createOption,
  deleteOption,
  getOption, 
  updateOption
} from "../controllers/menuOptionController.js";

const router = express.Router();

// GET OPTION GROUP AND THEIR VALUE
router.get("/", getOption);


// POST MENU OPTION
router.post("/", createOption);

// PUT MENU OPTION
router.put("/:optionId", updateOption);

// DELETE MENU OPTION
router.delete("/:optionId", deleteOption);

export default router;