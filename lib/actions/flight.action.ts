import { $api } from "@/pages/api/api";
import { CloseFlight, IFlightCreate } from "../types/flight.types";

export const fetchFlight = async (id: string) => {
  const response = await $api.get(`/flight/${id}/`);
  return response.data;
};

export const fetchOrderedFlight = async (id: string) => {
  const response = await $api.get(`/flight/ordered/${id}`);
  return response.data;
};

export const fetchFlights = async (page: number, type?: string, status?: string, is_archived?: boolean) => {
  const response = await $api.get(`/flight/?page=${page}&flight_type=${type}&status=${status}&is_archived=${is_archived}`);
  return response.data;
};

export const fetchFlightStats = async (page: number, type: string) => {
  const response = await $api.get(`/flight/?page=${page}&flight_type=${type}`);
  return response.data;
};

export const fetchAllFlights = async () => {
  const response = await $api.get(`/flight/list-pg`);
  return response.data;
};

export const fetchOrderedFlights = async (is_archived?: boolean | string, page?: number) => {
  const response = await $api.get(`/flight/ordered?is_archived=${is_archived}&page=${page}`);
  return response.data;
};

export const fetchFlightExpense = async (id: string, page: number) => {
  const response = await $api.get(`/flight/finance/${id}?page=${page}`);
  return response.data;
};

export const createFlight = async (data: IFlightCreate) => {
  const response = await $api.post(`/flight/`, data);
  return response.data;
};

export const orderFlight = async (data: IFlightCreate) => {
  const response = await $api.post(`/flight/ordered`, data);
  return response.data;
};

export const updateOrderedFlight = async (data: IFlightCreate) => {
  const response = await $api.put(`/flight/ordered/${data?.id}`, data);
  return response.data;
};

export const archiveOrderedFlight = async (data: {id: string, is_archived: boolean}) => {
  const response = await $api.patch(`/flight/ordered/${data?.id}`, data);
  return response.data;
};

export const deleteOrderedFlight = async (id: string) => {
  const response = await $api.delete(`/flight/ordered/${id}`);
  return response.data;
};

export const updateOrderedStatus = async (id: string) => {
  const response = await $api.patch(`/flight/ordered/${id}`, {status: "INACTIVE" });
  return response.data;
};

export const updateFlight = async (data: {id: string, endKm: number, arrival_date: string, flight_balance: number}) => {
  const response = await $api.patch(`/flight/${data?.id}/`, {end_km: data?.endKm, status: "INACTIVE", arrival_date: data?.arrival_date, flight_balance: data?.flight_balance });
  return response.data;
};

export const archiveFlight = async (data: {id: string, is_archived: boolean}) => {
  const response = await $api.patch(`/flight/${data?.id}/`, data);
  return response.data;
};

export const closeFlight = async (data: CloseFlight) => {
  const response = await $api.put(`/flight/close/${data?.id}`, data);
  return response.data;
};



// export const updateFlightB $api.patch(`/flight/${data?.id}/`, {flight_balance: data?.flight_balance});
//   return responsealance = async (data: {id: string, flight_balance: number}) => {
//   const response = await.data;
// };

export const updateFlightData = async (data: IFlightCreate) => {
  const response = await $api.patch(`/flight/${data?.id}/`, data);
  return response.data;
};

export const deleteFlight = async (id: string) => {
  const response = await $api.delete(`/flight/delete/${id}`);
  return response.data;
};