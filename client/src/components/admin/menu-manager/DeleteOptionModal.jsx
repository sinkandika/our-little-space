import { deleteOption } from "../../../services/optionService";

function DeleteOptionModal({ isOpen, onClose, onSuccess, option }) {

  if (!isOpen || !option) return null;

  // HANDLE DELETE
  const handleDelete = async () => {
    try {
      await deleteOption(option.id);

      onSuccess();
      onClose();
    } catch (err) {
      console.error(err);
      alert("Failed to delete menu");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40">

      <div className="bg-white p-6 rounded-lg">

        <h2 className="text-xl font-bold">
          Delete Menu
        </h2>

        <p className="mt-3">
          Are you sure you want to delete this 
        </p>
        <p className="font-bold">{option.name}</p>
        <p>option?</p>

        <div className="flex gap-3 mt-6">

          <button
            onClick={onClose}
            className="border px-4 py-2"
          >
            Cancel
          </button>

          <button
            onClick={handleDelete}
            className="border px-4 py-2"
          >
            Delete
          </button>

        </div>

      </div>

    </div>
  );
};

export default DeleteOptionModal;