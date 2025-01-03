"use client"; // Ensures the component is rendered client-side

import * as React from "react";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Label } from "../ui/label";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import CurrencyInputWithSelect from "../ui-items/currencySelect";

interface DeleteAlertDialogProps {
  onDelete: (value: number) => void; // The function to delete an item using its id
  title?: string; // Optional title for the confirmation dialog
  description?: string;
}

export function DeleteCars({
  onDelete,
  title = "Введите цену, чтобы отключить машину?", // Default title
  description = "Это действие невозможно отменить. Это приведет к безвозвратному удалению элемента и его удалению с наших серверов.", // Default description
}: DeleteAlertDialogProps) {
  const methods = useForm<{ id: string, value_uzs: number }>();
  const {
    handleSubmit,
    formState: { errors },
  } = methods;
  const handleDelete: SubmitHandler<{ value_uzs: number; }> = (data) => {
    onDelete(data?.value_uzs)
    console.log(data);
    
  }
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button className="bg-[#4880FF] text-white hover:bg-blue-600 w-[200px]">
          Продат автомобил
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(handleDelete)} className="space-y-6">
            <AlertDialogHeader>
              <AlertDialogTitle>{title}</AlertDialogTitle>
              <AlertDialogDescription>{description}</AlertDialogDescription>
            </AlertDialogHeader>
            <div>
              <Label>Сумма</Label>
              <CurrencyInputWithSelect name="value" />
              {errors?.value_uzs && (
                <p className="text-red-500">{errors?.value_uzs?.message}</p>
              )}
            </div>
            <AlertDialogFooter>
              <AlertDialogCancel>Назад</AlertDialogCancel>
              <Button type="submit" className="bg-[#4880FF] text-white hover:bg-blue-600 w-[200px]">
                Продат автомобил
              </Button>
            </AlertDialogFooter>
          </form>
        </FormProvider>
      </AlertDialogContent>
    </AlertDialog>
  );
}
