import { $api } from "@/pages/api/api";
import { IEmployee } from "../types/employee.types";

export const fetchEmployee = async (id: string) => {
  const response = await $api.get(`/employees/${id}`);
  return response.data;
};

export const fetchEmployees = async (page: number) => {
  const response = await $api.get(`/employees/?page=${page}`);
  return response.data;
};

export const createEmployee = async (data: IEmployee) => {
  const response = await $api.post(`/employees/create/`, data);
  return response.data;
};
export const updateEmployee = async (data: IEmployee) => {
  const response = await $api.put(`/employees/update/${data?.id}/`, data);
  return response.data;
};
