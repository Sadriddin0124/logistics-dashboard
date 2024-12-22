import { ICars } from "./cars.types";

export interface IGasCreate {
  id?: string;
  name?: string;
  remaining_gas?: number;
  price_usd: number;
  price_uzs: number;
  payed_price_usd: number;
  payed_price_uzs: number;
}

export interface IGasStation {
  id?: string;
  name?: string;
  remaining_gas?: number;
  price_usd: number;
  price_uzs: number;
  payed_price_usd: number;
  payed_price_uzs: number;
  amount?: number
}

export interface IGasStationTotal {
  id?: string;
  station_name: string;
  remaining_gas: number;
  updated_at?: string;
}

export interface GasListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: IGasStation[];
}

export interface AnotherStation {
  id?: string;
  car: string;
  purchased_volume: number;
  payed_price_uzs: number;
  payed_price_usd: number;
}

export interface AnotherStationList {
  id?: string;
  car: ICars;
  purchased_volume: number;
  payed_price_uzs: number;
  payed_price_usd: number;
}

export interface AnotherStationListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: AnotherStationList[];
}

export interface StationNamesListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: { name: string; id: string }[];
}

export interface StationCars {
  id: string;
  name: string;
}

export interface PaginationResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface IUser {
  id: string;
  name: string;
}

export type PurchasedGasListResponse = PaginationResponse<IGasStation>;
