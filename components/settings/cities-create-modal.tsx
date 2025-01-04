"use client";

import { Dispatch, SetStateAction, useEffect } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
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
import CurrencyInputWithSelect from "../ui-items/currencySelect";
import { removeCommas } from "@/lib/utils";

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
  const methods = useForm<IRegion>();
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = methods;
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
      updateMutation({
        ...data,
        been_driver_expenses:
        typeof data?.been_driver_expenses === "string"
          ? Number(removeCommas(data?.been_driver_expenses as string))
          : data?.been_driver_expenses,
        gone_driver_expenses:
        typeof data?.gone_driver_expenses === "string"
          ? Number(removeCommas(data?.gone_driver_expenses as string))
          : data?.gone_driver_expenses,
        been_flight_price:
        typeof data?.been_flight_price === "string"
          ? Number(removeCommas(data?.been_flight_price as string))
          : data?.been_driver_expenses,
        gone_flight_price:
        typeof data?.gone_flight_price === "string"
          ? Number(removeCommas(data?.gone_flight_price as string))
          : data?.gone_flight_price,
        route: "BEEN_TO"
      });
    } else {
      createMutation({
        ...data,
        been_driver_expenses:
        typeof data?.been_driver_expenses === "string"
          ? Number(removeCommas(data?.been_driver_expenses as string))
          : data?.been_driver_expenses,
        gone_driver_expenses:
        typeof data?.gone_driver_expenses === "string"
          ? Number(removeCommas(data?.gone_driver_expenses as string))
          : data?.gone_driver_expenses,
        been_flight_price:
        typeof data?.been_flight_price === "string"
          ? Number(removeCommas(data?.been_flight_price as string))
          : data?.been_driver_expenses,
        gone_flight_price:
        typeof data?.gone_flight_price === "string"
          ? Number(removeCommas(data?.gone_flight_price as string))
          : data?.gone_flight_price,
        route: "BEEN_TO"
      });
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
        <DialogContent className="sm:max-w-[600px]">
          <FormProvider {...methods}>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-col justify-start gap-4"
            >
              {/* <div>
                <Label htmlFor="flight_type">Маршрут*</Label>
                <Controller
                  name="route"
                  control={control}
                  rules={{ required: "Поле обязательно для заполнения." }}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Выберите..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={"GONE_TO"}>Туда</SelectItem>
                        <SelectItem value={"BEEN_TO"}>
                          Туда и обратно
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />{" "}
              </div> */}
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
                  <div>
                    <Label htmlFor="name">Расходы водителя (Туда и обратно)</Label>
                    <CurrencyInputWithSelect
                      name="been_driver_expenses"
                      type={editItem?.been_driver_expenses_type}
                    />
                    {errors.been_driver_expenses && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.been_driver_expenses.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="name">Стоимость рейса (Туда и обратно)</Label>
                    <CurrencyInputWithSelect
                      name="been_flight_price"
                      type={editItem?.been_flight_price_type}
                    />
                    {errors.been_flight_price && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.been_flight_price.message}
                      </p>
                    )}
                  </div>
                </div>
                <div>
                  <div>
                    <Label htmlFor="name">Расходы водителя (Туда)</Label>
                    <CurrencyInputWithSelect
                      name="gone_driver_expenses"
                      type={editItem?.gone_driver_expenses_type}
                    />
                    {errors.gone_driver_expenses && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.gone_driver_expenses.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="name">Стоимость рейса (Туда)</Label>
                    <CurrencyInputWithSelect
                      name="gone_flight_price"
                      type={editItem?.gone_flight_price_type}
                    />
                    {errors.gone_flight_price && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.gone_flight_price.message}
                      </p>
                    )}
                  </div>
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
                className="bg-[#4880FF] text-white hover:bg-blue-600 self-end"
              >
                Сохранять
              </Button>
            </form>
          </FormProvider>
        </DialogContent>
      </Dialog>
    </div>
  );
}
