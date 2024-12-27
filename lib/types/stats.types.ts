import { PaginationResponse } from "./gas_station.types";

export type IStats = {
    id: string; // Unique identifier for the action
    action: "INCOME"; // Type of action
    amount_uzs: number; // Amount in UZS
    car: string | null; // Associated car, if any
    comment: string; // Comment or description of the action
    created_at: string; // ISO timestamp of when the action was created
    employee: string | null; // Associated employee, if any
    flight: string | null; // Associated flight, if any
    income_sum: number; // Total income sum
    kind: string | null; // Specific kind or type of action, if any
    outcome_sum: number; // Total outcome sum
    reason: string; // Reason or explanation for the action
    win: number; // Resulting balance or net value
    leasing_balance: number; // Resulting balance or net value
    total_leasing_paid: number; // Resulting balance or net value
  };

  export type StatsPaginated = PaginationResponse<IStats>

  type Filters = {
    year: number | null; // Year filter, nullable
    month: number | null; // Month filter, nullable
    day: number | null; // Day filter, nullable
    start_date: string | null; // ISO string for the start date, nullable
    end_date: string | null; // ISO string for the end date, nullable
    action: string | null; // Action type, nullable
  };
  
  type ChartData = {
    period: string; // ISO string for the period
    income: number; // Income for the period
    outcome: number; // Outcome for the period
  };
  
  type Results = {
    income_sum: number; // Total income sum
    outcome_sum: number; // Total outcome sum
    win: number; // Net win
    chart_data: ChartData[]; // Array of chart data
  };
  
  export type ResponseData = {
    filters: Filters; // Filters applied to the query
    results: Results; // Results of the query
  };
  