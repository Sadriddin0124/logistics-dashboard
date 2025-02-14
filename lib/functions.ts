import { $api } from "@/pages/api/api";
// import { formatDistanceToNow } from 'date-fns';

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
  return phoneNumber.replace(/\s+/g, ""); // Remove all spaces
};

export const formatNumberAsPrice = (value: string) => {
  return value.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

export const formatDate = (value: string, symbol: string) => {
  if (!value) return "";

  const dateMaker = new Date(value);

  const day = dateMaker.getDate(); // Day of the month
  const month = dateMaker.getMonth() + 1; // Month (0-based, so add 1)
  const year = dateMaker.getFullYear(); // Full year

  // Format with leading zero for day and month if needed
  const formattedDay = day < 10 ? `0${day}` : day;
  const formattedMonth = month < 10 ? `0${month}` : month;

  return `${formattedDay}${symbol}${formattedMonth}${symbol}${year}`;
};



export const downloadExcelFile = async (link: string, name: string) => {
  try {
    const response = await $api.get(link, {
      responseType: "blob", // Set response type to blob to handle binary data
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      },
    });
    const url = window.URL.createObjectURL(new Blob([response.data]));
    // Create a temporary link element and trigger download
    const a = document.createElement("a");
    a.href = url;
    a.download = `${name}.xlsx`; // Specify the file name you want to save
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
  } catch (err) {
    console.error("Error downloading the file:", err);
  }
};

export const downloadImage = async (link: string, name: string) => {
  try {
    const response = await $api.get(link, {
      responseType: "blob", // Set response type to blob to handle binary data
      headers: {
        "Content-Type": "Multipart/Formdata",
      },
    });
    const url = window.URL.createObjectURL(new Blob([response.data]));
    // Create a temporary link element and trigger download
    const a = document.createElement("a");
    a.href = url;
    a.download = `${name}.jpg`; // Specify the file name you want to save
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
  } catch (err) {
    console.error("Error downloading the file:", err);
  }
};



// export const TimeAgo = ({ timestamp }: { timestamp: Date }) => {
//   const timeAgo = formatDistanceToNow(new Date(timestamp), { addSuffix: true });
//   return timeAgo
// };

export const fuelChange = (fuel: string) => {
  return fuel === "GAS" ? "Газ" : "Солярка"
}

export const currencyChange = (value: string) => {
  switch (value) {
    case "UZS":
      return "Сум";
    case "USD":
      return "$";
    case "KZT":
      return "Тенге";
    case "RUB":
      return "Рубль";
    default:
  }
};