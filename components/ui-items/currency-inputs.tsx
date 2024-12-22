"use client";

import React, { useEffect, useRef } from "react";
import { useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useQuery } from "@tanstack/react-query";
import { ExchangeRate } from "@/lib/types/general.types";
import { getExchangeRate } from "@/lib/actions/general";

// Function to format numbers with commas
export function splitToHundreds(num: number | undefined): string {
  if (!num) return "";
  const numStr = num.toString();
  return numStr.replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
}

interface CurrencyInputsProps {
  name: string;
}

export const CurrencyInputs: React.FC<CurrencyInputsProps> = ({ name }) => {
  const { data: exchange } = useQuery<ExchangeRate[]>({
    queryKey: ["exchange"],
    queryFn: getExchangeRate,
  });

  // Ensure EXCHANGE_RATE is a number, use a fallback value if undefined
  const EXCHANGE_RATE =
    exchange?.find((item) => item?.Ccy === "USD")?.Rate ?? 0; // fallback to 0 if undefined
  const exchangeRateNumber = Number(EXCHANGE_RATE);  // Ensure it's a number

  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext();

  const isUpdating = useRef(false);

  const uzsName = `${name}_uzs`;
  const usdName = `${name}_usd`;

  useEffect(() => {
    const subscription = watch((value, { name: changedField }) => {
      if (isUpdating.current) return;

      isUpdating.current = true;

      if (changedField === uzsName) {
        const uzsAmount = parseFloat(value[uzsName]?.replace(/,/g, "") || "0");
        const usdValue = (uzsAmount / exchangeRateNumber).toFixed(2)
        console.log(usdValue);
        
        setValue(
          usdName,
          splitToHundreds(Number(usdValue)),
          { shouldValidate: true }
        );
      } else if (changedField === usdName) {
        const usdAmount = parseFloat(value[usdName]?.replace(/,/g, "") || "0");
        const uzsValue = (usdAmount * exchangeRateNumber).toFixed(2)
        setValue(
          uzsName,
          splitToHundreds(Number(uzsValue)),
          { shouldValidate: true }
        );
      }

      isUpdating.current = false;
    });
    return () => subscription.unsubscribe();
  }, [watch, setValue, uzsName, usdName, exchangeRateNumber]);

  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="flex items-center flex-col justify-center gap-2 relative">
        <Label htmlFor={uzsName} className="absolute right-3 top-[10px]">Сум</Label>
        <Input
          id={uzsName}
          {...register(uzsName, {
            validate: (value) =>
              parseFloat(value.replace(/,/g, "")) >= 0 || "Сумма должна быть положительной",
          })}
          type="text" // Changed to text to allow formatted numbers
          onInput={(e) => {
            const rawValue = e.currentTarget.value.replace(/,/g, "");
            const parsedValue = parseFloat(rawValue); // Convert to number
            e.currentTarget.value = splitToHundreds(parsedValue);
          }}
        />
        {errors[uzsName] && (
          <p className="text-red-500 text-sm absolute bottom-[-25px]">
            {errors[uzsName]?.message as string}
          </p>
        )}
      </div>
      <div className="flex items-center flex-col justify-center gap-2 relative">
        <Label htmlFor={usdName} className="absolute right-3 top-[10px]">Доллар</Label>
        <Input
          id={usdName}
          {...register(usdName, {
            validate: (value) =>
              parseFloat(value.replace(/,/g, "")) >= 0 || "Сумма должна быть положительной",
          })}
          type="text" // Changed to text to allow formatted numbers
          onInput={(e) => {
            const rawValue = e.currentTarget.value.replace(/,/g, "");
            const parsedValue = parseFloat(rawValue); // Convert to number
            e.currentTarget.value = splitToHundreds(parsedValue);
          }}
        />
        {errors[usdName] && (
          <p className="text-red-500 text-sm absolute bottom-[-25px]">
            {errors[usdName]?.message as string}
          </p>
        )}
      </div>
    </div>
  );
};
