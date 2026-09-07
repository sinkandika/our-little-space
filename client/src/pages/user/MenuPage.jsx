import { useEffect } from "react";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { getTableByNumber } from "../../services/tableService";
import { getAllMenus } from "../../services/menuService";
import MenuCard from "../../components/shared/MenuCard";
import categoryOrder from "../../data/categoryOrder";
import MenuDetailModal from "../../components/shared/MenuDetailModal";
import { useDebounce } from "../../hooks/useDebounce";
import wordmark from "../../assets/wordmark.svg";
import { Search } from "lucide-react";

function MenuPage () {

  const { tableNumber } = useParams();
  const [table, setTable] = useState(null);
  const [tableLoading, setTableLoading] = useState(true);
  const [menus, setMenus] = useState([]);
  const [menuLoading, setMenuLoading] = useState(true);

  const [isMenuModalOpen, setIsMenuModalOpen] = useState(false);
  const [selectedMenuId, setSelectedMenuId] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const debounceSearch = useDebounce(searchTerm, 300);

  const [selectedCategory, setSelectedCategory] = useState ("all");

  // FETCH TABLE BY TABLE_NUMBER
  useEffect(() => {
    const fetchTable = async () => {
      try {
        const tableRes = await getTableByNumber(tableNumber);
        setTable(tableRes.data);

      } catch (err) {
        console.log("error fetch table", err);
      } finally {
        setTableLoading(false);
      }
    };
      fetchTable();
  }, [tableNumber]);

  // FETCH MENUS
  useEffect(() => {
    if (!table) return;

    const fetchMenus = async () => {
      try {
        const res = await getAllMenus();
        setMenus(res.data);
      } catch (err) {
        console.error("Error fetching menus", err);
      } finally {
        setMenuLoading(false);
      }
    };

    fetchMenus();
  }, [table]);

  // SEARCH BAR, CATEGORY BUTTON AND GROUP MENU BY CATEGORY
  // search 
  const filteredMenus = menus.filter((menu) => {
    const matchesSearch = menu.name
      .toLowerCase()
      .includes(debounceSearch.toLowerCase());

    // category button
    const matchesCategory = 
      selectedCategory === "all" ||
      menu.categories?.toLowerCase() === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  // group by category
  const groupedMenus = filteredMenus.reduce((acc, menu) => {
    const category = menu.categories || "Others";

    if (!acc[category]) {
      acc[category] = [];
    }

    acc[category].push(menu);

    return acc;
  }, {});

  // CATEGORY ORDER
  const menuCategories = categoryOrder;

  return (
    <div className="min-h-screen bg-color-6 p-6 rounded-tl-[50px] w-full">

      {tableLoading ? (
        <div className="flex flex-col justify-center items-center py-10 gap-4">
          <div className="w-12 h-12 rounded-full border-color-2 border-t-color-1 border-4 animate-[spin_0.5s_linear_infinite] "></div>
          <p>Loading table.... </p>
        </div>
      ) : (
        <div className="w-full flex flex-col gap-y-4">
          <div className="flex flex-col items-center gap-y-2">
        <div className="flex flex-row justify-center items-center gap-x-2">
          <p className="text-2xl font-bold text-color-4 hidden md:block">
            Welcome to
          </p>
          <img
          src={wordmark}
          alt="wordmark"
          className="w-45 mt-1"
          />
        </div>
        <div className="border-b-2 border-color-1 w-50 md:w-100"></div>
      </div>

      <div className="flex flex-col gap-y-4 lg:gap-y-0">
        <div className="lg:relative">
          <div className="lg:absolute lg:right-0">
            <div className="flex flex-col lg:flex-row justify-end gap-2">
              <button
              onClick={() => setSelectedCategory("all")}
              className={`
                px-4 py-2 rounded-full font-medium
                ${
                  selectedCategory === "all"
                    ? "bg-color-2 text-white"
                    : "bg-white"
                }
              `}
              >
                All Menu
              </button>
        
              {menuCategories.map((category) => (
                <button
                key={category.key}
                onClick={() => setSelectedCategory(category.key)}
                className={`
                  px-4 py-2 rounded-full font-medium
                  ${
                    selectedCategory === category.key
                      ? "bg-color-2 text-white"
                      : "bg-white"
                  }
                `}
                >
                  {category.label}
                </button>
              ))}
              <div className="relative">
                <Search className="absolute w-5 h-5 translate-1/2 left-1"/>
                <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search menu..."
                className="bg-white rounded-full pr-4 py-2 pl-11 outline-color-1 w-full"
                />
              </div>
            </div>
          </div>
        </div>
        
        <div className="">
          {menuLoading ? (
            <div className="flex flex-col justify-center items-center py-10 gap-4">
              <div className="w-12 h-12 rounded-full border-color-2 border-t-color-1 border-4 animate-[spin_0.5s_linear_infinite] "></div>
              <p>Loading menu.... </p>
            </div>
          ) : (
            menuCategories.map(({ key, label, icon: Icon }) => {
              const categoryMenus = groupedMenus[key]; // call group menu
              if (!categoryMenus) return null; // Skip categories that have no menus
              return (
                <div
                key={key}
                className="flex flex-col pb-5 gap-y-4">
                  <div className="flex gap-x-1 border-b-2 border-color-1 w-fit py-1">
                    {Icon &&
                      <Icon className="w-7 h-7 text-color-4"/>
                    }
                    <h2 className="text-xl font-bold mt-1">
                      Our {label}
                    </h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-5 gap-4">
                    {categoryMenus.map((menu) => (
                      <MenuCard
                      key={menu.id}
                      menu={menu}
                      onClick={() => {
                        setSelectedMenuId(menu.id);
                        setIsMenuModalOpen(true);
                      }}
                      />
                    ))}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
        </div>
      )}

      

      <MenuDetailModal
      isOpen={isMenuModalOpen}
      menuId={selectedMenuId}
      onClose={() => {
        setIsMenuModalOpen(false);
        setSelectedMenuId(null);
      }} 
      />

    </div>
  );
};

export default MenuPage;