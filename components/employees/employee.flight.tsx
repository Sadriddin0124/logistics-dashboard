"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
// import { Button } from "@/components/ui/button"
import { Button } from "../ui/button";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { queryClient } from "../ui-items/ReactQueryProvider";
import { fetchEmployeesFlight } from "@/lib/actions/employees.action";
import { PaginatedRouteLog } from "@/lib/types/cars.types";
import { formatDate } from "@/lib/functions";

export function EmployeeFlightTable() {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const id = useRouter()?.query.id;
  const { data: employeeFlight } = useQuery<PaginatedRouteLog>({
    queryKey: ["employee-flight", currentPage, id],
    queryFn: () => fetchEmployeesFlight(id as string, currentPage),
    enabled: !!id,
  });
  useEffect(() => {
    queryClient.prefetchQuery({
      queryKey: ["employee-flight", id, currentPage + 1],
      queryFn: () => fetchEmployeesFlight(id as string, currentPage + 1),
    });
  }, [currentPage, id]);

  const itemsPerPage = 10;
  const indexOfLastOrder = currentPage * itemsPerPage;
  const indexOfFirstOrder = (currentPage - 1) * itemsPerPage;

  const totalPages = Math.ceil(
    (employeeFlight?.count as number) / itemsPerPage
  );

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
    <div className="rounded-md border">
      <Table>
        <TableHeader className="font-bold">
          <TableRow className="border-b border-b-gray-200">
            <TableHead>Автомобиль</TableHead>
            <TableHead>Цена</TableHead>
            <TableHead>Дата отправления</TableHead>
            <TableHead>Дата приезда</TableHead>
            <TableHead>Груз</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {employeeFlight?.results.map((flight, i) => (
            <TableRow key={i} className="border-b-gray-300 border-b">
              <TableCell>{i + 1}</TableCell>
              <TableCell>{flight?.car?.name}</TableCell>
              <TableCell>{formatDate(flight?.departure_date as string, "/")}</TableCell>
              <TableCell>{formatDate(flight?.arrival_date as string, "/")}</TableCell>
              <TableCell>
                 {flight.price_uzs} $
              </TableCell>
              <TableCell>
                <p className="line-clamp-1 overflow-hidden">
                  {flight.cargo_info}
                </p>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="mt-4 flex justify-between items-center">
        <div>
        Итого: {employeeFlight?.count || 0} с {indexOfFirstOrder + 1} до{" "}
        {Math.min(indexOfLastOrder, employeeFlight?.count as number) || 0}
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
