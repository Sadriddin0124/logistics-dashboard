export interface IEmployee {
    id?: string
  full_name: string;
  license: string;
  phone: string;
  flight_type: string;
  passport: string;
  balance: string;
}


export interface EmployeesListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: IEmployee[];
}