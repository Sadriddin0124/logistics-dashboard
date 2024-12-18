import React, { useState } from 'react';
import MultiSelector from '@/components/MultipleSelector'; // Adjust the import path as needed

// type Option = { label: string; value: string };

const SomePage: React.FC = () => {
  const [selectedOptions, setSelectedOptions] = useState<{ label: string; value: string }[]>([]);
  const [selectedOptions2, setSelectedOptions2] = useState<{ label: string; value: string }[]>([]);
  const [optionsList, setOptionsList] = useState<{ label: string; value: string }[]>([
    { label: 'Option 1', value: 'option-1' },
    { label: 'Option 2', value: 'option-2' },
  ]);
//   const [inputValue, setInputValue] = useState<string>('');

  const handleSelectionChange = (selectedItems: { label: string; value: string }[]) => {
    setSelectedOptions(selectedItems);
    console.log(selectedItems);
    setOptionsList(prev=> [...prev, ...selectedItems ])
    
  };
  const handleSelectionChange2 = (selectedItems: { label: string; value: string }[]) => {
    setSelectedOptions2(selectedItems);
  };

  return (
    <div>
        <div>
      <h1>Choose your options</h1>
      <MultiSelector
        placeholder="Select some items"
        initialOptions={optionsList}
        onChange={handleSelectionChange}
        customStyles={{
          control: (provided) => ({
            ...provided,
            backgroundColor: '#f0f0f0',
          }),
        }}
        isClearable={false}
      />

      <div>
        <h3>Selected Options:</h3>
        <ul>
          {selectedOptions.map(option => (
            <li key={option.value}>{option.label}</li>
          ))}
        </ul>
      </div>
    </div>
    <div>
      <h1>Choose your options</h1>
      <MultiSelector
        placeholder="Select some items"
        initialOptions={[
          { label: 'Option 1', value: 'option-1' },
          { label: 'Option 2', value: 'option-2' },
        ]}
        onChange={handleSelectionChange2}
        customStyles={{
          control: (provided) => ({
            ...provided,
            backgroundColor: '#f0f0f0',
          }),
        }}
        isClearable={false}
      />

      <div>
        <h3>Selected Options:</h3>
        <ul>
          {selectedOptions2.map(option => (
            <li key={option.value}>{option.label}</li>
          ))}
        </ul>
      </div>
    </div>
    </div>
  );
};

export default SomePage;
