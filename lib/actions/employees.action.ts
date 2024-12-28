import { $api } from "@/pages/api/api";
import { IEmployee } from "../types/employee.types";

export const fetchEmployee = async (id: string) => {
  const response = await $api.get(`/employees/${id}`);
  return response.data;
};

export const fetchEmployeesFlight = async (id: string, page: number) => {
  const response = await $api.get(`/flight/driver/${id}?page=${page}`);
  return response.data;
};

export const fetchEmployeesExpenses = async (id: string, page: number) => {
  const response = await $api.get(`/finance/finans/driver/${id}?page=${page}`);
  return response.data;
};

export const fetchEmployees = async (page: number) => {
  const response = await $api.get(`/employees/?page=${page}`);
  return response.data;
};

export const fetchEmployeesAll = async () => {
  const response = await $api.get(`/employees/list-pg/`);
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
export const updateEmployeeBalance = async (data: {id: string, balance_usz: number}) => {
  const response = await $api.patch(`/employees/update/${data?.id}/`, data);
  return response.data;
};
export const deleteEmployee = async (id: string) => {
  const response = await $api.delete(`/employees/delete/${id}/`);
  return response.data;
};
