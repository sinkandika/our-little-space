import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import testRoute from "./routes/testRoute.js";
import authRoute from "./routes/authRoute.js";
import menuRoute from "./routes/menuRoute.js";
import tableRoute from "./routes/tableRoute.js";
import menuOption from "./routes/menuOptionRoute.js";
import menuOptionGroupRoute from "./routes/menuOptionGroupRoute.js";
import orderRoute from "./routes/orderRoute.js";
import storeSettingRoute from "./routes/storeSettingRoute.js";
import paymentRoute from "./routes/paymentRoute.js"

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/test", testRoute);

// AUTH 
app.use("/api/auth", authRoute);

// MENUS
app.use("/api/menus", menuRoute);

// TABLES
app.use("/api/tables", tableRoute);

// MENU OPTION (OPTION GROUP AND OPTION VALUES)
app.use("/api/menu-options", menuOption);

// MENU AND OPTION (MENUS AND OPTION GROUPS)
app.use("/api/menu-option-groups", menuOptionGroupRoute);

// ORDERS
app.use("/api/orders", orderRoute);

// STORE SETTING
app.use("/api/store-settings", storeSettingRoute);

// PAYMENT
app.use("/api/payments", paymentRoute);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});