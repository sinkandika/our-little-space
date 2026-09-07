const MenuCard = ({ menu, onClick }) => {
  return (
    <button 
    onClick={onClick}
    className="flex flex-col rounded-2xl p-4 shadow bg-white w-full hover:shadow-2xl hover:shadow-color-1/30 transition duration-300"
    >
      {menu.image_url ? (
        <div className="bg-color-3 rounded">
          <img
            src={menu.image_url}
            alt={menu.name}
            className="aspect-4/3 object-cover"
          />
        </div>
      ) : (
        <div className="aspect-4/3 bg-color-5 rounded flex items-center justify-center">
          No Image
        </div>
      )}

      <div className="flex flex-1 flex-col py-4 text-left">
        <p className="text-lg font-semibold text-color-4">
          {menu.name}
        </p>
        <p className="text-sm text-color-9">
          {menu.description}
        </p>
      </div>

      <div className="flex mt-auto">
        <p className="font-bold text-left">
          Rp {Number(menu.price).toLocaleString("id-ID")}
        </p>
      </div>
    </button>
  );
};

export default MenuCard;