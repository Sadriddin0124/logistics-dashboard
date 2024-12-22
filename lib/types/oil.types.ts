export interface IOilType {
    id?: string
  oil_name: string;
  oil_volume: string;
  payed_price_uzs: number;
  payed_price_usd: number;
  price_uzs: number;
  price_usd: number;
  updated_at?: string;
}


export interface OilListResponse {
    count: number;
    next: string | null;
    previous: string | null;
    results: IOilType[]
}