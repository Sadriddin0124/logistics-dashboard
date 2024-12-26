import { $api } from "@/pages/api/api";
import { IRegion } from "../types/regions.types";

export const fetchOil = async (id: string) => {
    const response = await $api.get(`/oil/${id}`);
    return response.data;
  };
  
  export const fetchRegions = async (page: number) => {
    const response = await $api.get(`/regions/?page=${page}`);
    return response.data;
  };
  
  export const fetchRegionsAll = async () => {
    const response = await $api.get(`/regions/pg`);
    return response.data;
  };
  
  export const createRegion = async (data: IRegion) => {
    const response = await $api.post(`/regions/`, data);
    return response.data;
  };
  export const deleteRegion = async (id: string) => {
    const response = await $api.delete(`/regions/${id}`);
    return response.data;
  };
  export const updateRegion = async ( data: IRegion) => {
    const response = await $api.put(`/regions/${data?.id}`, data);
    return response.data;
  };