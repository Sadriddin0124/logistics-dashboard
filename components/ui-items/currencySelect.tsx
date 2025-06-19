"use client";

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

// Utility: Format number with commas
const formatNumberWithCommas = (value: string | number): string => {
  if (value === 0 || value === "0") return "0";
  if (!value) return "";
  const [integerPart, decimalPart] = value.toString().split(".");
  const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return decimalPart !== undefined
    ? `${formattedInteger}.${decimalPart}`
    : formattedInteger;
};

// Utility: Convert string to number
const parseAndValidateNumber = (value: string | number): number | null => {
  const sanitizedValue =
    typeof value === "string" ? parseFloat(value.replace(/,/g, "")) : value;
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

  const [selectedCurrency, setSelectedCurrency] = useState<string>(type || "USD");

  const inputValue = watch(name);
  const uzsValue = watch(`${name}_uzs`);
  const typeValue = watch(`${name}_type`);

  // Precompute exchange rate map
  const exchangeRatesMap = exchangeRates?.reduce<Record<string, number>>((acc, rate) => {
    acc[rate.Ccy] = parseFloat(rate.Rate);
    return acc;
  }, {});

useEffect(() => {
  if (!exchangeRatesMap || inputValue == null) return;

  const parsedInput = parseAndValidateNumber(inputValue);
  if (parsedInput !== null) {
    const usdRate = currencyStatus ? Number(dollar) : exchangeRatesMap["USD"] ?? 1;
    const rubRate = currencyStatus ? Number(ruble) : exchangeRatesMap["RUB"] ?? 1;
    const kztRate = currencyStatus ? Number(tenge) : exchangeRatesMap["KZT"] ?? 1;

    if (!usdRate || !rubRate || !kztRate) return;

    let convertedValue = parsedInput;

    if (selectedCurrency === "USD") {
      convertedValue = parsedInput * usdRate;
    } else if (selectedCurrency === "RUB") {
      convertedValue = parsedInput * rubRate;
    } else if (selectedCurrency === "KZT") {
      convertedValue = parsedInput * kztRate;
    } // UZS stays as-is

    if (uzsValue !== convertedValue) {
      setValue(`${name}_uzs`, convertedValue, { shouldValidate: true });
    }

    if (typeValue !== selectedCurrency) {
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
  uzsValue,
  typeValue,
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
            validate: (value) => {
              if (required && !value) return "Обязательное поле";
              return parseAndValidateNumber(value) !== null
                ? true
                : "Неверное значение";
            },
          })}
          type="text"
          onInput={(e: ChangeEvent<HTMLInputElement>) => {
            const raw = e.target.value;

            const sanitized = raw
              .replace(/[^0-9.-]/g, "")
              .replace(/(?!^)-/g, "")
              .replace(/(\..*)\./g, "$1");

            e.target.value = sanitized;
            setValue(name, sanitized, { shouldValidate: true });
          }}
          onBlur={(e: ChangeEvent<HTMLInputElement>) => {
            const rawValue = e.target.value;
            const parsed = parseAndValidateNumber(rawValue);

            if (parsed !== null) {
              const formatted = formatNumberWithCommas(parsed);
              e.target.value = formatted;
              setValue(name, formatted, { shouldValidate: true });
            } else {
              const fallback = rawValue === "" ? "0" : rawValue;
              e.target.value = fallback;
              setValue(name, fallback, { shouldValidate: true });
            }
          }}
        />

        {errors[name] && (
          <p className="text-red-500 text-sm">{errors[name]?.message as string}</p>
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
