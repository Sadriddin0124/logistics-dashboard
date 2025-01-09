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
import { Archive, ArchiveRestore, ChevronLeftIcon, ChevronRightIcon, Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
import { archiveOrderedFlight, deleteOrderedFlight, fetchOrderedFlights } from "@/lib/actions/flight.action";
import { useMutation, useQuery } from "@tanstack/react-query";
import { queryClient } from "../ui-items/ReactQueryProvider";
import { FlightPaginatedResponse } from "@/lib/types/flight.types";
import { toast } from "react-toastify";
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog";

export default function OrderedFlightTable({
  active,
  setActive,
  isArchived
}: {
  active: string;
  setActive: Dispatch<SetStateAction<string>>;
  isArchived: boolean
}) {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const { data: flights } = useQuery<FlightPaginatedResponse>({
    queryKey: ["ordered-flights", isArchived, currentPage],
    queryFn: () => fetchOrderedFlights(isArchived, currentPage),
  });
  useEffect(() => {
    queryClient.prefetchQuery({
      queryKey: ["ordered-flights", isArchived, currentPage + 1],
      queryFn: () => fetchOrderedFlights(isArchived, currentPage + 1),
    });
  }, [isArchived, currentPage]);

  const itemsPerPage = 30;
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

  const { mutate: archiveMutation } = useMutation({
    mutationFn: archiveOrderedFlight,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ordered-flights"] });
      toast.success(" Сохранено успешно!");
    },
    onError: () => {
      toast.error("Ошибка сохранения!");
    },
  });

  const handleArchive = (id: string) => {
    archiveMutation({ id, is_archived: !isArchived });
  };

  const { mutate: deleteMutation } = useMutation({
    mutationFn: deleteOrderedFlight,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ordered-flights"] });
      toast.success(" Сохранено успешно!");
    },
    onError: () => {
      toast.error("Ошибка сохранения!");
    },
  });

  const handleDelete = (id: string) => {
    deleteMutation(id); 
  };
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
              <TableCell className="px-5">{flight?.status.toLowerCase() === "active" ? "Активный" : "Завершенный"}</TableCell>
              <TableCell className="px-5">
                {Number(flight?.driver_expenses_uzs).toFixed(2)} $
              </TableCell>
              <TableCell className="px-5">
                <Link href={`/flight/order-info?id=${flight?.id}`}>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Pencil className="h-4 w-4" />
                  </Button>
                  </Link>
                 <Button
                    variant={"ghost"}
                    size={"icon"}
                    onClick={() => handleArchive(flight?.id || "")}
                  >
                    {isArchived ? <ArchiveRestore /> : <Archive />}
                  </Button>
                {flight?.status.toLowerCase() === "inactive" && isArchived && (
                  <Dialog>
                    <DialogTrigger>
                      <Button variant={"ghost"} size={"icon"}>
                        <Trash2 className="text-red-500" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <h3 className="my-3 text-lg">Вы уверены, что хотите удалить этот рейс?</h3>
                      <DialogTrigger className="flex justify-end gap-3">
                        <Button variant={"outline"}>Отмена</Button>
                        <Button
                          onClick={() => handleDelete(flight?.id || "")}
                          className="bg-[#4880FF] text-white hover:bg-blue-600 rounded-md"
                        >
                          Удалить 
                        </Button>
                      </DialogTrigger>
                    </DialogContent>
                  </Dialog>
                )}
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
