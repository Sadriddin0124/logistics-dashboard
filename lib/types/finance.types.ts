import { PaginationResponse } from "./gas_station.types";

export interface IFinance {
  action?: string;
  amount_uzs?: number;
  kind?: string;
  flight?: string;
  driver?: string;
  car?: string;
  balance?: string;
  comment?: string;
  created_at?: string;
  leasing_balance?: number
  total_leasing_paid?: number
}


export type IFinanceResponse = PaginationResponse<IFinance>