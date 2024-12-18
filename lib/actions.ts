import { $api } from "@/pages/api/api";

export const uploadImage = async (image: FormData) => {
  const response = await $api.post("/file/upload", image, {
    headers: {
      "Content-Type": "application/form-data",
    },
  });
  return response.data;
};
