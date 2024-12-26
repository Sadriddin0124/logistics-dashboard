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
  id?: string
  region: string; // UUID
  status?: string; // UUID
  flight_type: string; // Enum with 2 possible values
  car: string; // Required
  driver: string; // Required
  departure_date: string; // Date in ISO format (required)
  arrival_date?: string | null; // Date in ISO format (nullable)
  price_uzs?: number; 
  price_usd?: number; 
  driver_expenses_uzs?: number; 
  driver_expenses_usd?: number; 
  upload?: string | null; // UUID (nullable)
  cargo_info?: string | null; // Nullable
  route: string; // Required
}
export interface IFlightData {
  id?: string
  region: string; // UUID
  flight_type: string; // Enum with 2 possible values
  car: string; // Required
  status?: string; // Required
  driver: string; // Required
  departure_date: string; // Date in ISO format (required)
  arrival_date?: string | null; // Date in ISO format (nullable)
  price_uzs?: string; 
  driver_expenses_uzs?: string; 
  upload?: string | null; // UUID (nullable)
  cargo_info?: string | null; // Nullable
  route: string; // Required
  driver_number?: string
  driver_name?: string
  car_number?: string
  other_expenses?: string
}
export interface IFlightForm {
  id?: string
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
  status?: string 
}


export interface  IFlightType{
  id?: string
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

export interface  IOrderedFlight{
  id?: string
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

export type FlightPaginatedResponse = PaginationResponse<IFlightType>