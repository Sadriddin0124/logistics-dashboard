import { $api } from "@/pages/api/api";
import { AnotherStation, IGasCreate, IStationSales } from "../types/gas_station.types";

export const fetchGasStation = async (page: number) => {
  const response = await $api.get(`/gas/?page=${page}`);
  return response.data;
};

export const fetchAllGasStation = async () => {
  const response = await $api.get(`/gas/no-pg`);
  return response.data;
};

export const fetchGasStationOne = async (id: string) => {
  const response = await $api.get(`/gas/${id}`);
  return response.data;
};

export const fetchStationPurchased = async (id: string, page: number) => {
  const response = await $api.get(`/gas/${id}/purchases?page=${page}`);
  return response.data;
};

export const fetchGasStationName = async () => {
  const response = await $api.get(`/gas/station-list/`);
  return response.data;
};

export const createGasStation = async (data: IGasCreate) => {
  const response = await $api.post(`/gas/`, data);
  return response.data;
};
export const addGas = async (id: string, data: IGasCreate) => {
  const response = await $api.post(`/gas/${id}/purchases`, data);
  return response.data;
};

export const createStation = async (name: string) => {
  const response = await $api.post(`/gas/`, {name});
  return response.data;
};
export const deleteStation = async (id: string) => {
  const response = await $api.delete(`/gas/${id}`,);
  return response.data;
};

// another station

export const fetchAnotherStation = async (page: number) => {
  const response = await $api.get(`/gas/another-create?page=${page}`);
  return response.data;
};

export const createAnotherStation = async (data: AnotherStation) => {
  const response = await $api.post(`/gas/another-create`, data);
  return response.data;
};

// sell gas


export const fetchStationSales = async (id: string, page: number) => {
  const response = await $api.get(`/gas/${id}/sales?page=${page}`);
  return response.data;
};

export const createStationSales = async (data: IStationSales) => {
  const response = await $api.post(`/gas/${data?.station}/sales`, data);
  return response.data;
};