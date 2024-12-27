"use client";

import { useEffect, useState } from "react";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ChevronLeftIcon, ChevronRightIcon, Pencil } from "lucide-react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { fetchCar } from "@/lib/actions/cars.action";
import { CarListResponse } from "@/lib/types/cars.types";
import { queryClient } from "../ui-items/ReactQueryProvider";
import { fuelChange } from "@/lib/functions";

export default function CarsTable() {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const { data: carsList } = useQuery<CarListResponse>({
    queryKey: ["cars", currentPage],
    queryFn: () => fetchCar(currentPage),
  });

  useEffect(() => {
    queryClient.prefetchQuery({
      queryKey: ["cars", currentPage + 1],
      queryFn: () => fetchCar(currentPage + 1),
    });
  }, [currentPage]);

  const itemsPerPage = 10;
  const indexOfLastOrder = currentPage * itemsPerPage;
  const indexOfFirstOrder = (currentPage - 1) * itemsPerPage;

  const totalPages = Math.ceil((carsList?.count as number) / itemsPerPage);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const getPaginationButtons = () => {
    const buttons: (number | string)[] = [];
    if (totalPages <= 1) return buttons;
    buttons.push(1);
    if (currentPage > 3) {
      buttons.push("...");
    }
    for (
      let i = Math.max(2, currentPage - 1);
      i <= Math.min(totalPages - 1, currentPage + 1);
      i++
    ) {
      buttons.push(i);
    }
    if (currentPage < totalPages - 2) {
      buttons.push("...");
    }
    buttons.push(totalPages);
    return buttons;
  };

  const buttons = getPaginationButtons();

  return (
    <div className="w-full container mx-auto bg-white p-8 rounded-2xl min-h-screen">
      <Table>
        <TableHeader className="font-bold">
          <TableRow className="border-b border-gray-200">
            <TableHead className="font-bold p-5">Название автомобиля</TableHead>
            <TableHead className="font-bold">Номер автомобиля</TableHead>
            <TableHead className="font-bold">Номер прицепа</TableHead>
            <TableHead className="font-bold">Марка автомобиля</TableHead>
            <TableHead className="font-bold">Тип топлива</TableHead>
            <TableHead className="font-bold w-[50px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {carsList?.results?.map((car, index) => (
            <TableRow key={index} className="border-b border-gray-200">
              <TableCell className="px-5">{car.name}</TableCell>
              <TableCell className="px-5">{car.number}</TableCell>
              <TableCell className="px-5">{car.trailer_number}</TableCell>
              <TableCell className="px-5">{car.models?.name}</TableCell>
              <TableCell className="px-5">{fuelChange(car?.fuel_type)}</TableCell>
              <TableCell className="px-5 flex gap-1 items-center">
                <Link href={`/cars/car-info?id=${car?.id}`}>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Pencil className="h-4 w-4" />
                  </Button>
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="mt-4 flex justify-between items-center">
        <div>
          Итого: {carsList?.count || 0} с {indexOfFirstOrder + 1} до{" "}
          {Math.min(indexOfLastOrder, carsList?.count as number) || 0}
        </div>
        <div className="flex space-x-2 items-center">
          <Button
            variant="outline"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="w-10 h-10 p-0"
          >
            <ChevronLeftIcon className="w-4 h-4" />
            <span className="sr-only">Предыдущая страница</span>
          </Button>
          {buttons.map((button, index) =>
            button === "..." ? (
              <span key={index} style={{ margin: "0 5px" }}>
                ...
              </span>
            ) : (
              <Button
                key={index}
                onClick={() => handlePageChange(button as number)}
                disabled={button === currentPage}
                className={
                  button === currentPage ? "bg-[#4880FF] text-white" : "border"
                }
                variant={button === currentPage ? "default" : "ghost"}
              >
                {button || ""}
              </Button>
            )
          )}
          <Button
            variant="outline"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="w-10 h-10 p-0"
          >
            <ChevronRightIcon className="w-4 h-4" />
            <span className="sr-only">Следующая страница</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
