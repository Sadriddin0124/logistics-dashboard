"use client";

import { useState } from "react";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import Link from "next/link";

interface GasStation {
  id?: string;
  number: string;
  status: string;
  price: string;
}

export default function FlightTable() {
  const [cars] = useState<GasStation[]>([
        {
            id: "1",
            number: "01A111AA",
            status: "В процессе",
            price: "$3000"
        },
        {
            id: "2",
            number: "01A111AA",
            status: "В процессе",
            price: "$3000"
        },
        {
            id: "3",
            number: "01A111AA",
            status: "В процессе",
            price: "$3000"
        },
        {
            id: "4",
            number: "01A111AA",
            status: "В процессе",
            price: "$3000"
        },
  ]
  );


  return (
    <div className="w-full container mx-auto bg-white rounded-2xl min-h-screen">
      <Table>
        <TableHeader className="font-bold">
          <TableRow className="border-b border-gray-200">
            <TableHead className="font-bold p-5">ID рейса</TableHead>
            <TableHead className="font-bold">Номер автомобиля</TableHead>
            <TableHead className="font-bold">Статус</TableHead>
            <TableHead className="font-bold">Цена рейса</TableHead>
            <TableHead className="font-bold w-[50px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {cars.map((flight, index) => (
            <TableRow key={index} className="border-b border-gray-200">
              <TableCell className="px-5">{flight.id}</TableCell>
              <TableCell className="px-5">{flight.number}</TableCell>
              <TableCell className="px-5">{flight.status}</TableCell>
              <TableCell className="px-5">{flight.price}</TableCell>
              <TableCell className="px-5">
                <Link href={`/flight/flight-info?id=${flight?.id}`}>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      </div>
  );
}
