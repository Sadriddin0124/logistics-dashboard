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
  
  