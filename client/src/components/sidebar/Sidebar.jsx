import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { sideBarMenu } from "../../data/sidebarMenu";
import { useState } from "react";
import logoFull from "../../assets/logo-full.svg";
import logoOnly from "../../assets/logo-only.svg";
import { Menu } from "lucide-react";

function Sidebar({ role, onToggle }) {

  // TABLE NUMBER ROUTE
  const { tableNumber } = useParams();

  const { logout } = useAuth();
  const navi = useNavigate();

  const [isOpen, setIsOpen] = useState(false);

  const [currentPath, setCurrentPath] = useState("/");

  // SHOW LOGOUT JUST FOR ADMIN AND KITCHEN
  const showLogout = role === "admin" || role === "kitchen";

  // SIDEBAR HIDE/SHOW BUTTON
  const handleToggle = () => {
    const newState = !isOpen;

    setIsOpen(newState);

    if (onToggle) {
      onToggle(newState);
    }
  };

  // FOR PASS THE USER ROUTE WITH PATH
  const handleNavigate = (path) => {
    setCurrentPath(path);

    if (role === "user") {
      navi(`/table/${tableNumber}${path}`);
    } else {
      navi(path);
    }
  };

  // CONNECT WITH SIDEBAR MENUS
  const menus = sideBarMenu[role] || [];

  // LOGOUT
  const handleLogout = () => {
    logout();
    navi("/login");
  };

  return (
    <aside>
      <div
        className={`
          fixed left-0 top-0 z-40 h-screen bg-white p-4 space-y-10
          ${isOpen
            ? "w-50"
            : "w-20"
          }
        `}
      >

        <div className="flex flex-col gap-y-5">
          <div className="w-full">
            <img
            src={logoOnly}
            alt="logo"
            className={`
              w-10
              ${isOpen && "hidden"}
            `}
            />
            <img
            src={logoFull}
            alt="logo"
            className={`
              w-40
              ${!isOpen && "hidden"}
            `}
            />
          </div>

          <div className="flex justify-between">
            {role === "user" && (
              <div className={`
                flex
                ${!isOpen && "hidden"}
              `}>
                <p className="bg-color-6 rounded-full px-4 py-2 text-sm text-color-4 font-medium">
                  Table {tableNumber}
                </p>
              </div>
            )}
            <button
              onClick={handleToggle}
            >
              <Menu className="w-7 text-color-2 hover:text-color-1 transition duration-300"/>
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-y-2">
          {menus.map((menu) => {
            const isActive = currentPath === menu.path;
            const Icon = menu.icon;

            return (
              <button
              key={menu.path}
              onClick={() => handleNavigate(menu.path)}
              className={`
                rounded-lg flex w-full gap-2 py-2 px-4
                ${isActive 
                  ? 'text-color-2 bg-color-3' 
                  : 'hover:bg-color-6'
                }
                ${
                  isOpen
                  ? "flex-row"
                  : "flex-col text-xs items-center"
                }
              `}
            >
              {Icon && 
                <Icon className="w-6 h-6" />
              } 
              <p>{menu.title}</p>
            </button>
            )
          })}

          {showLogout && (
            <button onClick={handleLogout}>
              Logout
            </button>
          )}
        </div>

      </div>
    </aside>
  );
}

export default Sidebar;