"use client"

import { useState } from 'react'
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Pencil } from 'lucide-react'
import Link from 'next/link'

interface GasStation {
  id?: number
  name: string
  remainingGas: string
  lastPaymentDate: string
}

export default function FuelTable() {
  const [gasStations] = useState<GasStation[]>([
    {
      id: 1,
      name: "Inter",
      remainingGas: "3564 м3",
      lastPaymentDate: "12.12.2024",
    },
    {
      id: 2,
      name: "Inter",
      remainingGas: "3564 м3",
      lastPaymentDate: "12.12.2024",
    },
    {
      id: 3,
      name: "Inter",
      remainingGas: "3564 м3",
      lastPaymentDate: "12.12.2024",
    },
    {
      id: 4,
      name: "Inter",
      remainingGas: "3564 м3",
      lastPaymentDate: "12.12.2024",
    },
  ])


  return (
    <div className="w-full mx-auto bg-white rounded-2xl min-h-screen">
      <Table>
        <TableHeader>
          <TableRow className='border-b border-gray-200'>
            <TableHead>Название заправки</TableHead>
            <TableHead>Остаточный газ</TableHead>
            <TableHead>День последней оплаты</TableHead>
            <TableHead className="w-[50px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {gasStations.map((station) => (
            <TableRow key={station.id}  className='border-b border-gray-200'>
              <TableCell className='px-5'>{station.name}</TableCell>
              <TableCell className='px-5'>{station.remainingGas}</TableCell>
              <TableCell className='px-5'>{station.lastPaymentDate}</TableCell>
              <TableCell className='px-5'>
                <Link href={`/warehouse/oil-info?id=${station?.id}`}>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Pencil className="h-4 w-4" />
                </Button></Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

