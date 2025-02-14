import { IFinance } from "./finance.types";
import { PaginationResponse } from "./gas_station.types";

export interface IEmployee {
    id?: string
  full_name: string;
  license?: string;
  passport?: string;
  license_photo?: string;
  passport_photo?: string;
  phone: string;
  flight_type: string;
  balance_uzs?: string;
  bonus?: boolean;
}

export interface IEmployeeGet {
    id?: string
  full_name: string;
  license?: string;
  passport?: string;
  license_photo?: {id: string, file: string};
  passport_photo?: {id: string, file: string};
  phone: string;
  flight_type: string;
  balance_uzs: number;
  balance_price_type: string;
  bonus?: boolean;
}


export interface EmployeesListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: IEmployee[];
}

export type PaginatedExpenseLog = PaginationResponse<IFinance>
