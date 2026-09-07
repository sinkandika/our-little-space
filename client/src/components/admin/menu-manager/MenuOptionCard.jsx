function MenuOptionCard({ options, onEdit, onDelete }) {

  // handle empty state
  if (!options || options.length === 0) {
    return <p>No menu Options availabe</p>;
  }

  return (
    <div className="grid grid-cols-4">
      {options.map((group) => {
        return (
          <div 
          key={group.id}
          className="border"
          >
            <p>{group.name}</p>
            <p>
              Type: {group.multiple_choice 
                ? "multiple choice" 
                : "single choice"
              }
            </p>

            {group.values && group.values.length > 0 ? (
              <ul>
                {group.values.map((val) => (
                  <li key={val.id}>
                    <span>{val.name}</span>
                    <span>
                      {val.price_adjustment > 0 
                      ? `+Rp${Number(val.price_adjustment).toLocaleString("id-ID")}` 
                      : "Free"}
                    </span>
                  </li>
                ))}
                <button 
                onClick={() => onEdit(group)}
                className="border"
                >
                  Edit
                </button>
                <button
                onClick={() => onDelete(group)}
                className="border"
                >
                  Delete
                </button>
              </ul>
            ) : (
              <p>No choices added to this group yet.</p>
            )}
          </div>
        )
      })}
    </div>
  );
};

export default MenuOptionCard;