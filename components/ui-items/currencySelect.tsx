import React, { ChangeEvent, useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useQuery } from "@tanstack/react-query";
import { getExchangeRate } from "@/lib/actions/general";
import { ExchangeRate } from "@/lib/types/general.types";
import { useStringContext } from "./CurrencyProvider";

interface CurrencyInputWithSelectProps {
  name: string;
  required?: boolean;
  disabled?: boolean;
  type?: string;
}

// Utility functions
const formatNumberWithCommas = (value: string | number): string => {
  if (value === 0 || value === "0") return "0"; // Explicitly handle zero
  if (!value) return "";

  const [integerPart, decimalPart] = value.toString().split(".");
  const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return decimalPart !== undefined
    ? `${formattedInteger}.${decimalPart}`
    : formattedInteger;
};

const parseAndValidateNumber = (value: string | number): number | null => {
  const sanitizedValue =
    typeof value === "string" ? parseFloat(value.replace(/,/g, "")) : value;

  // Allow any valid number (positive or negative)
  return !isNaN(sanitizedValue) ? sanitizedValue : null;
};

const CurrencyInputWithSelect: React.FC<CurrencyInputWithSelectProps> = ({
  name,
  required,
  disabled,
  type,
}) => {
  const { data: exchangeRates } = useQuery<ExchangeRate[]>({
    queryKey: ["exchangeRates"],
    queryFn: getExchangeRate,
  });
  const { dollar, ruble, tenge, currencyStatus } = useStringContext();
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext();
  const [selectedCurrency, setSelectedCurrency] = useState(type || "USD");

  const inputValue = watch(name);

  // Precomputed exchange rates
  const exchangeRatesMap = exchangeRates?.reduce<Record<string, number>>(
    (acc, rate) => {
      acc[rate.Ccy] = parseFloat(rate.Rate);
      return acc;
    },
    {}
  );

  // Separate useEffect for initializing selectedCurrency
  useEffect(() => {
    if (type) {
      setSelectedCurrency(type); // Set default value only when type changes
    }
  }, [type]); // Runs only when `type` changes

  // Main useEffect for calculations
  useEffect(() => {
    if (!exchangeRatesMap || !inputValue) return;

    const parsedInput = parseAndValidateNumber(inputValue);
    if (parsedInput !== null) {
      const usdRate = currencyStatus
        ? Number(dollar)
        : exchangeRatesMap["USD"] ?? 1;
      const rubRate = currencyStatus
        ? Number(ruble)
        : exchangeRatesMap["RUB"] ?? 1;
      const kztRate = currencyStatus
        ? Number(tenge)
        : exchangeRatesMap["KZT"] ?? 1;

      const convertedValue =
        selectedCurrency === "USD"
          ? parsedInput
          : selectedCurrency === "RUB"
          ? parsedInput * (rubRate / usdRate)
          : selectedCurrency === "KZT"
          ? parsedInput * (kztRate / usdRate)
          : parsedInput / usdRate;

      if (watch(`${name}_uzs`) !== convertedValue) {
        setValue(`${name}_uzs`, convertedValue, { shouldValidate: true });
      }

      if (watch(`${name}_type`) !== selectedCurrency) {
        setValue(`${name}_type`, selectedCurrency, { shouldValidate: true });
      }
    }
  }, [
    inputValue,
    selectedCurrency,
    exchangeRatesMap,
    setValue,
    name,
    currencyStatus,
    dollar,
    ruble,
    tenge,
    watch,
  ]);

  return (
    <div className="flex gap-2 items-start">
      <div className="flex flex-col gap-2 w-full relative">
        <Label htmlFor={name} className="absolute right-3 top-3">
          ({selectedCurrency})
        </Label>
        <Input
          id={name}
          disabled={disabled}
          {...register(name, {
            validate: (value) =>
              required ||
              parseAndValidateNumber(value) !== null ||
              "Поле не должно быть пустым",
          })}
          type="text"
          onInput={(e: ChangeEvent<HTMLInputElement>) => {
            const rawValue = e.target.value;

            // Allow negative sign only at the start and only one decimal point
            const sanitizedValue = rawValue
              .replace(/[^0-9.-]/g, "") // Allow numbers, decimal point, and negative sign
              .replace(/(?!^)-/g, "") // Allow only one minus sign, and only at the start
              .replace(/(\..*)\./g, "$1"); // Allow only one decimal point

            // Update the input value dynamically
            e.target.value = sanitizedValue;

            // Update the value in the form context
            setValue(name, sanitizedValue, { shouldValidate: true });
          }}
          onBlur={(e: ChangeEvent<HTMLInputElement>) => {
            const rawValue = e.target.value;
            const parsedValue = parseAndValidateNumber(rawValue);

            if (parsedValue !== null) {
              const formattedValue = formatNumberWithCommas(parsedValue);
              e.target.value = formattedValue;
              setValue(name, formattedValue, { shouldValidate: true });
            } else {
              // Reset only if the input is empty or invalid (not a valid number)
              e.target.value = rawValue === "" ? "0" : rawValue;
              setValue(name, rawValue === "" ? "0" : rawValue, {
                shouldValidate: true,
              });
            }
          }}
        />

        {errors[name] && (
          <p className="text-red-500 text-sm">
            {errors[name]?.message as string}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <select
          disabled={disabled}
          id="currency-select"
          className="border rounded-md p-2"
          value={selectedCurrency}
          onChange={(e) => setSelectedCurrency(e.target.value)}
        >
          <option value="USD">Доллар</option>
          <option value="RUB">Рубль</option>
          <option value="KZT">Тенге</option>
          <option value="UZS">Сум</option>
        </select>
      </div>
    </div>
  );
};

export default CurrencyInputWithSelect;
