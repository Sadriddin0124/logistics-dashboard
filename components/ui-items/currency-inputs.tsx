"use client";

import React, { useEffect, useRef } from "react";
import { useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useQuery } from "@tanstack/react-query";
import { getExchangeRate } from "@/lib/actions/general";
import { ExchangeRate } from "@/lib/types/general.types";

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
  console.log(typeof EXCHANGE_RATE);

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
        const uzsAmount = parseFloat(value[uzsName] || "0");
        setValue(usdName, (uzsAmount / Number(EXCHANGE_RATE)).toFixed(2), {
          shouldValidate: true,
        });
      } else if (changedField === usdName) {
        const usdAmount = parseFloat(value[usdName] || "0");
        setValue(uzsName, (usdAmount * Number(EXCHANGE_RATE)).toFixed(2), {
          shouldValidate: true,
        });
      }

      isUpdating.current = false;
    });
    return () => subscription.unsubscribe();
  }, [watch, setValue, uzsName, usdName, EXCHANGE_RATE]);

  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="flex items-center relative">
      <Label htmlFor={uzsName} className="absolute right-3">Сум</Label>
        <Input
          id={uzsName}
          {...register(uzsName, {
            valueAsNumber: true,
            validate: (value) => value >= 0 || "Miqdor musbat bo'lishi kerak",
          })}
          type="number"
          step="0.01"
          min="0"
          placeholder="Narxni so'mda kiriting"
        />
        {errors[uzsName] && (
          <p className="text-red-500 text-sm">
            {errors[uzsName]?.message as string}
          </p>
        )}
      </div>
      <div className="flex items-center relative">
        <Label htmlFor={usdName} className="absolute right-3">Доллар</Label>
        <Input
          id={usdName}
          {...register(usdName, {
            valueAsNumber: true,
            validate: (value) => value >= 0 || "Miqdor musbat bo'lishi kerak",
          })}
          type="number"
          step="0.01"
          min="0"
          placeholder="Narxni dollarda kiriting"
        />
        {errors[usdName] && (
          <p className="text-red-500 text-sm">
            {errors[usdName]?.message as string}
          </p>
        )}
      </div>
    </div>
  );
};
