"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { queryClient } from "../ui-items/ReactQueryProvider";
import { toast } from "react-toastify";
import { deleteAutoDetail } from "@/lib/actions/cars.action";
import { FormProvider, useForm } from "react-hook-form";
import CurrencyInputWithSelect from "../ui-items/currencySelect";
import { removeCommas } from "@/lib/utils";

interface DeleteDialogProps {
  id: string[]; // The ids of the items to delete
  title?: string; // Optional title for the confirmation dialog
  description?: string; // Optional description for the confirmation dialog
}

export interface IDeleteDetailType {
  id: string[]; // ID of the item being deleted
  sell_price?: number | string;
  sell_price_uzs: number;
  sell_price_type: string;
}

export function AutoPartsDelete({
  id,
  title = "Вы абсолютно уверены?",
  description = "Это действие невозможно отменить. Это приведет к безвозвратному удалению элемента и его удалению с наших серверов.",
}: DeleteDialogProps) {
  const methods = useForm<IDeleteDetailType>();
  const [open, setOpen] = React.useState(false)
  // Mutation for deleting auto parts
  const { mutate: deleteMutation } = useMutation({
    mutationFn: deleteAutoDetail,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["details"] });
      toast.success("Удаление выполнено успешно!");
      setOpen(false)
    },
    onError: () => {
      toast.error("Ошибка при удалении!");
    },
  });

  // Handle delete form submission
  const onDelete = (data: IDeleteDetailType) => {
    const payload = {
      ...data,
      sell_price: Number(removeCommas(data?.sell_price as string)),
      id: id,
    };
    deleteMutation(payload); // Pass the mapped payload to the mutation
  };

  return (
    <Dialog open={open} onOpenChange={()=>setOpen(!open)}>
      {/* Trigger for opening the confirmation dialog */}
      <DialogTrigger asChild>
        <Button className="bg-[#4880FF] text-white hover:bg-blue-600 w-[300px] rounded-md">
          Утилизировать запчасть
        </Button>
      </DialogTrigger>

      {/* The actual dialog content */}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <FormProvider {...methods}>
          <form
            onSubmit={methods.handleSubmit(onDelete)}
            className="flex flex-col gap-4"
          >
            <div>
              <label htmlFor="sell_price" className="block text-sm font-medium">
                Сумма
              </label>
              <CurrencyInputWithSelect name="sell_price" />
            </div>
            <Button
              type="submit"
              disabled={id.length > 0 ? false : true}
              className="bg-blue-500 text-white hover:bg-blue-600 w-full rounded-md"
            >
              Утилизировать
            </Button>
          </form>
        </FormProvider>
        <DialogFooter>
          <DialogTrigger>Назад</DialogTrigger>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
