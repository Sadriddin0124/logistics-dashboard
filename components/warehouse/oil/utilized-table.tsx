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
import { useQuery } from "@tanstack/react-query";
import { queryClient } from "@/components/ui-items/ReactQueryProvider";
import { OilUtilizedResponse } from "@/lib/types/oil.types";
import { fetchUtilizedOils } from "@/lib/actions/oil.action";
import { splitToHundreds } from "@/lib/utils";
import { formatDate } from "@/lib/functions";

export default function UtilizedOilTable() {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const { data: utilized } = useQuery<OilUtilizedResponse>({
    queryKey: ["oil_utilized", currentPage],
    queryFn: () => fetchUtilizedOils(currentPage),
  });
  useEffect(() => {
    queryClient.prefetchQuery({
      queryKey: ["oil_utilized", currentPage + 1],
      queryFn: () => fetchUtilizedOils(currentPage + 1),
    });
  }, [currentPage,]);

  const itemsPerPage = 30;
  const indexOfLastOrder = currentPage * itemsPerPage;
  const indexOfFirstOrder = (currentPage - 1) * itemsPerPage;

  const totalPages = Math.ceil((utilized?.count as number) / itemsPerPage);

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
    <div className="w-full mx-auto bg-white p-8 rounded-2xl min-h-[50vh]">
      <div className="mb-6">
        <h2 className="text-2xl font-medium">Отработанные масла</h2>
      </div>
      <Table>
        <TableHeader className="font-bold">
          <TableRow className="border-b border-gray-200">
            <TableHead className="font-bold">T/R</TableHead>
            <TableHead className="font-bold">Оплаченная сумма</TableHead>
            <TableHead className="font-bold">Количество</TableHead>
            <TableHead className="font-bold">Дата</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {utilized?.results?.map((utilized, index) => (
            <TableRow key={utilized.id} className="border-b border-gray-200">
              <TableCell>{index + 1}</TableCell>
              <TableCell>
                {splitToHundreds(Number(utilized.price_uzs))} $
              </TableCell>
              <TableCell>{utilized?.quantity_utilized} литр</TableCell>
              <TableCell>
                {formatDate(utilized.created_at as string, "/")}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="mt-4 flex justify-between items-center">
        <div>
        Итого: {utilized?.count} с {indexOfFirstOrder + 1} до {Math.min(indexOfLastOrder, utilized?.count as number) || 0}

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
