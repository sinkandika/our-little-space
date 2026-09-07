import { useEffect, useState } from "react";
import { getAllOption } from "../../services/optionService";
import CreateOptionModal from "../../components/admin/menu-manager/CreateOptionModal";
import MenuOptionCard from "../../components/admin/menu-manager/MenuOptionCard";
import EditOptionModal from "../../components/admin/menu-manager/EditOptionModal";
import DeleteOptionModal from "../../components/admin/menu-manager/DeleteOptionModal";

function OptionManager () {

  const [options, setOptions] = useState([]);

  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const [selectedOption, setSelectedOption] = useState(null);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  // FETCH OPTION
  const fetchOption = async () => {
    try {
      const response = await getAllOption();
      setOptions(response.data);

    } catch (err) {
      console.log("failed fetch options", err);
    }
  };

  useEffect(() => {
    fetchOption();
  },[]);

  // HANDLE CREATE OPTION 
  const handleCreate = () => {
    setIsCreateOpen(true)
  };

  // HANDLE EDIT OPTION 
  const handleEdit = (option) => {
    setSelectedOption(option);
    setIsEditOpen(true);
  };

  // HANDLE DELETE OPTION
  const handleDelete = (option) => {
    setSelectedOption(option);
    setIsDeleteOpen(true);
  };
  
  return (
    <div className="min-h-screen">
      <button
      onClick={handleCreate}
      className="border"
      >
        add option
      </button>

      <p>Option Manager</p>
      <div>
        <MenuOptionCard
        options={options}
        onEdit={handleEdit}
        onDelete={handleDelete}
        />
      </div>

      <CreateOptionModal
      isOpen={isCreateOpen}
      onClose={() => setIsCreateOpen(false)}
      onSuccess={fetchOption}
      />
      <EditOptionModal
      isOpen={isEditOpen}
      option={selectedOption}
      onClose={() => setIsEditOpen(false)}
      onSuccess={fetchOption} 
      />
      <DeleteOptionModal
      isOpen={isDeleteOpen} 
      option={selectedOption}
      onClose={() => {
        setIsDeleteOpen(false);
        setSelectedOption(null);
      }}
      onSuccess={fetchOption}
      />
    </div>
  );
};

export default OptionManager;