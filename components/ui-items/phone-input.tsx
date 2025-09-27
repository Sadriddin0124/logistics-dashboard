import React, { ReactNode, useEffect, useState } from "react";
import {
  formatPhoneNumber,
  formatUzbekistanPhoneNumber,
} from "@/lib/functions";
import { Input } from "../ui/input";

const PhoneInput = ({
  value, // Default to empty string to avoid undefined issues
  onChange,
  placeholder,
  disabled,
  styles,
  icon,
}: {
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  styles?: { paddingLeft: string };
  icon?: ReactNode;
}) => {
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    const formattedValue = formatUzbekistanPhoneNumber(value || "");
    if (formattedValue !== inputValue) {
      setInputValue(formattedValue);
    }
  }, [value, inputValue]);


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value || ""; // Ensure it's never undefined
    const formattedValue = formatUzbekistanPhoneNumber(rawValue);
    setInputValue(formattedValue);
    onChange(formatPhoneNumber(formattedValue)); // Send unformatted number
  };

  return (
    <div className="relative">
      <span className="absolute left-3 top-4 text-gray-500">
        {icon}
      </span>
      <Input
        id="phone"
        type="tel"
        disabled={disabled}
        value={inputValue}
        className={`${
          icon ? "px-10" : "px-4"
        }`}
        //  w-full py-3 h-[48px] border text-[#888888] border-gray-300 focus:border-[#2B2A29] rounded-lg focus:ring focus:ring-[#2B2A29] outline-none`}
        onChange={handleChange}
        placeholder={placeholder}
        aria-describedby="phone-hint"
        style={{ ...styles }}
        required={true}
      />
    </div>
  );
};

export default PhoneInput;
