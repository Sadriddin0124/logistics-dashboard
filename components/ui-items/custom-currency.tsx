import React from "react";
import { Input } from "../ui/input";
import { useStringContext } from "./CurrencyProvider";

const CustomCurrency: React.FC<{status: boolean}> = ({status}) => {
  const {
    dollar,
    setDollar,
    ruble,
    setRuble,
    tenge,
    setTenge,
  } = useStringContext();

  const saveCurrency = (
    value: string,
    currency: "dollar" | "ruble" | "tenge"
  ) => {
    // Save the value to localStorage and update the context state
    localStorage.setItem(currency, value || "");
    if (currency === "dollar") {
      setDollar(value || "");
    } else if (currency === "ruble") {
      setRuble(value || "");
    } else if (currency === "tenge") {
      setTenge(value || "");
    }
  };

  return (
    <div className="flex flex-col gap-2">
      {/* USD Input */}
      <div className="flex items-center space-x-2 rounded-md border border-gray-300 w-full p-2">
        <span className="font-medium">USD</span>
        <Input
        disabled={status}
          className="font-medium"
          value={dollar || ""} // Ensure a fallback to avoid uncontrolled input
          type="number"
          onChange={(e) => saveCurrency(e.target.value, "dollar")}
        />
        <span>UZS</span>
      </div>

      {/* RUB Input */}
      <div className="flex items-center space-x-2 rounded-md border border-gray-300 w-full p-2">
        <span className="font-medium">RUB</span>
        <Input
        disabled={status}
          className="font-medium"
          value={ruble || ""} // Ensure a fallback to avoid uncontrolled input
          type="number"
          onChange={(e) => saveCurrency(e.target.value, "ruble")}
        />
        <span>UZS</span>
      </div>

      {/* KZT Input */}
      <div className="flex items-center space-x-2 rounded-md border border-gray-300 w-full p-2">
        <span className="font-medium">KZT</span>
        <Input
        disabled={status}
          className="font-medium"
          value={tenge || ""} // Ensure a fallback to avoid uncontrolled input
          type="number"
          onChange={(e) => saveCurrency(e.target.value, "tenge")}
        />
        <span>UZS</span>
      </div>
    </div>
  );
};

export default CustomCurrency;
