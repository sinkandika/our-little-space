function TableCard({ table, onMove }) {


  return (
    <div
      onClick={() => onMove(table)}
      className="bg-color-2 hover:bg-color-1 transition duration-300 p-6 rounded-xl w-30 text-sm text-white flex justify-center"
    >
      <button>
        Table {table.table_number}
      </button>
    </div>
  );
};

export default TableCard;