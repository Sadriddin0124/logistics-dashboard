import { IEmployee } from "./employee.types";
import { PaginationResponse } from "./gas_station.types";
import { IOil } from "./oil.types";

export interface RouteEntry {
  id: number;
  driverCode: string;
  price: number;
  departureDate: string;
  arrivalDate: string;
  cargo: string;
}

export interface AutoPart {
  name: string;
  id: string;
}

export interface ICars {
  id?: string;
  name: string;
  model: string;
  number: string;
  with_trailer: boolean;
  trailer_number?: null | string;
  type_of_payment: string;
  leasing_period: number;
  models?: IModel
  fuel_type: string;
  price_usd: number;
  price_uzs: number | string;
  distance_travelled: number;
  oil_recycle_distance?: number
  next_oil_recycle_distance?: number
  updated_at?: string
  monthly_payment?: number
  leasing_payed_amount?: number

}

type PaymentType = "CASH" | "LEASING";
type FuelType = "DIESEL" | "PETROL" | "ELECTRIC";

interface Car {
  id: string;
  name: string;
  number: string;
  model: string;
  models?: IModel
  type_of_payment: PaymentType;
  leasing_period: number;
  with_trailer: boolean;
  fuel_type: FuelType;
  price_uzs: number;
  price_usd: number;
  distance_travelled: number;
  trailer_number: string;
}

export interface CarListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Car[];
}

export interface IModel {
  id?: string;
  name: string;
}

export type ModelListResponse = PaginationResponse<IModel>;

export interface ICarsDetail {
  id?: string
  name: string;
  id_detail: string;
  in_sklad: boolean;
  car: string; // Assuming this is a UUID as a string
  price_uzs: number;
  price_usd?: number;
}

export interface ICarsDetail2 {
  id?: string
  name: string;
  id_detail: string;
  in_sklad: boolean;
  car: ICars; // Assuming this is a UUID as a string
  price_uzs: number;
  price_usd?: number;
}

interface FuelLog {
  car: ICars
  price_uzs: number;
  price_usd: number;
  volume: number
  created_at: string
}

export interface IFlightCar {
  id?: string
  region: string; // UUID
  flight_type: string; // Enum with 2 possible values
  car: ICars; // Required
  driver: IEmployee; // Required
  departure_date: string; // Date in ISO format (required)
  arrival_date?: string | null; // Date in ISO format (nullable)
  price_uzs?: string | null; // Nullable
  price_usd?: string | null; // Nullable
  driver_expenses_uzs?: string | null; // Expenses allocated to the driver (nullable)
  driver_expenses_usd?: string | null; // Expenses allocated to the driver (nullable)
  upload?: string | null; // UUID (nullable)
  cargo_info?: string | null; // Nullable
  route: string; // Required
  status?: string 
  created_at?: string
  oil: IOil
  remaining_oil?: string,
}

export type PaginatedCarDetail = PaginationResponse<ICarsDetail2>

export type PaginatedFuel = PaginationResponse<FuelLog>

export type PaginatedRouteLog = PaginationResponse<IFlightCar>


