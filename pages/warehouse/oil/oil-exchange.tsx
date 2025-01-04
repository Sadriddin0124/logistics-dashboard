import React, { useEffect, useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import Select, { SingleValue } from "react-select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useMutation, useQuery } from "@tanstack/react-query";
import {} from "@/lib/actions/gas.action";
import { queryClient } from "@/components/ui-items/ReactQueryProvider";
import { toast } from "react-toastify";
import { IOilExchange, IOilType } from "@/lib/types/oil.types";
import { createOilExchange, fetchWholeOils } from "@/lib/actions/oil.action";
import {
  fetchCarNoPage,
  updateCarDistanceOil,
} from "@/lib/actions/cars.action";
import { ICars } from "@/lib/types/cars.types";
import { useRouter } from "next/router";

interface Option {
  value: string;
  label: string;
}

export default function OilExchange() {
  const methods = useForm<IOilExchange>();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
  } = methods;
  const [stationOptions, setOilOptions] = useState<Option[]>([]);
  const [selectedOil, setSelectedOil] = useState<Option | null>(null);
  const [carOptions, setCarOptions] = useState<Option[]>([]);
  const [selectedCar, setSelectedCar] = useState<Option | null>(null);
  const [oilVolume, setOilVolume] = useState(0);
  const { push } = useRouter();
  const { data: cars } = useQuery<ICars[]>({
    queryKey: ["cars"],
    queryFn: fetchCarNoPage,
  });
  const { data: oil } = useQuery<IOilType[]>({
    queryKey: ["all_oil"],
    queryFn: fetchWholeOils,
  });
  const oil_recycle_distance = methods.watch("oil_recycle_distance");

  useEffect(() => {
    if (cars && oil) {
      const carOption = cars?.map((car) => {
        return {
          label: `${car?.name} ${car?.number}`,
          value: car?.id,
        };
      });
      const oilOption = oil?.map((oil) => {
        return {
          label: oil?.oil_name,
          value: oil?.id,
        };
      });
      setCarOptions(carOption as Option[]);
      setOilOptions(oilOption as Option[]);
      const car = cars?.find(
        (item) => item?.id === selectedCar?.value
      )?.distance_travelled;
      setValue("oil_recycle_distance", car as number);
    }
    const oil_volume = oil?.find(
      (item) => item?.id === selectedOil?.value
    )?.oil_volume;
    setOilVolume(oil_volume as number);
  }, [cars, oil, selectedCar, setValue, selectedOil]);

  const { mutate: createMutation } = useMutation({
    mutationFn: createOilExchange,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["gas_oil"] });
      push(`/warehouse/oil/`);
      setSelectedOil(null);
      toast.success("Сохранено успешно!");
    },
    onError: () => {
      toast.error("Ошибка сохранения!");
    },
  });
  const { mutate: updateMutation } = useMutation({
    mutationFn: updateCarDistanceOil,
    onError: () => {
      toast.error("Ошибка сохранения!");
    },
  });
  const onSubmit = (data: IOilExchange) => {
    console.log(data);

    createMutation({
      ...data,
      car: selectedCar?.value as string,
      oil: selectedOil?.value as string,
      next_oil_recycle_distance: data?.next_oil_recycle_distance,
    });
    updateMutation({
      id: selectedCar?.value as string,
      distance_travelled: data?.oil_recycle_distance,
      next_oil_recycle_distance: data?.next_oil_recycle_distance,
    });
    reset();
  };

  const handleSelectOil = (newValue: SingleValue<Option>) => {
    setSelectedOil(newValue);
  };

  const handleSelectCar = (newValue: SingleValue<Option>) => {
    setSelectedCar(newValue);
  };
  return (
    <div className="w-full p-4 space-y-8 container mx-auto">
      <Card>
        <CardContent className="p-6 space-y-6">
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="mb-2">Выберите автомобиль</label>
                  <Select
                    options={carOptions}
                    value={selectedCar}
                    onChange={handleSelectCar}
                    placeholder="Isuzu 01A111AA"
                    noOptionsMessage={() => "Не найдено"}
                    isClearable
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm">Данный объем масла в литрах</label>
                  <Input
                    {...register("remaining_oil", {
                      valueAsNumber: true,
                      required: true,
                      validate: (value) =>
                        value < oilVolume ||
                        `Значение должно быть меньше ${oilVolume}`, // Custom validation
                    })}
                    placeholder="0"
                  />
                  {errors.remaining_oil && (
                    <p className="text-red-500">{errors.remaining_oil.message}</p> // Display error message
                  )}
                </div>
                <div className="space-y-2">
                  <label className="mb-2">Выберите масло</label>
                  <Select
                    options={stationOptions}
                    value={selectedOil}
                    onChange={handleSelectOil}
                    placeholder="Выберите..."
                    noOptionsMessage={() => "Не найдено"}
                    isClearable
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm">
                    Введите объем переработанного масла
                  </label>
                  <Input
                    {...register("amount", {
                      required: "Введите объем переработанного масла", // Required validation
                    })}
                    placeholder="0"
                    onChange={(e) => {
                      const value = parseFloat(e.target.value);
                      setValue("amount", isNaN(value) ? 0 : value); // Set 0 if value is invalid
                    }}
                  />
                  {errors.amount && (
                    <p className="text-red-500">{errors.amount.message}</p> // Display error message
                  )}
                </div>
                <div className="space-y-2">
                  <label className="text-sm">Текущее расстояние до масла</label>
                  <Input
                    {...register("oil_recycle_distance", {
                      valueAsNumber: true,
                      required: true,
                    })}
                    placeholder="0"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm">
                    Следующая масляная дистанция
                  </label>
                  <Input
                    {...register("next_oil_recycle_distance", {
                      valueAsNumber: true,
                      required: "Это значение является обязательным.",
                      validate: (value) =>
                        value < oil_recycle_distance
                          ? "Следующее расстояние рециркуляции масла должно быть больше текущего расстояния."
                          : true,
                    })}
                    placeholder="0"
                  />
                  {errors?.next_oil_recycle_distance && (
                    <p className="text-sm text-red-500">
                      {errors?.next_oil_recycle_distance?.message}
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
        </CardContent>
      </Card>
    </div>
  );
}
