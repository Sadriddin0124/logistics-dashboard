"use client";

import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { useRouter } from "next/router";
import { useQuery } from "@tanstack/react-query";
import { fetchAutoGas } from "@/lib/actions/cars.action";
import { queryClient } from "../ui-items/ReactQueryProvider";
import { PurchasedGasListResponse } from "@/lib/types/gas_station.types";
import { formatDate } from "@/lib/functions";

export function GasLog() {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const id = useRouter()?.query.id;
  const { data: purchased } = useQuery<PurchasedGasListResponse>({
    queryKey: ["car-gas", currentPage, id],
    queryFn: () => fetchAutoGas(id as string, currentPage),
    enabled: !!id,
  });
  
  useEffect(() => {
    queryClient.prefetchQuery({
      queryKey: ["car-gas", id, currentPage + 1],
      queryFn: () => fetchAutoGas(id as string, currentPage + 1),
    });
  }, [currentPage, id]);

  const itemsPerPage = 30;
  const indexOfLastOrder = currentPage * itemsPerPage;
  const indexOfFirstOrder = (currentPage - 1) * itemsPerPage;

  const totalPages = Math.ceil((purchased?.count as number) / itemsPerPage);

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
            <TableHead className="font-bold">Заправки</TableHead>
            <TableHead className="font-bold">Количество</TableHead>
            <TableHead className="font-bold">Пройденный путь</TableHead>
            {/* <TableHead className="font-bold">Использованный газ</TableHead> */}
            <TableHead className="font-bold">Дата</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {purchased?.results?.map((entry, i) => (
            <TableRow key={i} className="border-b-gray-300 border-b">
              <TableCell>{entry.station?.name || entry?.name}</TableCell>
              <TableCell>{entry?.amount || 0} м3</TableCell>
              <TableCell>{entry?.km || 0} км</TableCell>
              {/* <TableCell>{entry?.used_volume || 0} м3</TableCell> */}
              <TableCell>{formatDate(entry?.created_at as string, "/")}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="mt-4 flex justify-between items-center">
        <div>
          Итого: {purchased?.count || 0} с {indexOfFirstOrder + 1} до{" "}
          {Math.min(indexOfLastOrder, purchased?.count as number) || 0}
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
