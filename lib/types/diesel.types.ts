import { ICars } from "./cars.types";
import { PaginationResponse } from "./gas_station.types";

export interface IDieselType {
  volume: string;
  price: number | string;
  price_uzs: number;
  car: string;
  remaining_volume?: string;
  created_at: string
}
export interface IDieselTypeForPagination {
  volume: string;
  price: number;
  price_uzs: number;
  car: ICars;
  remaining_volume?: {volume: number};
  created_at?: string;
}

export type IDieselPaginated = PaginationResponse<IDieselTypeForPagination>;

export interface IDieselSale {
  car: string;
  volume: string;
}
