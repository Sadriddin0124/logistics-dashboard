import axios from "axios";

export const getExchangeRate = async () => {
    const response = await axios.get("https://cbu.uz/oz/arkhiv-kursov-valyut/json/");
    return response.data;
  };