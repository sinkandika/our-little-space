import AdminMenuCard from "./AdminMenuCard";

function AdminMenuList ({ menus, onEdit, onDelete }) {

  if (menus.length === 0){
    return <p>No menus found.</p>;
  }

  return (
    <div className="grid grid-cols-4 ">
      {menus.map((menu) => (
        <AdminMenuCard
        key={menu.id}
        menu={menu}
        onEdit={onEdit}
        onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export default AdminMenuList;