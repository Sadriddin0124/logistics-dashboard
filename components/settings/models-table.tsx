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
import CreateModel from "./model-create-modal";
import { deleteModel, fetchModels } from "@/lib/actions/cars.action";
import { IModel, ModelListResponse } from "@/lib/types/cars.types";
import { DeleteAlertDialog } from "../ui-items/delete-dialog";
import { toast } from "react-toastify";

export default function ModelsTable() {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isOpen, setIsOpen] = useState(false)
  const [editItem, setEditItem] = useState<null | IModel>(null)
  const { data:  models} = useQuery<ModelListResponse>({
    queryKey: ["models", currentPage],
    queryFn: () => fetchModels(currentPage),
  });
  useEffect(() => {
    queryClient.prefetchQuery({
      queryKey: ["models", currentPage + 1],
      queryFn: () => fetchModels(currentPage + 1),
    });
  }, [currentPage]);

  const itemsPerPage = 10;
  const indexOfLastOrder = currentPage * itemsPerPage;
  const indexOfFirstOrder = (currentPage - 1) * itemsPerPage;

  const totalPages = Math.ceil((models?.count as number) / itemsPerPage);

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
  const handleEdit = (item: IModel) => {
    setEditItem(item)
    setIsOpen(true)
  }
  const { mutate: deleteMutation } = useMutation({
    mutationFn: deleteModel,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["models"] });
      toast.success(" Сохранено успешно!");
    },
    onError: () => {
      toast.error("ni qo'shishda xatolik!");
    },
  });
  const handleDelete = (id: string) => {
    deleteMutation(id)
  }
  return (
    <div className="w-full mx-auto min-h-[50vh]">
      <div className="w-full flex justify-between items-center">
        <h2 className="text-2xl font-medium">Марки автомобилей</h2>
        <CreateModel isOpen={isOpen} setIsOpen={setIsOpen} editItem={editItem} setEditItem={setEditItem}/>
      </div>
      <Table>
        <TableHeader className="font-bold">
          <TableRow className="border-b border-gray-200">
            <TableHead className="font-bold"></TableHead>
            <TableHead className="font-bold">Имя</TableHead>
            <TableHead className="font-bold w-[50px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {models?.results?.map((model, index) => (
            <TableRow key={model.id} className="border-b border-gray-200">
              <TableCell>{index + 1}</TableCell>
              <TableCell>
                {model?.name}
              </TableCell>
              <TableCell className="flex gap-1 items-center">
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={()=> handleEdit(model)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <DeleteAlertDialog id={model?.id as string} onDelete={handleDelete} type="small"/>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="mt-4 flex justify-between items-center">
        <div>
        Итого: {models?.count || 0} с {indexOfFirstOrder + 1} до{" "}
        {Math.min(indexOfLastOrder, models?.count as number) || 0}
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
