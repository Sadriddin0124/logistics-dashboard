import { $api } from "@/pages/api/api";
import { ICars } from "../types/cars.types";

export const fetchCar = async (page: number) => {
  const response = await $api.get(`/cars/list/?page=${page}`);
  return response.data;
};

export const fetchCarNoPage = async () => {
  const response = await $api.get(`/cars/list-no-pg/`);
  return response.data;
};

export const fetchCarById = async (id: string) => {
  const response = await $api.get(`/cars/by-id/${id}/`);
  return response.data;
};

export const createCar = async (data: ICars) => {
  const response = await $api.post(`/cars/create/`, data);
  return response.data;
};

export const updateCar = async (data: ICars) => {
  const response = await $api.put(`/cars/update/${data?.id}/`, data);
  return response.data;
};

export const deleteCar = async (id: string) => {
  const response = await $api.delete(`/cars/delete/${id}/`,);
  return response.data;
};
