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
import { fetchGasStation } from "@/lib/actions/gas.action";
import { useQuery } from "@tanstack/react-query";
import { GasListResponse } from "@/lib/types/gas_station.types";
import { queryClient } from "@/components/ui-items/ReactQueryProvider";
import { formatDate } from "@/lib/functions";

export default function GasTable() {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const { data: gasStations } = useQuery<GasListResponse>({
    queryKey: ["gas_stations", currentPage],
    queryFn: () => fetchGasStation(currentPage),
  });
  useEffect(() => {
    queryClient.prefetchQuery({
      queryKey: ["gas_stations", currentPage + 1],
      queryFn: () => fetchGasStation(currentPage + 1),
    });
  }, [currentPage]);

  const itemsPerPage = 30;
  const indexOfLastOrder = currentPage * itemsPerPage;
  const indexOfFirstOrder = (currentPage - 1) * itemsPerPage;

  const totalPages = Math.ceil((gasStations?.count as number) / itemsPerPage);

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
    <div className="w-full mx-auto bg-white p-8 rounded-2xl min-h-screen">
      <Table>
        <TableHeader className="font-bold">
          <TableRow className="border-b border-gray-200">
            <TableHead className="font-bold">T/R</TableHead>
            <TableHead className="font-bold">Название заправки</TableHead>
            <TableHead className="font-bold">Остаточный газ</TableHead>
            <TableHead className="font-bold">День последней оплаты</TableHead>
            <TableHead className="font-bold w-[50px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {gasStations?.results?.map((station, index) => (
            <TableRow key={station.id} className="border-b border-gray-200">
              <TableCell>{index + 1}</TableCell>
              <TableCell>{station.name}</TableCell>
              <TableCell>{station?.remaining_gas?.toFixed(2)}</TableCell>
              <TableCell>
                {formatDate(station?.updated_at as string, "/")}
              </TableCell>
              <TableCell>
                <Link href={`/warehouse/gas/gas-info?id=${station?.id}`}>
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
        Итого: {gasStations?.count} с  {indexOfFirstOrder + 1} до
          {Math.min(indexOfLastOrder, gasStations?.count as number) || 0}
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
