import { $api } from "@/pages/api/api";
import { IDieselType } from "../types/diesel.types";

export const fetchDiesel = async (page: number) => {
  const response = await $api.get(`/salarka/list/?page=${page}`);
  return response.data;
};

export const createDiesel = async (data: IDieselType) => {
  const response = await $api.post(`/salarka/create/`, data);
  return response.data;
};


