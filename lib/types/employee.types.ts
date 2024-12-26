import { IFinance } from "./finance.types";
import { PaginationResponse } from "./gas_station.types";

export interface IEmployee {
    id?: string
  full_name: string;
  license: string;
  phone: string;
  flight_type: string;
  passport: string;
  balance_uzs: string;
}


export interface EmployeesListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: IEmployee[];
}

export type PaginatedExpenseLog = PaginationResponse<IFinance>
