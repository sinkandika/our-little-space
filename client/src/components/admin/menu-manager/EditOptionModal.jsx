import { useEffect, useState } from "react";
import { updateOption } from "../../../services/optionService";

function EditOptionModal ({ isOpen, option, onClose, onSuccess }) {
  

  const [name, setName] = useState("");
  const [required, setRequired] = useState(false);
  const [multipleChoice, setMultipleChoice] = useState(false);
  const [displayOrder, setDisplayOrder] = useState(1);

  const [values, setValues] = useState([
    {
      name: "",
      price_adjustment: 0,
      display_order: 1,
    },
  ]);

  // RESET FORM
  const resetForm = () => {
    setName(option?.name || "");
    setRequired(option?.required || false);
    setMultipleChoice(option?.multiple_choice || false);
    setDisplayOrder(option?.display_order || 1);
    setValues(
      option?.values
        ? option.values.map(v => ({ ...v }))
        : [{ 
          name: "", 
          price_adjustment: 0, 
          display_order: 1 
        }]
    );
  };

  // PRE FILL
  useEffect(() => {
    if (!option) return;

    setName(option.name);
    setRequired(option.required);
    setMultipleChoice(option.multiple_choice);
    setDisplayOrder(option.display_order);

    setValues(option.values.map(v => ({ ...v })));
  }, [option]);

  // HANDLE ADD VALUE
  const handleAddValue = () => {
    setValues([
      ...values,
      {
        name: "",
        price_adjustment: 0,
        display_order: values.length + 1,
      },
    ]);
  };

  // HANDLE CHANGE VALUE
  const handleChangeValue = (index, field, value) => {
    const updated = [...values];

    updated[index]= {
      ...updated[index],
      [field]: value
    };

    setValues(updated);
  };

  // HANDLE REMOVE VALUE
  const handleRemoveValue = (index) => {
    setValues(values.filter((_, i) => i !== index));
  };

  // HANDLE SUBMIT
  const handleSubmit = async () => {
    try {
      await updateOption(option.id, {
        name,
        required,
        multiple_choice: multipleChoice,
        display_order: displayOrder,
        values,
      });

      onSuccess();
      onClose();

    } catch (err) {
      console.log("Failed submit option", err);
    }
  };

  // HANDLE CLOSE
  const handleCLose = () => {
    onClose();
    resetForm();
  };


if (!isOpen) return null;

return (
  <div className="fixed inset-0 bg-black/40 flex justify-center items-center">

    <div className="bg-white p-5 w-150 rounded">

      <h2>Edit Option</h2>

      <br />

      <input
        placeholder="Group Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="border"
      />

      <br />

      <label>

        <input
          type="checkbox"
          checked={required}
          onChange={(e) => setRequired(e.target.checked)}
        />

        Required

      </label>

      <br />

      <label>

        <input
          type="checkbox"
          checked={multipleChoice}
          onChange={(e) => setMultipleChoice(e.target.checked)}
        />

        Multiple Choice

      </label>

      <br />

      <input
        type="number"
        value={displayOrder}
        onChange={(e) => setDisplayOrder(Number(e.target.value))}
      />

      <hr />

      <h3>Values</h3>

      {values.map((value, index) => (
        <div key={index}>

          <input
            placeholder="Name"
            value={value.name}
            onChange={(e) =>
              handleChangeValue(index, "name", e.target.value)
            }
          />

          <input
            type="number"
            placeholder="Price"
            value={value.price_adjustment}
            onChange={(e) =>
              handleChangeValue(
                index,
                "price_adjustment",
                Number(e.target.value)
              )
            }
          />

          <button
            onClick={() => handleRemoveValue(index)}
          >
            Remove
          </button>

        </div>
      ))}

      <button onClick={handleAddValue}>
        Add Value
      </button>

      <br />
      <br />

      <button 
      onClick={handleSubmit}
      className="border"
      >
        Save Change
      </button>

      <button 
      onClick={handleCLose}
      className="border"
      >
        Cancel
      </button>

    </div>

  </div>
);
};

export default EditOptionModal;