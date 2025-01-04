import { ICars } from "./cars.types";
import { PaginationResponse } from "./gas_station.types";
import { IRegion } from "./regions.types";

export interface IFlight {
  region: string;
  city: string;
  route: string;
  departure_date: string;
  arrival_date: string;
  car: string;
  driver: string;
  tripPrice: string;
  spending: string;
  cargo_info: string;
  expenses: string;
}

export interface IFlightCreate {
  id?: string;
  region: string; // UUID
  status?: string; // UUID
  flight_type: string; // Enum with 2 possible values
  car: string; // Required
  driver: string; // Required
  departure_date: string; // Date in ISO format (required)
  arrival_date?: string | null; // Date in ISO format (nullable)
  price_uzs?: number | string;
  price?: number | string;
  driver_expenses_uzs?: number | string;
  driver_expenses?: number;
  upload?: string | null; // UUID (nullable)
  cargo_info?: string | null; // Nullable
  route: string; // Required
  other_expenses_uzs?: string | number;
  other_expenses?: string | number;
  flight_expenses?: string | number;
  flight_expenses_uzs?: number;
  start_km: number;
  end_km?: number;
  flight_balance?: number;
  flight_balance_uzs?: number;
}
export interface IFlightData {
  id?: string;
  region: string; // UUID
  flight_type: string; // Enum with 2 possible values
  car: string; // Required
  status?: string; // Required
  driver: string; // Required
  departure_date: string; // Date in ISO format (required)
  arrival_date?: string | null; // Date in ISO format (nullable)
  price_uzs: string | number;
  price?: string | number;
  driver_expenses_uzs: number | string;
  upload?: string | null; // UUID (nullable)
  cargo_info?: string | null; // Nullable
  route: string; // Required
  driver_number?: string;
  driver_name?: string;
  car_number?: string;
  other_expenses: number | string;
  flight_expenses: number | string;
  flight_expenses_uzs: number;
  driver_expenses: number | string;
  flight_balance: number;
  start_km: number;
  end_km?: number;
}
 
export interface CloseFlight {
  id?: string
  distance_travelled: number,
  arrival_date: string,
  flight_balance_uzs: number
}

export interface IFlightForm {
  id?: string;
  region: IRegion; // UUID
  flight_type: string; // Enum with 2 possible values
  car: ICars; // Required
  driver: string; // Required
  departure_date: string; // Date in ISO format (required)
  arrival_date?: string | null; // Date in ISO format (nullable)
  price_uzs?: string | null; // Nullable
  price_usd?: string | null; // Nullable
  driver_expenses_uzs?: string | null; // Expenses allocated to the driver (nullable)
  driver_expenses_usd?: string | null; // Expenses allocated to the driver (nullable)
  upload?: string | null; // UUID (nullable)
  cargo_info?: string | null; // Nullable
  route: string; // Required
  status?: string;
  created_at?: string;
}
export interface IFlightFormEdit {
  id?: string;
  region: IRegion | string; // UUID
  flight_type: string; // Enum with 2 possible values
  car: ICars | string; // Required
  driver: string; // Required
  departure_date: string; // Date in ISO format (required)
  arrival_date?: string | null; // Date in ISO format (nullable)
  price_uzs?: number; // Nullable
  price?: string | null; // Nullable
  driver_expenses_uzs?: number; // Expenses allocated to the driver (nullable)
  driver_expenses?: string | null; // Expenses allocated to the driver (nullable)
  upload?: { id: string; file: string }; // UUID (nullable)
  cargo_info?: string | null; // Nullable
  route: string; // Required
  status?: string;
  created_at?: string;
  flight_balance: number;
  flight_balance_uzs: number;
  flight_expenses_uzs?: number;
  flight_expenses: number | string;
  other_expenses: number | string;
  other_expenses_uzs?: number;
  start_km: number;
  end_km?: number;
}

export interface IFlightType {
  id?: string;
  region: string; // UUID
  flight_type: string; // Enum with 2 possible values
  car: ICars; // Required
  car_number?: string; // Required
  driver: string; // Required
  departure_date: string; // Date in ISO format (required)
  arrival_date?: string | null; // Date in ISO format (nullable)
  status: string; // Required
  route: string; // Required
  price_uzs?: string | null; // Nullable
  price_usd?: string | null; // Nullable
  driver_expenses_uzs?: string | null; // Expenses allocated to the driver (nullable)
  driver_expenses_usd?: string | null; // Expenses allocated to the driver (nullable)
  upload?: string | null; // UUID (nullable)
  cargo_info?: string | null; // Nullable
}

export interface IFlightType2 {
  id?: string;
  region: IRegion; // UUID
  flight_type: string; // Enum with 2 possible values
  car: ICars; // Required
  car_number?: string; // Required
  driver: string; // Required
  departure_date: string; // Date in ISO format (required)
  arrival_date?: string | null; // Date in ISO format (nullable)
  status: string; // Required
  route: string; // Required
  price_uzs?: string | null; // Nullable
  price_usd?: string | null; // Nullable
  driver_expenses_uzs?: string | null; // Expenses allocated to the driver (nullable)
  driver_expenses_usd?: string | null; // Expenses allocated to the driver (nullable)
  upload?: string | null; // UUID (nullable)
  cargo_info?: string | null; // Nullable
  created_at?: string | null; // Nullable
}

export interface IOrderedFlight {
  id?: string;
  region: IRegion; // UUID
  flight_type: string; // Enum with 2 possible values
  car: ICars; // Required
  car_number?: string; // Required
  driver: string; // Required
  driver_name: string; // Required
  driver_number: string; // Required
  departure_date: string; // Date in ISO format (required)
  arrival_date?: string | null; // Date in ISO format (nullable)
  status: string; // Required
  route: string; // Required
  price_uzs?: string | null; // Nullable
  price_usd?: string | null; // Nullable
  driver_expenses_uzs?: string | null; // Expenses allocated to the driver (nullable)
  driver_expenses_usd?: string | null; // Expenses allocated to the driver (nullable)
  upload?: string | null; // UUID (nullable)
  cargo_info?: string | null; // Nullable
}

export type FlightPaginatedResponse = PaginationResponse<IFlightType>;
export type FlightPaginatedResponse2 = PaginationResponse<IFlightType2>;
