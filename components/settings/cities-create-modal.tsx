"use client";

import { Dispatch, SetStateAction, useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { useMutation } from "@tanstack/react-query";
import { createRegion, updateRegion } from "@/lib/actions/region.action";
import { queryClient } from "../ui-items/ReactQueryProvider";
import { toast } from "react-toastify";
import { IRegion } from "@/lib/types/regions.types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

export default function CreateCityModal({
  isOpen,
  setIsOpen,
  editItem,
  setEditItem,
}: {
  editItem: null | IRegion;
  setEditItem: Dispatch<SetStateAction<null | IRegion>>;
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm<IRegion>();
  useEffect(() => {
    if (editItem) {
      reset(editItem);
    }
  }, [editItem, reset]);
  const { mutate: createMutation } = useMutation({
    mutationFn: createRegion,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["regions"] });
      toast.success(" Сохранено успешно!");
    },
    onError: () => {
      toast.error("Ошибка сохранения!");
    },
  });
  const { mutate: updateMutation } = useMutation({
    mutationFn: updateRegion,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["regions"] });
      toast.success(" Сохранено успешно!");
    },
    onError: () => {
      toast.error("Ошибка сохранения!");
    },
  });
  const onSubmit = (data: IRegion) => {
    if (editItem) {
      console.log(data);
      updateMutation(data);
    } else {
      createMutation(data);
    }
    setEditItem(null);
    setIsOpen(false);
    reset({
      name: "",
      flight_type: undefined,
    });
  };
  const handleClose = () => {
    reset({
      name: "",
      flight_type: undefined, // or the appropriate default value
    }); // Reset the form before updating state
    setEditItem(null);
    setIsOpen(!isOpen); // Ensure the modal closes
  };

  return (
    <div className="p-4">
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogTrigger asChild>
          <Button
            onClick={() => setIsOpen(true)}
            className="bg-[#4880FF] text-white hover:bg-blue-600"
          >
            Добавить регион
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Label htmlFor="name">Имя</Label>
              <Input
                id="name"
                {...register("name", { required: "Name is required" })}
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="flight_type">Тип области</Label>
              <Controller
                name="flight_type"
                control={control}
                rules={{ required: "Поле обязательно для заполнения." }}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Выберите..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="OUT">
                        За территории Узбекистана
                      </SelectItem>
                      <SelectItem value="IN_UZB">
                        На территории Узбекистана
                      </SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />{" "}
            </div>

            <Button
              type="submit"
              className="bg-[#4880FF] text-white hover:bg-blue-600"
            >
              Сохранять
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
