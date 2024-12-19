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
  name: string;
  number: string;
}

export default function EmployeesTable() {
  const [cars] = useState<GasStation[]>([
        { id: "1", name: "Eddie Broke", number: "+998883453435",},
        { id: "1", name: "Eddie Broke", number: "+998883453435",},
        { id: "1", name: "Eddie Broke", number: "+998883453435",},
        { id: "1", name: "Eddie Broke", number: "+998883453435",},
  ]
  );


  return (
    <div className="w-full container mx-auto bg-white rounded-2xl min-h-screen">
      <Table>
        <TableHeader className="font-bold">
          <TableRow className="border-b border-gray-200">
            <TableHead className="font-bold p-5">Имя сотрудника</TableHead>
            <TableHead className="font-bold">Номер телефона.</TableHead>
            <TableHead className="font-bold w-[50px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {cars.map((employee, index) => (
            <TableRow key={index} className="border-b border-gray-200">
              <TableCell className="px-5">{employee.name}</TableCell>
              <TableCell className="px-5">{employee.number}</TableCell>
              <TableCell className="px-5">
                <Link href={`/employees/employee-info?id=${employee?.id}`}>
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
