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
        <TableHeader>
          <TableRow className="border-b-gray-300 border-b">
            <TableHead>ID рейса</TableHead>
            <TableHead>Шофёр</TableHead>
            <TableHead>Цена</TableHead>
            <TableHead>Дата отправления</TableHead>
            <TableHead>Дата приезда</TableHead>
            <TableHead>Груз</TableHead>
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

