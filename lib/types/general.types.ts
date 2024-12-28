export type ExchangeRate = {
    id: number;
    Code: string;
    Ccy: string;
    CcyNm_RU: string;
    CcyNm_UZ: string;
    CcyNm_UZC: string;
    CcyNm_EN: string;
    Nominal: string;
    Rate: string;
    Diff: string;
    Date: string;
  };

export  type IFlight = {
    region: string; // UUID of the region
    city: string; // UUID of the city
    route: number; // Route number (e.g., 0 or another value)
    car: string; // UUID of the car
    driver: number; // Driver identifier (e.g., 0 or another value)
    departure_date: string; // Date in YYYY-MM-DD format
    arrival_date: string; // Date in YYYY-MM-DD format
    price_uzs: number; // Price in Uzbek Som
    price_usd: number; // Price in USD
    driver_expenses_uzs: number; // Driver's expenses in Uzbek Som
    driver_expenses_usd: number; // Driver's expenses in USD
    cargo_info: string; // Additional cargo information
    status: "ACTIVE" | "INACTIVE"; // Status can either be ACTIVE or INACTIVE
  };
  
  export interface FileType  {
    id: string, 
    file: string
  }