import { $api } from "@/pages/api/api";

export const fetchFlightStats = async (
  start?: string,
  end?: string,
) => {
  const response = await $api.get(
    `/flight/finance/fuel/?start_date=${start}&end_date=${end}`
  );
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

export const fetchFinanceStats = async (
  start_date: string,
  end_date: string
) => {
  const response = await $api.get(
    `/flight/statistics/?start_date=${start_date}&end_date=${end_date}`
  );
  return response.data;
};

export const fetchCarInfo = async () => {
  const response = await $api.get(`/cars/list-no-pg/`);
  return response.data;
};