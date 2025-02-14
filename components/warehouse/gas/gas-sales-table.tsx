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
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { fetchStationSales } from "@/lib/actions/gas.action";
import { useQuery } from "@tanstack/react-query";
import { SoldGasListResponse } from "@/lib/types/gas_station.types";
import { queryClient } from "@/components/ui-items/ReactQueryProvider";
import { useRouter } from "next/router";
import { formatDate } from "@/lib/functions";

export default function SalesGasTable() {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const id = useRouter()?.query.id;
  const { data: sales } = useQuery<SoldGasListResponse>({
    queryKey: ["sales", id],
    queryFn: () => fetchStationSales(id as string, currentPage),
    enabled: !!id,
  });
  useEffect(() => {
    queryClient.prefetchQuery({
      queryKey: ["sales", id, currentPage + 1],
      queryFn: () => fetchStationSales(id as string, currentPage + 1),
    });
  }, [currentPage, id]);

  const itemsPerPage = 30;
  const indexOfLastOrder = currentPage * itemsPerPage;
  const indexOfFirstOrder = (currentPage - 1) * itemsPerPage;

  const totalPages = Math.ceil((sales?.count as number) / itemsPerPage);

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
    <div className="w-full mx-auto bg-white p-8 rounded-2xl">
      <Table>
        <TableHeader className="font-bold">
          <TableRow className="border-b border-gray-200">
            <TableHead className="font-bold"></TableHead>
            <TableHead className="font-bold">Машина</TableHead>
            <TableHead className="font-bold">Название заправки</TableHead>
            <TableHead className="font-bold">Пройденный путь</TableHead>
            <TableHead className="font-bold">Дата</TableHead>
            <TableHead className="font-bold">Количество</TableHead>
            <TableHead className="font-bold w-[50px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sales?.results?.map((sales, index) => (
            <TableRow key={sales.id} className="border-b border-gray-200">
              <TableCell>{index + 1}</TableCell>
              <TableCell>{sales?.car?.name}</TableCell>
              <TableCell>{sales?.station?.name}</TableCell>
              <TableCell>{sales?.km}</TableCell>
              <TableCell>{formatDate(sales?.created_at as string, "/")}</TableCell>
              <TableCell>{sales?.amount?.toFixed(2)} м3</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="mt-4 flex justify-between items-center">
        <div>
          Итого: {sales?.count} с {indexOfFirstOrder + 1} до {Math.min(indexOfLastOrder, sales?.count as number) || 0}
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
