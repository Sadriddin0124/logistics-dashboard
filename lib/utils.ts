import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const removeCommas = (value: string): string => value?.replace(/,/g, "");

export function splitToHundreds(num: number | undefined): string {
  if (!num) {
    return "";
  }
  // Convert the number to a string
  const numStr = num.toString();

  // Use regex to split the string into groups of three digits
  const splitNum = numStr.replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");

  return splitNum;
}

export const formatNumber = (
  value: number | string | null | undefined,
  opts: Intl.NumberFormatOptions = {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }
): string => {
  const n =
    typeof value === "number"
      ? value
      : value !== null && value !== undefined && String(value).trim() !== ""
      ? Number(value)
      : NaN;

  if (!Number.isFinite(n)) return "";
  return n.toLocaleString(undefined, opts);
};
