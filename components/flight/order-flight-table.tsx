"use client";

import { Dispatch, SetStateAction, useEffect, useState } from "react";
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
import { fetchOrderedFlights } from "@/lib/actions/flight.action";
import { useQuery } from "@tanstack/react-query";
import { queryClient } from "../ui-items/ReactQueryProvider";
import { FlightPaginatedResponse } from "@/lib/types/flight.types";

export default function OrderedFlightTable({
  active,
  setActive,
}: {
  active: string;
  setActive: Dispatch<SetStateAction<string>>;
}) {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const { data: flights } = useQuery<FlightPaginatedResponse>({
    queryKey: ["ordered-flights", currentPage],
    queryFn: () => fetchOrderedFlights(currentPage),
  });
  useEffect(() => {
    queryClient.prefetchQuery({
      queryKey: ["ordered-flights", currentPage + 1],
      queryFn: () => fetchOrderedFlights(currentPage + 1),
    });
  }, [currentPage]);

  const itemsPerPage = 10;
  const indexOfLastOrder = currentPage * itemsPerPage;
  const indexOfFirstOrder = (currentPage - 1) * itemsPerPage;

  const totalPages = Math.ceil((flights?.count as number) / itemsPerPage);

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
    <div className="w-full container mx-auto bg-white rounded-2xl min-h-screen">
      <Table>
        <TableHeader className="font-bold">
          <TableRow className="border-b border-gray-200">
            <TableHead className="font-bold p-5">ID рейса</TableHead>
            <TableHead className="font-bold">Номер автомобиля</TableHead>
            <TableHead className="font-bold">Статус</TableHead>
            <TableHead className="font-bold">Расходы водителя</TableHead>
            <TableHead className="font-bold w-[50px]">
              <div className="flex items-center">
                <Button
                  size={"sm"}
                  variant={"ghost"}
                  disabled={active !== "flight" ? true : false}
                  onClick={() => setActive("ordered")}
                >
                  Заказной
                </Button>
                <Button
                  size={"sm"}
                  variant={"ghost"}
                  disabled={active !== "ordered" ? true : false}
                  onClick={() => setActive("flight")}
                >
                  Обычный
                </Button>
              </div>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {flights?.results.map((flight, index) => (
            <TableRow key={index} className="border-b border-gray-200">
              <TableCell className="px-5">{index + 1}</TableCell>
              <TableCell className="px-5">{flight?.car_number}</TableCell>
              <TableCell className="px-5">{flight?.status}</TableCell>
              <TableCell className="px-5">
                {Number(flight?.driver_expenses_uzs).toFixed(2)} $
              </TableCell>
              <TableCell className="px-5">
                <Link href={`/flight/order-info?id=${flight?.id}`}>
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
        Итого: {flights?.count || 0} с {indexOfFirstOrder + 1} до {Math.min(indexOfLastOrder, flights?.count as number) || 0}
        </div>
        <div className="flex space-x-2 items-center">
          <Button
            variant="outline"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="w-10 h-10 p-0"
          >
            <ChevronLeftIcon className="w-4 h-4" />
            <span className="sr-only">Previous page</span>
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
            <span className="sr-only">Next page</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
