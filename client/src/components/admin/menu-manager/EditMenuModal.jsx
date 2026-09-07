import { useEffect, useState } from "react";
import { getMenuDetail, updateMenu } from "../../../services/menuService";
import { getAllOption } from "../../../services/optionService";
import { updateMenuOptions } from "../../../services/menuOptionGroup";
import categoryOrder from "../../../data/categoryOrder";

function EditMenuModal ({ isOpen, onClose, onSuccess, menu }) {

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [categories, setCategories] = useState("");
  const [isAvailable, setIsAvailable] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);

  const [options, setOptions] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [optionLoading, setOptionLoading] = useState(false);

  // LOAD MENU AND OPTION 
  useEffect(() => {
    if (!isOpen || !menu) return;

    const loadMenuData = async () => {
      try {
        setOptionLoading(true);

        // get menu detail + attached options
        const menuResponse = await getMenuDetail(menu.id);

        // get all reusable options
        const optionResponse = await getAllOption();

        const menuDetail = menuResponse.data;
        const allOptions = optionResponse.data;

        // load option and menu
        setOptions(allOptions);

        setName(menuDetail.name);
        setDescription(menuDetail.description);
        setPrice(menuDetail.price);
        setCategories(menuDetail.categories);
        setIsAvailable(menuDetail.is_available);

        setSelectedImage(null);

        // get currently attached option group IDs
        setSelectedOptions(
          menuDetail.optionGroups?.map(
            (option) => option.id
          ) || []
        );

      } catch (err) {
        console.error("Failed to load menu:", err);
      } finally {
        setOptionLoading(false);
      }
    };

    loadMenuData();
  }, [isOpen, menu]);

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

    try {
      const formData = new FormData();

      formData.append("name", name);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("categories", categories);
      formData.append("is_available", isAvailable);

      // only send image if there's any image change
      if (selectedImage) {
        formData.append("image", selectedImage);
      }

      // update menu information
      await updateMenu(menu.id, formData);

      // update menu option relationships
      await updateMenuOptions(
        menu.id,
        selectedOptions
      );

      setSelectedImage(null);

      onSuccess();
      onClose();

    } catch (err) {
      console.error(err);
      alert("failed to Update :(");
    }
  };

  // HANDLE CLOSE
  const handleCLose = () => {
    setSelectedImage(null);
    onClose();
  };

  // GET CATEGORY
  const menuCategory = categoryOrder;

  if (!isOpen || !menu) return null ;

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

export default EditMenuModal;