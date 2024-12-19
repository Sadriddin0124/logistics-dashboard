// import React, { useState } from 'react';
// import Select, { MultiValue, StylesConfig } from 'react-select';

// // Define Option type for React-Select
// type Option = { label: string; value: string };

// interface MultiSelectorProps {
//   placeholder?: string;
// }

// const MultiSelector: React.FC<MultiSelectorProps> = ({ placeholder = 'Select or add options...' }) => {
//   const [optionsList, setOptionsList] = useState<Option[]>([
//     { value: 'option1', label: 'Option 1' },
//     { value: 'option2', label: 'Option 2' },
//     { value: 'option3', label: 'Option 3' },
//   ]);

//   const [selectedItems, setSelectedItems] = useState<Option[]>([]);
//   const [inputValue, setInputValue] = useState<string>('');

//   const handleChange = (newValues: MultiValue<Option>) => {
//     setSelectedItems(newValues as Option[]);
//   };

//   const handleKeyDown = (event: React.KeyboardEvent) => {
//     if (event.key === 'Enter' && inputValue.trim()) {
//       event.preventDefault();
//       const newOption: Option = { label: inputValue, value: inputValue.toLowerCase().replace(/\s+/g, '-') };

//       if (!optionsList.find((option) => option.value === newOption.value)) {
//         setOptionsList((prev) => [...prev, newOption]);
//       }

//       setSelectedItems((prev) => [...prev, newOption]);
//       setInputValue(''); // Clear input field
//     }
//   };

//   // Handle removing an item from the selected items and options list
//   const handleRemove = (removedValue: Option) => {
//     setSelectedItems((prev) => prev.filter(item => item.value !== removedValue.value));
//     setOptionsList((prev) => prev.filter(option => option.value !== removedValue.value));
//   };

//   // Custom styles for React-Select
//   const customStyles: StylesConfig<Option, true> = {
//     control: (provided) => ({
//       ...provided,
//       borderRadius: '8px',
//       borderColor: '#ccc',
//       boxShadow: 'none',
//       '&:hover': { borderColor: '#888' },
//     }),
//     multiValue: (provided) => ({
//       ...provided,
//       backgroundColor: '#e0f7fa',
//     }),
//     multiValueLabel: (provided) => ({
//       ...provided,
//       color: '#00796b',
//     }),
//     multiValueRemove: (provided) => ({
//       ...provided,
//       color: '#00796b',
//       ':hover': { backgroundColor: '#00796b', color: 'white' },
//     }),
//   };

//   return (
//     <div style={{ width: '400px', fontFamily: 'Arial, sans-serif' }}>
//       <Select
//         isMulti
//         options={optionsList.filter(option => !selectedItems.some(item => item.value === option.value))} // Remove selected items from available options
//         value={selectedItems}
//         onChange={handleChange}
//         onInputChange={(value) => setInputValue(value)}
//         onKeyDown={handleKeyDown}
//         placeholder={placeholder}
//         styles={customStyles}
//         inputValue={inputValue} // Bind inputValue state
//         noOptionsMessage={() => 'Type to add new option...'}
//         isClearable // Allow clearing selections
//         getOptionLabel={(e) => e.label} // Customize how options are displayed in the dropdown
//       />
//       <div style={{ marginTop: '10px' }}>
//         {selectedItems.map(item => (
//           <span
//             key={item.value}
//             style={{
//               display: 'inline-block',
//               marginRight: '10px',
//               padding: '5px 10px',
//               backgroundColor: '#e0f7fa',
//               borderRadius: '15px',
//               color: '#00796b',
//             }}
//           >
//             {item.label}
//             <button
//               onClick={() => handleRemove(item)}
//               style={{
//                 background: 'none',
//                 border: 'none',
//                 color: '#00796b',
//                 marginLeft: '5px',
//                 cursor: 'pointer',
//                 fontSize: '14px',
//               }}
//             >
//               &times;
//             </button>
//           </span>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default MultiSelector;


import React, { useState } from 'react';
import Select, { MultiValue, StylesConfig } from 'react-select';

// Define Option type for React-Select
type Option = { label: string; value: string };

interface MultiSelectorProps {
  placeholder?: string;
  initialOptions?: Option[]; // Accept initial options as a prop
  onChange?: (selectedItems: Option[]) => void; // Allow parent to handle onChange
  customStyles?: StylesConfig<Option, true>; // Allow custom styles
  isClearable?: boolean; // Allow clearing selections
}

const MultiSelector: React.FC<MultiSelectorProps> = ({
  placeholder = 'Select or add options...',
  initialOptions = [],
  onChange,
  customStyles = {},
  isClearable = true,
}) => {
  const [optionsList, setOptionsList] = useState<Option[]>(initialOptions);
  const [selectedItems, setSelectedItems] = useState<Option[]>([]);
  const [inputValue, setInputValue] = useState<string>('');

  const handleChange = (newValues: MultiValue<Option>) => {
    setSelectedItems(newValues as Option[]);
    onChange?.(newValues as Option[]); // Notify parent of the change
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && inputValue.trim()) {
      event.preventDefault();
      const newOption: Option = { label: inputValue, value: inputValue.toLowerCase().replace(/\s+/g, '-') };

      if (!optionsList.find((option) => option.value === newOption.value)) {
        setOptionsList((prev) => [...prev, newOption]);
      }
      setSelectedItems((prev) => [...prev, newOption]);
      setInputValue(''); // Clear input field
    }
  };

  // Handle removing an item from the selected items and options list
  const handleRemove = (removedValue: Option) => {
    setSelectedItems((prev) => prev.filter(item => item.value !== removedValue.value));
    setOptionsList((prev) => prev.filter(option => option.value !== removedValue.value));
  };

  // Default custom styles
  const defaultStyles: StylesConfig<Option, true> = {
    control: (provided) => ({
      ...provided,
      borderRadius: '8px',
      borderColor: '#ccc',
      boxShadow: 'none',
      '&:hover': { borderColor: '#888' },
    }),
    multiValue: (provided) => ({
      ...provided,
      backgroundColor: '#e0f7fa',
    }),
    multiValueLabel: (provided) => ({
      ...provided,
      color: '#00796b',
    }),
    multiValueRemove: (provided) => ({
      ...provided,
      color: '#00796b',
      ':hover': { backgroundColor: '#00796b', color: 'white' },
    }),
    ...customStyles, // Merge custom styles passed as prop
  };

  return (
    <div style={{ width: '400px', fontFamily: 'Arial, sans-serif' }}>
      <Select
        isMulti
        options={optionsList.filter(option => !selectedItems.some(item => item.value === option.value))} // Remove selected items from available options
        value={selectedItems}
        onChange={handleChange}
        onInputChange={(value) => setInputValue(value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        styles={defaultStyles}
        inputValue={inputValue} // Bind inputValue state
        noOptionsMessage={() => 'Type to add new option...'}
        isClearable={isClearable} // Allow clearing selections
        getOptionLabel={(e) => e.label} // Customize how options are displayed in the dropdown
      />
      <div style={{ marginTop: '10px' }}>
        {selectedItems.map(item => (
          <span
            key={item.value}
            style={{
              display: 'inline-block',
              marginRight: '10px',
              padding: '5px 10px',
              backgroundColor: '#e0f7fa',
              borderRadius: '15px',
              color: '#00796b',
            }}
          >
            {item.label}
            <button
              onClick={() => handleRemove(item)}
              style={{
                background: 'none',
                border: 'none',
                color: '#00796b',
                marginLeft: '5px',
                cursor: 'pointer',
                fontSize: '14px',
              }}
            >
              &times;
            </button>
          </span>
        ))}
      </div>
    </div>
  );
};

export default MultiSelector;
