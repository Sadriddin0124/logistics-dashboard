import { PaginationResponse } from "./gas_station.types";

export interface IFinance {
  action?: string;
  amount_uzs?: number | string;
  kind?: string;
  flight?: string;
  driver?: string;
  car?: string;
  balance?: string;
  comment?: string;
  created_at?: string;
  leasing_balance?: number;
  total_leasing_paid?: number;
  distance_travelled?: number;
}
export interface IFinanceDiesel {
  car: string;
  flight: string;
  volume: string;
  price_uzs: string;
  price: string | number;
  price_type: string;
  km: string;
  km_car: string;
}

export type IFinanceResponse = PaginationResponse<IFinance>;
