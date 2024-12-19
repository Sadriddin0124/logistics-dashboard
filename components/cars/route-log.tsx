'use client'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { RouteEntry } from "@/lib/types/cars.types"

const routeData: RouteEntry[] = Array(4).fill({
  id: 122,
  driverCode: 'Sumatilla Sh.N.',
  price: 52300,
  departureDate: '12.12.2024',
  arrivalDate: '12.12.2024',
  cargo: 'Ichimliklar'
})

export function RouteLog() {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader className="font-bold">
          <TableRow className="border-b-gray-300 border-b">
            <TableHead className="font-bold">ID рейса</TableHead>
            <TableHead className="font-bold">Шофёр</TableHead>
            <TableHead className="font-bold">Цена</TableHead>
            <TableHead className="font-bold">Дата отправления</TableHead>
            <TableHead className="font-bold">Дата приезда</TableHead>
            <TableHead className="font-bold">Груз</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {routeData.map((route, i) => (
            <TableRow key={i} className="border-b-gray-300 border-b">
              <TableCell>{route.id}</TableCell>
              <TableCell>{route.driverCode}</TableCell>
              <TableCell>{route.price}</TableCell>
              <TableCell>{route.departureDate}</TableCell>
              <TableCell>{route.arrivalDate}</TableCell>
              <TableCell>{route.cargo}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

