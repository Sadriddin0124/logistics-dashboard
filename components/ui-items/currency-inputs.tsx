import React, { useEffect, useRef } from "react";
import { useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useQuery } from "@tanstack/react-query";
import { ExchangeRate } from "@/lib/types/general.types";
import { getExchangeRate } from "@/lib/actions/general";

// Utility function to format numbers with commas
export const formatNumberWithCommas = (value: number | string): string => {
  if (!value || isNaN(Number(value))) return "";
  return Number(value).toLocaleString("en-US");
};

// Utility function to parse and validate numbers
const parseAndValidateNumber = (value: string | number): number | null => {
  const sanitizedValue =
    typeof value === "string" ? parseFloat(value.replace(/,/g, "")) : value;
  return !isNaN(sanitizedValue) && sanitizedValue >= 0 ? sanitizedValue : null;
};

interface CurrencyInputsProps {
  name: string;
  required?: boolean;
  disabled?: boolean;
}

export const CurrencyInputs: React.FC<CurrencyInputsProps> = ({ name, required, disabled }) => {
  const { data: exchange } = useQuery<ExchangeRate[]>({
    queryKey: ["exchange"],
    queryFn: getExchangeRate,
  });

  const EXCHANGE_RATE =
    exchange?.find((item) => item?.Ccy === "USD")?.Rate ?? null;

  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext();

  const isUpdating = useRef(false);

  // Create dynamic key with _uzs
  const uzsName = `${name}_uzs`;
  const uzsValue = watch(uzsName); // Watch only the specific field

  useEffect(() => {
    if (!EXCHANGE_RATE) return;

    const uzsAmount = parseAndValidateNumber(uzsValue);
    if (uzsAmount !== null && !isUpdating.current) {
      isUpdating.current = true;

      setValue(uzsName, formatNumberWithCommas(uzsAmount), {
        shouldValidate: true,
      });

      isUpdating.current = false;
    }
  }, [uzsValue, EXCHANGE_RATE, uzsName, setValue]);

  return (
    <div className="grid grid-cols-1 gap-4">
      <div className="flex items-center flex-col justify-center gap-2 relative">
        <Label htmlFor={uzsName} className="absolute right-3 top-[10px]">
          Сум
        </Label>
        <Input
          disabled={disabled}
          id={uzsName}
          {...register(uzsName, {
            validate: (value) =>
              required || parseAndValidateNumber(value) !== null || "Сумма должна быть положительной",
          })}
          type="text"
          onInput={(e) => {
            const rawValue = e.currentTarget.value.replace(/,/g, "");
            if (rawValue === "0") {
              // Allow "0" to be typed directly
              e.currentTarget.value = "0";
            } else {
              const parsedValue = parseFloat(rawValue);
              e.currentTarget.value = formatNumberWithCommas(parsedValue);
            }
            // Update the raw value in the form context with the _uzs key
            setValue(uzsName, e.currentTarget.value, {
              shouldValidate: true,
            });
          }}
        />
        {errors[uzsName] && (
          <p className="text-red-500 text-sm self-start absolute bottom-[-25px]">
            {errors[uzsName]?.message as string}
          </p>
        )}
      </div>
    </div>
  );
};
