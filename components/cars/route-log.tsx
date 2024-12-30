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
import { PaginatedRouteLog } from "@/lib/types/cars.types";
import { Button } from "../ui/button";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchAutoRoute } from "@/lib/actions/cars.action";
import { queryClient } from "../ui-items/ReactQueryProvider";
import { formatDate } from "@/lib/functions";

export function RouteLog() {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const id = useRouter()?.query.id;
  const { data: routeLog } = useQuery<PaginatedRouteLog>({
    queryKey: ["route-log", currentPage, id],
    queryFn: () => fetchAutoRoute(id as string, currentPage),
    enabled: !!id,
  });
  useEffect(() => {
    queryClient.prefetchQuery({
      queryKey: ["route-log", id, currentPage + 1],
      queryFn: () => fetchAutoRoute(id as string, currentPage + 1),
    });
  }, [currentPage, id]);

  const itemsPerPage = 10;
  const indexOfLastOrder = currentPage * itemsPerPage;
  const indexOfFirstOrder = (currentPage - 1) * itemsPerPage;

  const totalPages = Math.ceil((routeLog?.count as number) / itemsPerPage);

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
          <TableRow className="border-b-gray-300 border-b">
            <TableHead className="font-bold">ID рейса</TableHead>
            <TableHead className="font-bold">Шофёр</TableHead>
            <TableHead className="font-bold">Цена</TableHead>
            <TableHead className="font-bold">Дата отправления</TableHead>
            <TableHead className="font-bold">Дата приезда</TableHead>
            <TableHead className="font-bold">Груз</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {routeLog?.results.map((route, i) => (
            <TableRow key={i} className="border-b-gray-300 border-b">
              <TableCell>{i + 1}</TableCell>
              <TableCell>{route?.driver?.full_name}</TableCell>
              <TableCell>
                {Number(route.price_uzs).toFixed(2)} $
              </TableCell>
              <TableCell>{formatDate(route?.departure_date as string, "/")}</TableCell>
              <TableCell>{formatDate(route?.arrival_date as string, "/")}</TableCell>
              <TableCell><p className="line-clamp-1 overflow-hidden">{route.cargo_info}</p></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="mt-4 flex justify-between items-center">
        <div>
        Итого: {routeLog?.count || 0} с {indexOfFirstOrder + 1} до{" "}
        {Math.min(indexOfLastOrder, routeLog?.count as number) || 0}
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
