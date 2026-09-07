import { Outlet } from "react-router-dom";
import Sidebar from "../components/sidebar/Sidebar";
import { useState } from "react";

function UserLayout() {

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen">

      <Sidebar
        role="user"
        onToggle={setIsSidebarOpen}
      />

      <main
        className={`
          flex min-h-screen transition-all duration-300 pt-6
          ${isSidebarOpen ? "ml-50" : "ml-20"}
        `}
      >
        <Outlet />
      </main>

    </div>
  );
}

export default UserLayout;