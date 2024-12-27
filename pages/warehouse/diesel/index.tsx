"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FormProvider, useForm } from "react-hook-form";
import Select, { SingleValue } from "react-select";
import { CurrencyInputs } from "@/components/ui-items/currency-inputs";
import {
  IDieselPaginated,
  IDieselType,
  IDieselTypeForPagination,
} from "@/lib/types/diesel.types";
import { useMutation, useQuery } from "@tanstack/react-query";
import { createDiesel, fetchDiesel } from "@/lib/actions/diesel.action";
import { queryClient } from "@/components/ui-items/ReactQueryProvider";
import { toast } from "react-toastify";
import { fetchCarNoPage } from "@/lib/actions/cars.action";
import { ICars } from "@/lib/types/cars.types";
import { removeCommas } from "@/lib/utils";
import PurchasedDiesel from "@/components/warehouse/diesel/purchased";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import TableSkeleton from "@/components/ui-items/SkeletonTable";


export interface Option {
  label: string;
  value: string;
}

export default function GasManagementForm() {
  const methods = useForm<IDieselType>();
  const { register, handleSubmit, setValue, reset } = methods;
  const [carOptions, setCarOptions] = useState<Option[]>([]);
  const [selectedCar, setSelectedCar] = useState<Option | null>(null);
  const { data: cars } = useQuery<ICars[]>({
    queryKey: ["cars"],
    queryFn: fetchCarNoPage,
  });
  const [currentPage, setCurrentPage] = useState<number>(1);
  const { data: diesel, isLoading } = useQuery<IDieselPaginated>({
    queryKey: ["diesel", currentPage],
    queryFn: () => fetchDiesel(currentPage),
  });
  useEffect(() => {
    queryClient.prefetchQuery({
      queryKey: ["diesel", currentPage + 1],
      queryFn: () => fetchDiesel(currentPage + 1),
    });
  }, [currentPage]);

  const itemsPerPage = 10;
  const indexOfLastOrder = currentPage * itemsPerPage;
  const indexOfFirstOrder = (currentPage - 1) * itemsPerPage;

  const totalPages = Math.ceil((diesel?.count as number) / itemsPerPage);

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

  useEffect(() => {
    const carOption = cars?.filter(car=> car?.fuel_type === "DIESEL")?.map((car) => {
      return {
        label: `${car?.name} ${car?.number}`,
        value: car?.id,
      };
    });
    setCarOptions(carOption as Option[]);
  }, [cars]);
  const { mutate: createMutation } = useMutation({
    mutationFn: createDiesel,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["diesel"] });
      reset();
      toast.success(" Сохранено успешно!");
    },
    onError: () => {
      toast.error("Ошибка сохранения!");
    },
  });
  const onSubmit = (data: IDieselType) => {
    // price_usd: Number(removeCommas(data?.price_usd?.toString())),
    createMutation({
      ...data,
      price_uzs: Number(removeCommas(data?.price_uzs?.toString())),
    });
  };
  const handleSelectCar = (newValue: SingleValue<Option>) => {
    setSelectedCar(newValue);
    setValue("car", newValue?.value as string);
  };
  return (
    <div className="w-full container mx-auto mt-8 space-y-8">
      {/* Top Form Section */}
      <Card>
        <CardContent className="p-6 space-y-6">
          <FormProvider {...methods}>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-6 col-span-1"
            >
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="mb-2">Выберите</label>
                  <Select
                    {...register("car", {
                      required: "Это поле обязательно для заполнения",
                    })}
                    options={carOptions}
                    value={selectedCar}
                    onChange={handleSelectCar}
                    placeholder={"Isuzu 01A111AA"}
                    noOptionsMessage={() =>
                      "Введите текст, чтобы добавить новую опцию..."
                    }
                  />
                  {methods.formState.errors.car && (
                    <p className="text-red-500 text-sm">
                      {methods.formState.errors.car.message}
                    </p>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm">Цена на cаларка (литр)</label>
                  <CurrencyInputs name="price" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm">
                    Количество купленного cаларка (литр)
                  </label>
                  <Input
                    {...register("volume", {
                      required: true,
                      valueAsNumber: true,
                    })}
                    placeholder="0"
                    type="number"
                  />
                  {methods.formState.errors.volume && (
                    <p className="text-red-500 text-sm">
                      {methods.formState.errors.volume.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex justify-end">
                <Button className="bg-[#4880FF] text-white hover:bg-blue-600 w-[250px] rounded">
                  Добавить
                </Button>
              </div>
            </form>
          </FormProvider>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm">
                Оставшееся количество cаларка (литр)
              </label>
              <Input
                value={diesel?.results[0]?.remaining_volume?.volume}
                readOnly
                className="bg-muted"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Middle Table Section */}
     

      {/* Bottom Summary Section */}
      <Card>
        <CardContent className="p-6">
          <div className="bg-white rounded-2xl">
            {isLoading ? (
              <TableSkeleton />
            ) : (
              <PurchasedDiesel
                data={(diesel?.results as IDieselTypeForPagination[]) || []}
              />
            )}
            <div className="mt-4 flex justify-between items-center">
              <div>
              Итого: {diesel?.count} с {indexOfFirstOrder + 1} до {Math.min(indexOfLastOrder, diesel?.count as number) || 0}

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
                        button === currentPage
                          ? "bg-[#4880FF] text-white"
                          : "border"
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
        </CardContent>
      </Card>
    </div>
  );
}
