import { useEffect, useState } from "react";

import CreateMenuModal from "../../components/admin/menu-manager/CreateMenuModal";
import { getAllMenus } from "../../services/menuService";
import AdminMenuList from "../../components/admin/menu-manager/AdminMenuList";
import EditMenuModal from "../../components/admin/menu-manager/EditMenuModal";
import DeleteMenuModal from "../../components/admin/menu-manager/DeleteMenuModal";



function MenuManager() {
  const [menus, setMenus] = useState([]);

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState(null);

  // GET MENUS
  const fetchMenus = async () => {
    try {

      const response = await getAllMenus();
      setMenus(response.data);

    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchMenus();
  }, []);

  // HANDLE CREATE MENU MODAL
  const handleCreate = () => {
    setIsCreateOpen(true);
  };

  // HANDLE EDIT MENU MODAL
  const handleEdit = (m) => {
    setSelectedMenu(m)
    setIsEditOpen(true);
  };

  // HANDLE DELETE MENU MODAL
  const handleDelete = (m) => {
    setSelectedMenu(m)
    setIsDeleteOpen(true)
  }

  return (
    <div>
      <h1>Menu Manager</h1>

      <button 
      onClick={handleCreate}
      className="border"
      >
        Add Menu
      </button>

      <AdminMenuList
      menus={menus}
      onEdit={handleEdit}
      onDelete={handleDelete}
      />

      <CreateMenuModal
      isOpen={isCreateOpen}
      onClose={() => setIsCreateOpen(false)}
      onSuccess={fetchMenus}
      />

      <EditMenuModal
      isOpen={isEditOpen} 
      menu={selectedMenu}
      onClose={() => {
        setIsEditOpen(false)
        setSelectedMenu(null)
      }}
      onSuccess={fetchMenus}
      />

      <DeleteMenuModal
      isOpen={isDeleteOpen}
      menu={selectedMenu}
      onClose={() => {
        setIsDeleteOpen(false);
        setSelectedMenu(null);
      }}
      onSuccess={fetchMenus}
      />


    </div>
  );
}

export default MenuManager;