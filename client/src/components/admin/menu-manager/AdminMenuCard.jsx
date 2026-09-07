function AdminMenuCard({ menu, onEdit, onDelete }) {

  return (
    <div className="border rounded-lg p-4">

      <img
        src={menu.image_url}
        alt={menu.name}
        className="aspect-4/3 object-cover border"
      />

      <h2>{menu.name}</h2>
      <p>{menu.description}</p>
      <p>category: {menu.categories}</p>
      <p>Rp {Number(menu.price).toLocaleString("id-ID")}</p>

      <p>
        {menu.is_available
          ? "Available"
          : "Unavailable"}
      </p>

      <div>
        <button 
        onClick={() => onEdit(menu)}
        className="border"
        >
          Edit
        </button>

        <button 
        onClick={() => onDelete(menu)}
        className="border"
        >
          Delete
        </button>
      </div>

    </div>
  );
}

export default AdminMenuCard;