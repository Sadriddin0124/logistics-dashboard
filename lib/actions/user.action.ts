import { $api } from "@/pages/api/api";
import { IUser } from "../types/user.types";

export const fetchUser = async (page: number) => {
  const response = await $api.get(`/auth/user-list?page=${page}`);
  return response.data;
};

export const createUser = async (data: IUser) => {
  const response = await $api.post(`/auth/create`, data);
  return response.data;
};

export const updateUser = async (data: IUser) => {
  const response = await $api.put(`/auth/user-update/${data?.id}/`, data);
  return response.data;
};
