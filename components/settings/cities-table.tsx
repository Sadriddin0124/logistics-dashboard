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
import { useMutation, useQuery } from "@tanstack/react-query";
import { queryClient } from "@/components/ui-items/ReactQueryProvider";
import CreateCityModal from "./cities-create-modal";
import { deleteRegion, fetchRegions } from "@/lib/actions/region.action";
import { IRegion, IRegionResponse } from "@/lib/types/regions.types";
import { toast } from "react-toastify";
import { DeleteAlertDialog } from "../ui-items/delete-dialog";

export default function CitiesTable() {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isOpen, setIsOpen] = useState(false);
  const [editItem, setEditItem] = useState<null | IRegion>(null);
  const { data: regions } = useQuery<IRegionResponse>({
    queryKey: ["regions", currentPage],
    queryFn: () => fetchRegions(currentPage),
  });
  useEffect(() => {
    queryClient.prefetchQuery({
      queryKey: ["regions", currentPage + 1],
      queryFn: () => fetchRegions(currentPage + 1),
    });
  }, [currentPage]);

  const itemsPerPage = 10;
  const indexOfLastOrder = currentPage * itemsPerPage;
  const indexOfFirstOrder = (currentPage - 1) * itemsPerPage;

  const totalPages = Math.ceil((regions?.count as number) / itemsPerPage);

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
  const handleEdit = (item: IRegion) => {
    setEditItem(item);
    setIsOpen(true);
  };
  const { mutate: deleteMutation } = useMutation({
    mutationFn: deleteRegion,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["regions"] });
      // push(`/warehouse/oil/oil-info?id=${data?.id}`)
      toast.success(" muvaffaqiyatli qo'shildi!");
    },
    onError: () => {
      toast.error("ni qo'shishda xatolik!");
    },
  });
  const handleDelete = (id: string) => {
    deleteMutation(id);
  };
  return (
    <div className="w-full min-h-[50vh]">
      <div className="w-full flex justify-between items-center">
        <h2 className="text-2xl font-medium">Регионы</h2>
        <CreateCityModal
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          editItem={editItem}
          setEditItem={setEditItem}
        />
      </div>
      <Table>
        <TableHeader className="font-bold">
          <TableRow className="border-b border-gray-200">
            <TableHead className="font-bold"></TableHead>
            <TableHead className="font-bold">Имя</TableHead>
            <TableHead className="font-bold">Цена отправления</TableHead>
            <TableHead className="font-bold">Цена прибытия</TableHead>
            <TableHead className="font-bold w-[50px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {regions?.results?.map((region, index) => (
            <TableRow key={index} className="border-b border-gray-200">
              <TableCell>{index + 1}</TableCell>
              <TableCell>{region?.name}</TableCell>
              <TableCell>{region?.price1}</TableCell>
              <TableCell>{region?.price2}</TableCell>
              <TableCell className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => handleEdit(region)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <DeleteAlertDialog
                  onDelete={handleDelete}
                  id={region?.id as string}
                  type="small"
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="mt-4 flex justify-between items-center">
        <div>
        Итого: {regions?.count || 0} с {indexOfFirstOrder + 1} до{" "}
        {Math.min(indexOfLastOrder, regions?.count as number) || 0}
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
