import { $api } from "@/pages/api/api";

export const fetchNotification = async () => {
  const response = await $api.get("/cars/notification");
  return response.data;
};

export const patchNotification = async (id: string,) => {
  const response = await $api.patch(`/cars/notif/${id}`, {is_read: true});
  return response.data;
};
