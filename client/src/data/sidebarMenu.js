import { 
  ClockFading,
  Logs, 
  NotebookPen, 
} from "lucide-react";

export const sideBarMenu = {
  admin: [
    {
      title: "Dashboard",
      path: "/admin/dashboard",
    },

    {
      title: "Menus",
      path: "/admin/menus",
    },

    {
      title: "Menu Manager",
      path: "/admin/menu-manager",
    },

    {
      title: "Option Manager",
      path: "/admin/option-manager",
    },
  ],

  kitchen: [
    {
      title: "Dashboard",
      path: "/kitchen/dashboard",
    },
    
  ],

  user: [
    {
      title: "Menu",
      path: "/menu",
      icon: NotebookPen,
    },
    
    {
      title: "My order",
      path: "/my-order",
      icon: Logs,
    },

    {
      title: "Track Order",
      path: "/track-order",
      icon: ClockFading,
    }
  ]
}