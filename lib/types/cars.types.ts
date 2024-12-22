export interface FuelEntry {
    quantity: string;
    supplier: string;
    price: number;
    date: string;
    status: 'filled' | 'pending';
  }
  
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
    id?: string
    name: string;
    model: string;
    number: string;
    with_trailer: boolean;
    trailer_number?: null | string;
    type_of_payment: string;
    leasing_period: number;
    fuel_type: string;
    price_usd: number;
    price_uzs: number;
    distance_travelled: number;
  }

  type PaymentType = "CASH" | "LEASING";
type FuelType = "DIESEL" | "PETROL" | "ELECTRIC";

interface Car {
  id: string;
  name: string;
  number: string;
  model: string;
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
