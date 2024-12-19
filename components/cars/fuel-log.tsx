'use client'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
// import { Button } from "@/components/ui/button"
import { FuelEntry } from "@/lib/types/cars.types"

const fuelData: FuelEntry[] = Array(8).fill({
  quantity: '300(л)',
  supplier: 'Inter',
  price: 2500,
  date: '12.12.2024',
  status: 'filled' as const
})

export function FuelLog() {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader className="font-bold">
          <TableRow className="border-b-gray-300 border-b">
            <TableHead className="font-bold">Количество</TableHead>
            <TableHead className="font-bold">Заправка</TableHead>
            <TableHead className="font-bold">Цена</TableHead>
            <TableHead className="font-bold">Дата</TableHead>
            {/* <TableHead className="font-bold"></TableHead> */}
          </TableRow>
        </TableHeader>
        <TableBody>
          {fuelData.map((entry, i) => (
            <TableRow key={i} className="border-b-gray-300 border-b">
              <TableCell>{entry.quantity}</TableCell>
              <TableCell>{entry.supplier}</TableCell>
              <TableCell>{entry.price} сум</TableCell>
              <TableCell>{entry.date}</TableCell>
              {/* <TableCell>
                <Button variant="secondary" size="sm">
                  Налили
                </Button>
              </TableCell> */}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

