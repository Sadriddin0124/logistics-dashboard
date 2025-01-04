import { useStringContext } from "@/components/ui-items/CurrencyProvider";
import React, { useEffect } from "react";

const CurrencyWatcher = () => {
  const { ruble, dollar, tenge, currencyStatus } = useStringContext();

  useEffect(() => {
    console.log("Ruble updated:", ruble);
  }, [ruble]);

  useEffect(() => {
    console.log("Dollar updated:", dollar);
  }, [dollar]);

  useEffect(() => {
    console.log("Tenge updated:", tenge);
  }, [tenge]);

  useEffect(() => {
    console.log("Currency status changed:", currencyStatus);
  }, [currencyStatus]);

  return <div>Watching Currency Changes</div>;
};

export default CurrencyWatcher;
