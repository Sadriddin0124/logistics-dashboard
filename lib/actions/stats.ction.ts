import { $api } from "@/pages/api/api";

export const fetchFinanceStats = async (
  page: number,
  start?: string,
  end?: string,
  kind?: string
) => {
  const response = await $api.get(
    `/finance/filter?page=${page}&start_date=${start}&end_date=${end}&kind=${kind}`
  );
  return response.data;
};

export const fetchFlightsStatsAll = async () => {
  const response = await $api.get(`/flight/`);
  return response.data;
};

export const fetchFlightsStats = async (page: number, active: string) => {
  const response = await $api.get(`/flight/?status=${active}`);
  return response.data;
};

export const fetchFinanceInfo = async (
  start_date: string,
  end_date: string
) => {
  const response = await $api.get(
    `/finance/info?start_date=${start_date}&end_date=${end_date}`
  );
  return response.data;
};
export const fetchCarInfo = async () => {
  const response = await $api.get(`/cars/list-no-pg/`);
  return response.data;
};
export const fetchCarLeasing = async () => {
  const response = await $api.get(`/finance/filter`);
  return response.data;
};
export const fetchCarStats = async (id: string) => {
  const response = await $api.get(`/cars/car-infos/${id}`);
  return response.data;
};
