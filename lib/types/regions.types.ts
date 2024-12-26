import { PaginationResponse } from "./gas_station.types"

export interface IRegion {
    id?: string
    name: string,
    flight_type: string,
    price1: number
    price2: number
}

export type IRegionResponse = PaginationResponse<IRegion>