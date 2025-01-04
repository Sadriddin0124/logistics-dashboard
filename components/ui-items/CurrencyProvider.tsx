import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";

interface StringContextProps {
  value: string;
  setSelectedCurrency: (value: string) => void;
  ruble: string;
  setRuble: (value: string) => void;
  dollar: string;
  setDollar: (value: string) => void;
  tenge: string;
  setTenge: (value: string) => void;
  currencyStatus: boolean;
  setCurrencyStatus: (value: boolean) => void;
}

const StringContext = createContext<StringContextProps | undefined>(undefined);

export const StringProvider = ({ children }: { children: ReactNode }) => {
  const [value, setSelectedCurrency] = useState<string>("USD");
  const [ruble, setRuble] = useState<string>("");
  const [dollar, setDollar] = useState<string>("");
  const [tenge, setTenge] = useState<string>("");
  const [currencyStatus, setCurrencyStatus] = useState(false)
  useEffect(() => {
    const dollar = localStorage.getItem("dollar") || "";
    const ruble = localStorage.getItem("ruble") || "";
    const tenge = localStorage.getItem("tenge") || "";
    const currencyStatus = localStorage.getItem("currencyStatus") === "true";
    console.log(currencyStatus);
    
    setDollar(dollar);
    setTenge(tenge);
    setRuble(ruble);
    setCurrencyStatus(currencyStatus);
  }, []);
  useEffect(() => {
    console.log("currencyStatus changed:", currencyStatus);
  }, [currencyStatus]);
  
  return (
    <StringContext.Provider value={{ value, setSelectedCurrency, ruble, setRuble, dollar, setDollar, tenge, setTenge, currencyStatus, setCurrencyStatus }}>
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
