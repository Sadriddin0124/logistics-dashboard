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
  number: string;
  brand: string;
  trailer_number: string;
}

export default function CarsTable() {
  const [cars] = useState<GasStation[]>([
        { name: "Toyota Camry", number: "AB123CD", trailer_number: "TR4567", brand: "Toyota" },
        { name: "Honda Civic", number: "EF234GH", trailer_number: "TR8910", brand: "Honda" },
        { name: "Tesla Model 3", number: "IJ345KL", trailer_number: "TR1122", brand: "Tesla" },
        { name: "Ford Mustang", number: "MN456OP", trailer_number: "TR3344", brand: "Ford" },
  ]
  );


  return (
    <div className="w-full container mx-auto bg-white rounded-2xl min-h-screen">
      <Table>
        <TableHeader>
          <TableRow className="border-b border-gray-200">
            <TableHead className="p-5">Название автомобиля</TableHead>
            <TableHead>Номер автомобиля</TableHead>
            <TableHead>Номер прецепта</TableHead>
            <TableHead>Марка автомобиля</TableHead>
            <TableHead className="w-[50px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {cars.map((car, index) => (
            <TableRow key={index} className="border-b border-gray-200">
              <TableCell className="px-5">{car.name}</TableCell>
              <TableCell className="px-5">{car.number}</TableCell>
              <TableCell className="px-5">{car.trailer_number}</TableCell>
              <TableCell className="px-5">{car.brand}</TableCell>
              <TableCell className="px-5">
                <Link href={`/cars/car-info?id=${car?.id}`}>
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
