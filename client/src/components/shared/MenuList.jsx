import MenuCard from "./MenuCard";

function MenuList ({ menus, onClick }) {

  if (menus.length === 0){
    return <p>No menu found</p>;
  }

  return (
    <div className="flex flex-wrap justify-center gap-4">
        {menus.map((menu) => (
          <MenuCard
          key={menu.id}
          menu={menu}
          onClick={() => onClick(menu)}
          />
        ))}
    </div>
  );
};

export default MenuList;