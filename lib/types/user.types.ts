import { PaginationResponse } from "./gas_station.types";

export interface IUser {
  id?: string;
  full_name?: string;
  phone: string;
  password: string;
  can_delete: boolean;
}

export type PaginatedUser = PaginationResponse<IUser>;
