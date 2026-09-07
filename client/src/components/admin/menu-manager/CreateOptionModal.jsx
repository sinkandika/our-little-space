import { useState } from "react";
import { createOption } from "../../../services/optionService";


function CreateOptionModal ({ isOpen, onClose, onSuccess }) {

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

  const [loadingCreate, setLoadingCreate] = useState(false)

  // RESET FORM
  const resetForm = () => {
    setName("");
    setRequired(false);
    setMultipleChoice(false);
    setDisplayOrder(1);
    setValues ([
      {
        name: "",
        price_adjustment: 0,
        display_order: 1,
      }
    ])
  };

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

    updated[index][field] = value;

    setValues(updated);
  };

  // HANDLE REMOVE VALUE
  const handleRemoveValue = (index) => {
    setValues(values.filter((_, i) => i !== index));
  };

  // HANDLE SUBMIT
  const handleSubmit = async () => {

    setLoadingCreate(true)

    try {
      await createOption ({
        name,
        required,
        multiple_choice: multipleChoice,
        display_order: displayOrder,
        values,
      });

      onSuccess();
      resetForm();
      onClose();

    } catch (err) {
      console.log("Failed submit option",err);
    } finally {
      setLoadingCreate(false)
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

      <h2>Create Option</h2>

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
      className="border disabled:opacity-50"
      disabled={loadingCreate}
      >
        {loadingCreate ?
        'Creating...' : 'Create'
        }
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

export default CreateOptionModal;