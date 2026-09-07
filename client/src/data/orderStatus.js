import waitingIcon from "../assets/waiting-icon.svg";
import preparingIcon from "../assets/preparing-icon.svg";
import readyIcon from "../assets/ready-icon.svg";

const orderStatus = {
  waiting: {
    label: "Waiting for Confirmation",
    description: "Your order has been received and is waiting for confirmation from our kitchen",
    icon: waitingIcon,
    iconClassname: "w-10 h-10"
  },

  preparing: {
    label: "Preparing Your Order",
    description: "Our kitchen is carefully preparing your order. Thank you for your patience.",
    icon: preparingIcon,
    iconClassname: "w-14 h-14"
  },

  ready: {
    label: "Ready to Serve",
    description: "Your order is ready and will be served to your table shortly.",
    icon: readyIcon,
    iconClassname: "w-10 h-10"
  },
};

export default orderStatus;