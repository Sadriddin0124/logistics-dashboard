import { $api } from "@/pages/api/api";
import {  } from "../types/employee.types";
import { IOilType } from "../types/oil.types";

export const fetchOil = async (id: string) => {
  const response = await $api.get(`/oil/${id}`);
  return response.data;
};

export const fetchOils = async (page: number) => {
  const response = await $api.get(`/oil/list/?page=${page}`);
  return response.data;
};

export const createOil = async (data: IOilType) => {
  const response = await $api.post(`/oil/create/`, data);
  return response.data;
};
export const updateOil = async (data: IOilType) => {
  const response = await $api.put(`/oil/update/${data?.id}`, data);
  return response.data;
};
