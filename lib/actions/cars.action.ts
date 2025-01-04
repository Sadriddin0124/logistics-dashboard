import { $api } from "@/pages/api/api";
import { ICars, ICarsDetail } from "../types/cars.types";

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

export const sellCar = async (data: { id: string; sell_price: string }) => {
  const response = await $api.post(`/cars/delete/${data?.id}`, {
    sell_price: data?.sell_price,
  });
  return response.data;
};

export const updateCar = async (data: ICars) => {
  const response = await $api.put(`/cars/update/${data?.id}/`, data);
  return response.data;
};

export const updateCarDistance = async (data: {
  id: string;
  distance_travelled: number;
  next_oil_recycle_distance?: number;
}) => {
  const data1 = { distance_travelled: data?.distance_travelled };
  const data2 = {
    distance_travelled: data?.distance_travelled,
    next_oil_recycle_distance: data?.next_oil_recycle_distance,
  };
  const dataSend = data?.next_oil_recycle_distance ? data2 : data1
  const response = await $api.patch(`/cars/update/${data?.id}/`, dataSend);
  return response.data;
};
export const updateCarDistanceOil = async (data: {
  id: string;
  distance_travelled: number;
  next_oil_recycle_distance?: number;
}) => {
  const data2 = {
    distance_travelled: data?.distance_travelled,
    next_oil_recycle_distance: data?.next_oil_recycle_distance,
  };
  const response = await $api.patch(`/cars/update/${data?.id}/`, data2);
  return response.data;
};


export const updateCarLeasing = async (data: {
  id: string;
  leasing_payed_amount: number | string;
}) => {
  const response = await $api.patch(`/cars/update/${data?.id}/`, {
    leasing_payed_amount: data?.leasing_payed_amount,
  });
  return response.data;
};

export const deleteCar = async (id: string) => {
  const response = await $api.delete(`/cars/delete/${id}/`);
  return response.data;
};

//models

export const fetchAllModels = async () => {
  const response = await $api.get(`/cars/model/`);
  return response.data;
};

export const fetchModels = async (page: number) => {
  const response = await $api.get(`/cars/model-pagination/?page=${page}`);
  return response.data;
};

export const createModel = async (data: { name: string }) => {
  const response = await $api.post(`/cars/model-create/`, data);
  return response.data;
};

export const updateModel = async (data: { id: string; name: string }) => {
  const response = await $api.put(`/cars/model-update/${data?.id}`, data);
  return response.data;
};

export const deleteModel = async (id: string) => {
  const response = await $api.delete(`/cars/model-delete/${id}`);
  return response.data;
};

// export const fetchAutoDetails = async () => {
//   const response = await $api.get(`/cars/model/`);
//   return response.data;
// };

//Details

export const fetchAllAutoDetails = async (status: string, page: number) => {
  const response = await $api.get(`/cars/detail/?page=${page}&in_sklad=${status}`);
  return response.data;
};

export const fetchAutoDetails = async (page: number, id: string) => {
  const response = await $api.get(`/cars/car-detail/${id}?page=${page}`);
  return response.data;
};

export const createAutoDetail = async (data: ICarsDetail[]) => {
  const response = await $api.post(`/cars/bulk/`, data);
  return response.data;
};

export const updateAutoDetail = async (data: ICarsDetail[]) => {
  const response = await $api.patch(`/cars/bulk-update/`, data);
  return response.data;
};

export const deleteAutoDetail = async (data: {
  id: string[];
  sell_price: number;
}) => {
  const response = await $api.post(`/cars/detail-delete/`, data);
  return response.data;
};

//expenses

export const fetchAutoExpense = async (id: string, page: number) => {
  const response = await $api.get(`/salarka/salarka/${id}?page=${page}`);
  return response.data;
};

export const fetchAutoGas = async (id: string, page: number) => {
  const response = await $api.get(`/gas/gas-sales/${id}?page=${page}`);
  return response.data;
};

export const fetchAutoOil = async (id: string, page: number) => {
  const response = await $api.get(
    `/oil/recycle-car/?car_id=${id}& page=${page}`
  );
  return response.data;
};

export const fetchAutoRoute = async (id: string, page: number) => {
  const response = await $api.get(`/flight/stats/${id}?page=${page}`);
  return response.data;
};
