import { $api } from "@/pages/api/api";

export const uploadImage = async (image: FormData) => {
  const response = await $api.post("/upload/upload/", image, {
    headers: {
      "Content-Type": "application/form-data",
    },
  });
  return response.data;
};
