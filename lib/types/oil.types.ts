import { PaginationResponse } from "./gas_station.types";

export interface IOilType {
  id?: string;
  oil_name?: string;
  oil_volume?: number;
  payed_price_uzs?: number;
  payed_price_usd?: number;
  price_uzs?: number;
  price_usd?: number;
  updated_at?: string;
  remaining_oil_quantity?: string;
}
export interface IOil {
  id?: string;
  oil_name?: string;
  oil_volume: number;
  next_oil_recycle_distance: number;
  oil_recycle_distance: number;
  amount_uzs: string;
  amount_usd: string;
  price_uzs: string;
  price_usd: string;
  updated_at?: string;
  created_at?: string;
}
export interface IOilExchange {
  id?: string;
  oil: string;
  amount: number;
  car: string;
  remaining_oil: string;
  updated_at?: string;
  next_oil_recycle_distance: number;
  oil_recycle_distance: number;
}

export interface IOilExchangedList {
  recycles: IOilExchange[];
}

export interface OilListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: IOilType[];
}

export interface IOilRecycle {
  quantity_utilized: number;
  price_usd?: number;
  price_uzs: number;
}
interface IRemaining {
  remaining_oil_quantity: number;
}
interface IUtilizedOil {
  created_at: string;
  id?: string;
  price_uzs: number;
  quantity_utilized: number;
  remaining_oil_quantity: number;
}
export type OilResponse = PaginationResponse<IOil>;
export type OilExchangedResponse = PaginationResponse<IOilExchange>;
export type OilRemainingResponse = PaginationResponse<IRemaining>;
export type OilUtilizedResponse = PaginationResponse<IUtilizedOil>;
