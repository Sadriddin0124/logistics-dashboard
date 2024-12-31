import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { IDieselPaginated } from "@/lib/types/diesel.types";
import { fetchDieselSale } from "@/lib/actions/diesel.action";
import { queryClient } from "@/components/ui-items/ReactQueryProvider";
import { useQuery } from "@tanstack/react-query";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { formatDate } from "@/lib/functions";
const SaleDiesel = () => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const { data: diesel_sale, isLoading } = useQuery<IDieselPaginated>({
    queryKey: ["diesel_sale", currentPage],
    queryFn: () => fetchDieselSale(currentPage),
  });
  useEffect(() => {
    queryClient.prefetchQuery({
      queryKey: ["diesel_sale", currentPage + 1],
      queryFn: () => fetchDieselSale(currentPage + 1),
    });
  }, [currentPage]);

  const itemsPerPage = 30;
  const indexOfLastOrder = currentPage * itemsPerPage;
  const indexOfFirstOrder = (currentPage - 1) * itemsPerPage;

  const totalPages = Math.ceil((diesel_sale?.count as number) / itemsPerPage);

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
    <div>
      <Table>
        <TableHeader className="font-bold">
          <TableRow className="border-b border-b-gray-300">
            <TableHead className="font-bold">Машина</TableHead>
            <TableHead className="font-bold">Количество</TableHead>
            <TableHead className="font-bold">Дата</TableHead>
            <TableHead className="font-bold"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {!isLoading ? (
            diesel_sale?.results?.map((item, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">{item?.car?.name}</TableCell>
                <TableCell>{item?.volume}</TableCell>
                <TableCell>{formatDate(item?.created_at as string, "/")}</TableCell>
                <TableCell>
                  <Button
                    variant="secondary"
                    className="bg-red-100 hover:bg-red-200 text-red-600"
                  >
                    Наличи
                  </Button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            ""
          )}
        </TableBody>
      </Table>
      <div className="mt-4 flex justify-between items-center">
        <div>
        Итого: {diesel_sale?.count} с {indexOfFirstOrder + 1} до {Math.min(indexOfLastOrder, diesel_sale?.count as number) || 0}
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
};

export default SaleDiesel;
