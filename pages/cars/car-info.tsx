"use client";

import { useForm, SubmitHandler, FormProvider } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Select as Selector,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
// import { formatNumberAsPrice } from "@/lib/functions";
import { AutoPartsForm } from "@/components/cars/autoparts-form";
import { FuelLog } from "@/components/cars/fuel-log";
import { RouteLog } from "@/components/cars/route-log";
import { ICars } from "@/lib/types/cars.types";
import { fetchCarById, sellCar, updateCar } from "@/lib/actions/cars.action";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { queryClient } from "@/components/ui-items/ReactQueryProvider";
import { DeleteCars } from "@/components/cars/cars-delete";
import { removeCommas } from "@/lib/utils";
import { OilLog } from "@/components/cars/oil-log";
import VehicleInfoCard from "@/components/cars/info";
import { GasLog } from "@/components/cars/gas-log";

const deepCompare = (obj1: ICars, obj2: ICars): boolean => {
  if (
    typeof obj1 !== "object" ||
    typeof obj2 !== "object" ||
    obj1 === null ||
    obj2 === null
  ) {
    // Handle primitive types and null/undefined
    return obj1 === obj2;
  }

  const keys1 = Object.keys(obj1) as (keyof ICars)[];
  const keys2 = Object.keys(obj2) as (keyof ICars)[];

  if (keys1.length !== keys2.length) return false;

  return keys1.every((key) => {
    const value1 = obj1[key];
    const value2 = obj2[key];

    // Check if values are objects, and recurse only for objects
    if (
      typeof value1 === "object" &&
      typeof value2 === "object" &&
      value1 !== null &&
      value2 !== null
    ) {
      return deepCompare(value1 as ICars, value2 as ICars);
    }

    // For primitives and null/undefined, do a direct comparison
    return value1 === value2;
  });
};

export default function VehicleForm() {
  const { id } = useRouter()?.query;
  const methods = useForm<ICars>();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = methods;
  const [originalData, setOriginalData] = useState<ICars | null>(null);
  const [isChanged, setIsChanged] = useState(false);
  const { push } = useRouter();

  const { data: car, isLoading } = useQuery<ICars>({
    queryKey: ["car"],
    queryFn: () => fetchCarById(id as string),
    enabled: !!id,
  });
  useEffect(() => {
    if (!isLoading && car) {
      const transformedCarData = {
        ...car,
        with_trailer: car.with_trailer === true,
        price_uzs: Number(car?.price_uzs).toFixed(2),
        distance_travelled: car.distance_travelled,
        leasing_period: car.leasing_period,
      };

      setOriginalData(transformedCarData); // Save original data for comparison
      reset(transformedCarData as ICars, { keepDirty: false }); // Reset form with initial data
    }
  }, [car, isLoading, reset]);

  // Track changes in form
  const watchedValues = watch();
  useEffect(() => {
    setIsChanged(!deepCompare(originalData as ICars, watchedValues));
  }, [watchedValues, originalData]);

  const with_trailer = watch("with_trailer");
  const { mutate: updateMutation } = useMutation({
    mutationFn: updateCar,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["car"] });
      toast.success(" Успешно создано!");
    },
    onError: () => {
      toast.error("Ошибка сохранения");
    },
  });
  const { mutate: deleteMutation } = useMutation({
    mutationFn: sellCar,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["car"] });
      toast.success(" Успешно создано!");
      push("/cars");
    },
    onError: () => {
      toast.error("Ошибка сохранения");
    },
  });
  const onSubmit: SubmitHandler<ICars> = (data) => {
    updateMutation({
      ...data,
      price_uzs: Number(removeCommas(data?.price_uzs as string)),
    } as ICars);
  };

  const handleDelete = (value: number) => {
    deleteMutation({
      id: id as string,
      sell_price: value.toString(),
    });
  };
  return (
    <div>
      <div className="p-10 mt-8 container mx-auto bg-white rounded-2xl">
        <div className="w-full mx-auto p-6">
          <FormProvider {...methods}>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="grid grid-cols-2 gap-6"
            >
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Название автомобиля*
                </label>
                <Input
                  id="name"
                  {...register("name", {
                    required:
                      "Название автомобиля должно содержать минимум 2 символа",
                    minLength: {
                      value: 2,
                      message:
                        "Название автомобиля должно содержать минимум 2 символа",
                    },
                  })}
                  placeholder="Название автомобиля..."
                  className="mt-1"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.name.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="number"
                  className="block text-sm font-medium text-gray-700"
                >
                  Государственный номер автомобиля*
                </label>
                <Input
                  id="number"
                  {...register("number", {
                    required: "Введите государственный номер автомобиля",
                  })}
                  placeholder="Введите номер"
                  className="mt-1"
                  onChange={(e) => {
                    const value = e.target.value;
                    setValue("number", value.toUpperCase());
                  }}
                />
                {errors.number && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.number.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="with_trailer"
                  className="block text-sm font-medium text-gray-700"
                >
                  Есть ли прецепта*
                </label>
                <Selector
                  value={watch("with_trailer") ? "true" : "false"}
                  onValueChange={(value) =>
                    setValue("with_trailer", value === "true")
                  }
                >
                  <SelectTrigger id="with_trailer" className="mt-1">
                    <SelectValue placeholder="Есть ли прецепта" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="true">Да</SelectItem>
                    <SelectItem value="false">Нет</SelectItem>
                  </SelectContent>
                </Selector>

                {errors.with_trailer && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.with_trailer.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="trailer_number"
                  className="block text-sm font-medium text-gray-700"
                >
                  Государственный номер прецепта*
                </label>
                <Input
                  disabled={!with_trailer}
                  id="trailer_number"
                  {...register("trailer_number", {
                    required: with_trailer
                      ? "Это значение является обязательным"
                      : false,
                  })}
                  placeholder="Введите номер"
                  className="mt-1"
                  onChange={(e) => {
                    const value = e.target.value;
                    setValue("trailer_number", value.toUpperCase());
                  }}
                />
                {errors.trailer_number && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.trailer_number.message}
                  </p>
                )}
              </div>

              <div className="w-full col-span-2 flex justify-end">
                <Button
                  disabled={!isChanged}
                  type="submit"
                  className="bg-[#4880FF] text-white ml-3 hover:bg-blue-600 w-[200px] rounded-md"
                >
                  Сохранять
                </Button>
              </div>
            </form>
          </FormProvider>
          <div className="w-full col-span-2 mt-3 flex justify-end">
            <DeleteCars onDelete={handleDelete} />
          </div>
        </div>
      </div>
      <div className="mt-8">
        <VehicleInfoCard car={car as ICars} />
      </div>

      <div className="container mx-auto py-6 space-y-6">
        <AutoPartsForm />

        {car?.fuel_type === "GAS" ? (
          <div className="space-y-2 bg-white p-8 rounded-2xl">
            <h2 className="text-lg font-semibold">
              Дата получения топлива (Газ)
            </h2>
            <GasLog />
          </div>
        ) : (
          <div className="space-y-2 bg-white p-8 rounded-2xl">
            <h2 className="text-lg font-semibold">
              Дата получения топлива (Солярка)
            </h2>
            <FuelLog />
          </div>
        )}

        <div className="space-y-2 bg-white p-8 rounded-2xl">
          <h2 className="text-lg font-semibold">Данные получения масла</h2>
          <OilLog />
        </div>

        <div className="space-y-2 bg-white p-8 rounded-2xl">
          <h2 className="text-lg font-semibold">Дата рейсов</h2>
          <RouteLog />
        </div>
      </div>
    </div>
  );
}
