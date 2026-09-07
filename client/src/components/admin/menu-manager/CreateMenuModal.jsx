import { useEffect, useState } from "react";
import { createMenu } from "../../../services/menuService";
import { getAllOption } from "../../../services/optionService";
import { attachOptionsToMenu } from "../../../services/menuOptionGroup";
import categoryOrder from "../../../data/categoryOrder";

function CreateMenuModal ({ isOpen, onClose, onSuccess }) {

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [categories, setCategories] = useState("");
  const [isAvailable, setIsAvailable] = useState(true);
  const [selectedImage, setSelectedImage] = useState("");

  const [options, setOptions] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [optionLoading, setOptionLoading] = useState(false);

  // RESET ALL INPUT
  const resetForm = () => {
    setName("");
    setDescription("");
    setPrice("");
    setCategories("");
    setIsAvailable(true);
    setSelectedImage("");

    setSelectedOptions([]);
  };

  // FETCH OPTION
  useEffect(() => {
    if (!isOpen) return;

    const fetchOptions = async () => {
      try {
        setOptionLoading (true);

        const response = await getAllOption();

        setOptions(response.data);
      } catch (err) {
        console.error("Failed fetching options:", err);
      } finally {
        setOptionLoading(false);
      }
    };

    fetchOptions();
  }, [isOpen]);

  // OPTION SELECTION
  const handleOptionChange = (optionId) => {
    setSelectedOptions((prev) =>
      prev.includes(optionId)
        ? prev.filter((id) => id !== optionId)
        : [...prev, optionId]
    );
  };

  // HANDLE SUBMIT
  const handleSubmit = async (e) => {

    e.preventDefault();

    const formData = new FormData();

    formData.append("name", name);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("categories", categories);
    formData.append("is_available", isAvailable);
    formData.append("image", selectedImage);

    try {
      const menuResponse = await createMenu(formData);

      // if option selected
      if (selectedOptions.length > 0) {
        await attachOptionsToMenu(
          menuResponse.data.id,
          selectedOptions
        );
      }

      resetForm();
      onSuccess();
      onClose();

    } catch (err) {
      console.error(err);
      alert("failed to create");
    };
  };

  // HANDLE CLOSE
  const handleCLose = () => {
    resetForm();
    onClose();
  }

  // GET CATEGORY
  const menuCategory = categoryOrder;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40">
      <div className="bg-white p-6 rounded-lg">
        <form onSubmit={handleSubmit}>
          <p>name</p>
          <input
          type="text"
          required
          value={name}
          onChange={(e) => setName (e.target.value)}
          placeholder="name"
          className="border"
          />
          <p>description</p>
          <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="desc"
          className="border"
          />
          <p>Categories</p>
          <select
            value={categories}
            onChange={(e) => setCategories(e.target.value)}
            className="border"
          >
            <option value="" disabled>
              Select category
            </option>
            {menuCategory.map((cate) => (
              <option
                key={cate.key}
                value={cate.key}
              >
                {cate.label}
              </option>
            ))}
          </select>
        
          <p>price</p>
          <input
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          placeholder="capt. price"
          className="border"
          />
          <p>status</p>
          <label>
            <input
            type="checkbox"
            checked={isAvailable}
            onChange={(e)=> setIsAvailable(e.target.checked)}
            />
            Available?
          </label>
          <span>Choose file bro</span>
          <input
          type="file"
          accept="image/*"
          onChange={(e) =>
            setSelectedImage(e.target.files[0])
          }
          className="border"
          />
          <p>option selection</p>
          {optionLoading ? (
            <p>Loading options...</p>
          ) : options.length === 0 ? (
            <p>No option available</p>
          ) : (
            <div className="flex flex-col">
              {options.map((opt) => (
                <label
                key={opt.id}
                >
                  <input
                  type="checkbox"
                  checked={selectedOptions.includes(opt.id)}
                  onChange={() => handleOptionChange(opt.id)}
                  />
                  <span>{opt.name}</span>
                </label>
              ))}
            </div>
          )}
          <button
          type="submit"
          className="border"
          >submit
          </button>
        </form>
        <button
        onClick={handleCLose}
        className="border"
        >
          Close
        </button>
      </div>
    </div>
  );

};

export default CreateMenuModal;