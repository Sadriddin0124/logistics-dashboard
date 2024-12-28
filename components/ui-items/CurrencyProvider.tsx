import React, { createContext, useContext, useState, ReactNode } from "react";

interface StringContextProps {
  value: string;
  setSelectedCurrency: (value: string) => void;
}

const StringContext = createContext<StringContextProps | undefined>(undefined);

export const StringProvider = ({ children }: { children: ReactNode }) => {
  const [value, setSelectedCurrency] = useState<string>("USD");

  return (
    <StringContext.Provider value={{ value, setSelectedCurrency }}>
      {children}
    </StringContext.Provider>
  );
};

export const useStringContext = () => {
  const context = useContext(StringContext);
  if (!context) {
    throw new Error("useStringContext must be used within a StringProvider");
  }
  return context;
};
