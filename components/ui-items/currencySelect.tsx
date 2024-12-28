import React, { ChangeEvent, useEffect } from "react";
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
}

// Utility functions
const formatNumberWithCommas = (value: number | string): string =>
  !value || isNaN(Number(value)) ? "" : Number(value).toLocaleString("en-US");

const parseAndValidateNumber = (value: string | number): number | null => {
  const sanitizedValue =
    typeof value === "string" ? parseFloat(value.replace(/,/g, "")) : value;
  return !isNaN(sanitizedValue) && sanitizedValue >= 0 ? sanitizedValue : null;
};

const CurrencyInputWithSelect: React.FC<CurrencyInputWithSelectProps> = ({
  name,
  required,
  disabled,
}) => {
  const { data: exchangeRates } = useQuery<ExchangeRate[]>({
    queryKey: ["exchangeRates"],
    queryFn: getExchangeRate,
  });
  const {value, setSelectedCurrency} = useStringContext()
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext();

  const inputValue = watch(name);

  // Precomputed exchange rates
  const exchangeRatesMap = exchangeRates?.reduce<Record<string, number>>(
    (acc, rate) => {
      acc[rate.Ccy] = parseFloat(rate.Rate);
      return acc;
    },
    {}
  );

  useEffect(() => {
    if (exchangeRatesMap && inputValue) {
      const parsedInput = parseAndValidateNumber(inputValue);
      if (parsedInput !== null) {
        const usdRate = exchangeRatesMap["USD"];
        const rubRate = exchangeRatesMap["RUB"];
        const kztRate = exchangeRatesMap["KZT"];

        const convertedValue =
          value === "USD"
            ? parsedInput
            : value === "RUB"
            ? parsedInput * (rubRate / usdRate)
            : parsedInput * (kztRate / usdRate);

        setValue(`${name}_uzs`, convertedValue);
        setValue(`${name}_type`, value);
        
      }
    }
  }, [inputValue, value, exchangeRatesMap, setValue, name]);

  return (
    <div className="flex gap-2 items-start">
      <div className="flex flex-col gap-2 w-full relative">
        <Label htmlFor={name} className="absolute right-3 top-3">
          ({value})
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
            const rawValue = e.target.value.replace(/,/g, "");
            const parsedValue = parseFloat(rawValue);
            e.target.value = rawValue === "0" ? "0" : formatNumberWithCommas(parsedValue);
            setValue(name, formatNumberWithCommas(parsedValue), { shouldValidate: true });
          }}
        />
        {errors[name] && (
          <p className="text-red-500 text-sm">{errors[name]?.message as string}</p>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <select
          id="currency-select"
          className="border rounded-md p-2"
          value={value}
          onChange={(e) => setSelectedCurrency(e.target.value)}
        >
          <option value="USD">Доллар</option>
          <option value="RUB">Рубль</option>
          <option value="KZT">Тенге</option>
        </select>
      </div>
    </div>
  );
};

export default CurrencyInputWithSelect;
