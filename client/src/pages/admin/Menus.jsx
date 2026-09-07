import { useEffect, useState } from "react";
import { getAllMenus } from "../../services/menuService";
import MenuCard from "../../components/shared/MenuCard";

function Menus () {

  const [menus, setMenus] = useState([]);

  // FETCH MENUS
  useEffect(() => {
    const fetchMenus = async () => {
      try {
        const res = await getAllMenus();
        setMenus(res.data);
      } catch (err) {
        console.error("Error fetching menus", err);
      }
    };

    fetchMenus();
  })

  return (
  <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-5 gap-4">
    {menus.map((menu) => (
      <MenuCard
      key={menu.id}
      menu={menu}
      />
    ))}
  </div>
  );
};

export default Menus;