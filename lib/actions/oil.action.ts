import { $api } from "@/pages/api/api";
import {  } from "../types/employee.types";
import { IOilExchange, IOilRecycle, IOilType } from "../types/oil.types";

export const fetchOil = async (id: string) => {
  const response = await $api.get(`/oil/oil-details/${id}/`);
  return response.data;
};

export const fetchOils = async (page: number) => {
  const response = await $api.get(`/oil/list/?page=${page}`);
  return response.data;
};

export const fetchUtilizedOils = async (page: number) => {
  const response = await $api.get(`/oil/utilized-create/?page=${page}`);
  return response.data;
};

export const fetchWholeOils = async () => {
  const response = await $api.get(`/oil/list-pg/`);
  return response.data;
};

export const createOil = async (data: IOilType) => {
  const response = await $api.post(`/oil/list/`, data);
  return response.data;
};
export const updateOil = async (data: IOilType) => {
  const response = await $api.put(`/oil/update/${data?.id}`, data);
  return response.data;
};
export const deleteOil = async (id: string) => {
  const response = await $api.delete(`/oil//${id}`,);
  return response.data;
};

//recycle
export const recycleOil = async (data: IOilRecycle) => {
  const response = await $api.post(`/oil/utilized-create/`, data);
  return response.data;
};

export const fetchOilRemaining = async () => {
  const response = await $api.get(`/oil/recycle-list`);
  return response.data;
};
export const fetchRecycledOil = async () => {
  const response = await $api.get(`/oil/utilized-create/`,);
  return response.data;
};
export const fetchOilQuantity= async () => {
  const response = await $api.get(`/oil/remaining-quantiry/`,);
  return response.data;
};

//oil purchases

export const fetchOilPurchase = async (id: string, page: number) => {
  const response = await $api.get(`/oil/purchase-read/?oil_id=${id}&page=${page}`, );
  return response.data;
};

export const createOilPurchase = async (id: string, data: IOilType) => {
  const response = await $api.post(`/oil/purchase/${id}/`, {...data, oil: id});
  return response.data;
};

//exchange oil

export const fetchOilExchange= async (id: string) => {
  const response = await $api.get(`/oil/recycled/${id}/`, );
  return response.data;
};
// export const fetchOilExchange= async (id: string, page: number) => {
//   const response = await $api.get(`/oil/recycled/${id}/?page=${page}`, );
//   return response.data;
// };

export const createOilExchange = async (data: IOilExchange) => {
  const response = await $api.post(`/oil/recycle/`, data);
  return response.data;
};