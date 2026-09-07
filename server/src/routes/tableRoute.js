import express from "express";
import { getAllTable, getTableByNumber } from "../controllers/tableController.js";

const router = express.Router();
// GET ALL TABLES
router.get("/", getAllTable);
// GET TABLES BY NUMBER
router.get("/:tableNumber", getTableByNumber);

export default router;