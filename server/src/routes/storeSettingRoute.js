import express from "express";
import { getStoreSetting } from "../controllers/storeSettingController.js";

const router = express.Router();

router.get("/", getStoreSetting);

export default router;