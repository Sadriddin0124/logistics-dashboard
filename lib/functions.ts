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
  const dateMaker = new Date(value);
  const day = dateMaker.getDay();
  const date = dateMaker.getDate();
  const year = dateMaker.getFullYear();
  return `${date}${symbol}${day}${symbol}${year}`;
};


export const downloadExcelFile = async (link: string) => {
  try {
    // Make the request using axios
    const response = await $api.get(link, {
      responseType: "blob", // Set response type to blob to handle binary data
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      },
    });

    // Create a URL for the blob data
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const name = link?.split("/")[1]
    // Create a temporary link element and trigger download
    const a = document.createElement("a");
    a.href = url;
    a.download = `${name}.xlsx`; // Specify the file name you want to save
    document.body.appendChild(a);
    a.click();
    a.remove();

    // Clean up the URL object
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
  return fuel === "GAS" ? "Газ" : "Дизель"
}