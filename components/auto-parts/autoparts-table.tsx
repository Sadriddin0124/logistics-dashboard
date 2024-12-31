"use client";

import * as React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { fetchAllAutoDetails } from "@/lib/actions/cars.action";
import { useQuery } from "@tanstack/react-query";
import { queryClient } from "../ui-items/ReactQueryProvider";
import { PaginatedCarDetail } from "@/lib/types/cars.types";
import { Button } from "../ui/button";

export default function AutoPartsTable({ setSelectedParts, selectedParts, status }: { setSelectedParts: React.Dispatch<React.SetStateAction<string[]>>, selectedParts: string[], status: string }) {
  const [currentPage, setCurrentPage] = React.useState<number>(1);
  const { data: detailList } = useQuery<PaginatedCarDetail>({
    queryKey: ["details", status, currentPage],
    queryFn: () => fetchAllAutoDetails(status, currentPage),
  });

  React.useEffect(() => {
    queryClient.prefetchQuery({
      queryKey: ["details", status, currentPage + 1],
      queryFn: () => fetchAllAutoDetails(status, currentPage + 1),
    });
  }, [status, currentPage]);

  const itemsPerPage = 30;
  const indexOfLastOrder = currentPage * itemsPerPage;
  const indexOfFirstOrder = (currentPage - 1) * itemsPerPage;

  const totalPages = Math.ceil((detailList?.count as number) / itemsPerPage);

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
    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
      buttons.push(i);
    }
    if (currentPage < totalPages - 2) {
      buttons.push("...");
    }
    buttons.push(totalPages);
    return buttons;
  };
  const buttons = getPaginationButtons();

  const togglePart = (partId: string) => {
    setSelectedParts((current) =>
      current.includes(partId)
        ? current.filter((id) => id !== partId)
        : [...current, partId]
    );
  };

  return (
    <div className="w-full">
      <Table>
        <TableHeader>
          <TableRow className="border-b border-b-gray-200">
            <TableHead className="w-12">
              {/* <Checkbox 
                checked={selectedParts.length === initialData.length}
                onCheckedChange={toggleAll}
              /> */}
            </TableHead>
            <TableHead>Название автозапчасти</TableHead>
            <TableHead>Машина</TableHead>
            <TableHead>Цена автозапчасти</TableHead>
            <TableHead>Местоположение</TableHead>
            <TableHead>Статус</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {detailList?.results?.map((part) => (
            <TableRow key={part.id} className="border-b border-b-gray-200">
              <TableCell>
                <Checkbox
                  checked={selectedParts.includes(part?.id as string)}
                  onCheckedChange={() => togglePart(part?.id as string)}
                />
              </TableCell>
              <TableCell>{part.name}</TableCell>
              <TableCell>{part.car?.name}</TableCell>
              <TableCell>{part?.price_uzs.toFixed(2)} $</TableCell>
              <TableCell>{part?.id_detail}</TableCell>
              <TableCell>{part?.in_sklad ? "В Склате" : "Не в машине"}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="mt-4 flex justify-between items-center">
        <div>
          Итого: {detailList?.count} с {indexOfFirstOrder + 1} до{" "}
          {Math.min(indexOfLastOrder, detailList?.count as number)}
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
                className={button === currentPage ? "bg-[#4880FF] text-white" : "border"}
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
