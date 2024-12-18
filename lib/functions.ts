export const formatUzbekistanPhoneNumber = (input: string): string => {
  const prefix = "+998";
  const digits = input.replace(/\D/g, "").slice(prefix.length - 1);
  let formatted = prefix;

  if (digits.length > 0) formatted += " " + digits.slice(0, 2);
  if (digits.length > 2) formatted += " " + digits.slice(2, 5);
  if (digits.length > 5) formatted += " " + digits.slice(5, 7);
  if (digits.length > 7) formatted += " " + digits.slice(7, 9);

  return formatted.trim();
};

export const formatPhoneNumber = (phoneNumber: string) => {
  return phoneNumber.replace(/\s+/g, ''); // Remove all spaces
};

export const formatNumberAsPrice = (value: string) => {
  return value.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};