
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
  id?: number;
  name: string;
  remainingGas: string;
  lastPaymentDate: string;
}

export default function GasTable() {
  const [gasStations] = useState<GasStation[]>([
    {
      id: 1,
      name: "Inter",
      remainingGas: "3564",
      lastPaymentDate: "12.12.2024",
    },
    {
      id: 2,
      name: "Inter",
      remainingGas: "3564",
      lastPaymentDate: "12.12.2024",
    },
    {
      id: 3,
      name: "Inter",
      remainingGas: "3564",
      lastPaymentDate: "12.12.2024",
    },
    {
      id: 4,
      name: "Inter",
      remainingGas: "3564",
      lastPaymentDate: "12.12.2024",
    },
  ]);


  return (
    <div className="w-full mx-auto bg-white rounded-2xl min-h-screen">
      <Table>
        <TableHeader className="font-bold">
          <TableRow className="border-b border-gray-200">
            <TableHead className="font-bold p-5">Название Масло</TableHead>
            <TableHead className="font-bold">Остаточный масло (литр)</TableHead>
            <TableHead className="font-bold">День последней покупки</TableHead>
            <TableHead className="font-bold w-[50px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {gasStations.map((station) => (
            <TableRow key={station.id} className="border-b border-gray-200">
              <TableCell className="px-5">{station.name}</TableCell>
              <TableCell className="px-5">{station.remainingGas}</TableCell>
              <TableCell className="px-5">{station.lastPaymentDate}</TableCell>
              <TableCell className="px-5">
                <Link href={`/warehouse/oil/oil-info?id=${station?.id}`}>
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
