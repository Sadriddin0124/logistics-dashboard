import { ICars } from "./cars.types";

export interface IGasCreate {
  id?: string;
  name?: string;
  remaining_gas?: number;
  amount?: number;
  created_at?: string;
  price: number;
  price_type: string;
  price_uzs: number;
  payed_price?: number;
  payed_price_type: string;
  payed_price_uzs: number;
}

export interface IGasStation {
  id?: string;
  name?: string;
  remaining_gas?: number;
  price: number | string;
  price_type: string;
  price_uzs: number | string;
  payed_price?: number | string;
  payed_price_type: string;
  payed_price_uzs: number;
  amount?: number;
  created_at?: string;
  updated_at?: string;
  km?: number;
  used_volume?: number;
  station?: IGasStation
}

export interface IGasStationTotal {
  id?: string;
  name: string;
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
  name: string;
  created_at: string;
  purchased_volume: number;
  next_gas_distance?: number;
  payed_price_uzs: number | string;
  payed_price: number | string;
}

export interface AnotherStationList {
  id?: string;
  car: ICars;
  purchased_volume: number;
  payed_price_uzs: number;
  payed_price: number;
  payed_price_type: string;
  created_at?: string
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

export interface IStationSales {
  id?: string;
  station: string;
  car: string;
  amount: number;
}

export interface IStationSalesFetch {
  id?: string;
  station: IGasStation;
  car: ICars;
  amount: number;
  created_at?: string
  km: number
}

export type PurchasedGasListResponse = PaginationResponse<IGasStation>;
export type SoldGasListResponse = PaginationResponse<IStationSalesFetch>;
