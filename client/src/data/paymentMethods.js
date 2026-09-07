import qrisIcon from "../assets/qris-icon.svg";
import gopayIcon from "../assets/gopay-icon.svg";
import { Banknote } from "lucide-react";

const paymentMethods = [
  {
    key: "qris",
    label: "QRIS",
    icon: qrisIcon,
  },
  {
    key: "gopay",
    label: "GoPay",
    icon: gopayIcon,
  },
  {
    key: "cash",
    label: "Cash",
    icon: Banknote,
  },
];

export default paymentMethods;