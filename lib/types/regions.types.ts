import { PaginationResponse } from "./gas_station.types";

export interface IRegion {
  id?: string;
  name: string;
  flight_type: string;
  gone_flight_price: number | string;
  gone_flight_price_uzs: number;
  gone_flight_price_type: string;
  gone_driver_expenses: number | string;
  gone_driver_expenses_uzs: number;
  gone_driver_expenses_type: string;
  been_flight_price: number | string;
  been_flight_price_uzs: number;
  been_flight_price_type: string;
  been_driver_expenses: number | string;
  been_driver_expenses_uzs: number;
  been_driver_expenses_type: string;
  route: string
}

export type IRegionResponse = PaginationResponse<IRegion>;
