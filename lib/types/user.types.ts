import { PaginationResponse } from "./gas_station.types";

export interface IUser {
  id?: string;
  full_name?: string;
  phone: string;
  password: string;
}

export type PaginatedUser = PaginationResponse<IUser>;
