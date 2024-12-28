import { $api } from "@/pages/api/api";
import { IFinance, IFinanceDiesel } from "../types/finance.types";

export const fetchFinances = async (page: number, start: string, end: string, kind: string, action: string) => {
  const response = await $api.get(`/finance/filter?page=${page}&start_date=${start}&end_date=${end}&kind=${kind}&action=${action}`);
  return response.data;
};

export const downloadFinances = async () => {
  const response = await $api.get(`/finance/export-logs/`);
  return response.data;
};

export const createFinance = async (data: IFinance) => {
  const response = await $api.post(`/finance/`, data);
  return response.data;
};

export const createFinanceDiesel = async (data: IFinanceDiesel) => {
  const response = await $api.post(`/salarka/another/`, data);
  return response.data;
};
// export const updateEmployee = async (data: IEmployee) => {
//   const response = await $api.put(`/employees/update/${data?.id}/`, data);
//   return response.data;
// };
// export const deleteEmployee = async (id: string) => {
//   const response = await $api.delete(`/employees/delete/${id}/`);
//   return response.data;
// };
