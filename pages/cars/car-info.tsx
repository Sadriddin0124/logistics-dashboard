"use client";

import { useForm, SubmitHandler, FormProvider } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Select,
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
import { fetchCarById, updateCar } from "@/lib/actions/cars.action";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { CurrencyInputs } from "@/components/ui-items/currency-inputs";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { queryClient } from "@/components/ui-items/ReactQueryProvider";

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
  const type_of_payment = watch("type_of_payment");
  const { data: car, isLoading } = useQuery<ICars>({
    queryKey: ["car"],
    queryFn: () => fetchCarById(id as string),
    enabled: !!id,
  });
  console.log(watch("model"));

  useEffect(() => {
    if (!isLoading && car) {
      // Transform the car data to match ICars
      const transformedCarData = {
        ...car,
        with_trailer: car.with_trailer === true, // Convert the string "true"/"false" back to boolean
        price_uzs: car.price_uzs.toString(), // Convert price to string
        distance_travelled: car.distance_travelled.toString(), // Convert to string
        leasing_period: car.leasing_period.toString(), // Convert to string
      };

      // Assert the transformed data as ICars after making the necessary type changes
      reset(transformedCarData as unknown as ICars);
    }
  }, [car, isLoading, reset]);

  const with_trailer = watch("with_trailer");
  const { mutate: updateMutation } = useMutation({
    mutationFn: updateCar,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["car"] });
      toast.success(data?.name + " muvaffaqiyatli yangilandi!");
    },
    onError: () => {
      toast.error("ni yangilashda xatolik!");
    },
  });
  const onSubmit: SubmitHandler<ICars> = (data) => {
    console.log(data);
    updateMutation(data as ICars);
  };

  // const price_uzs = watch("price_uzs");
  // const handleprice_uzsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const rawValue = e.target.value.replace(/[^0-9]/g, ""); // Only allow numeric input
  //   const formattedValue = formatNumberAsPrice(rawValue); // Format the value with commas
  //   setValue("price_uzs", rawValue); // Store raw numeric value
  //   e.target.value = formattedValue; // Set formatted value to input field
  // };
  return (
    <div>
      <div className="p-10 mt-8 container mx-auto bg-white rounded-2xl">
        <div className="w-full mx-auto p-6">
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
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
                    htmlFor="model"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Марка автомобиля*
                  </label>
                  <Select
                    value={watch("model")}
                    onValueChange={(value) => setValue("model", value)}
                  >
                    <SelectTrigger id="model" className="mt-1">
                      <SelectValue placeholder="Выберите марку" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="toyota">Toyota</SelectItem>
                      <SelectItem value="honda">Honda</SelectItem>
                      <SelectItem value="volkswagen">Volkswagen</SelectItem>
                      <SelectItem value="bmw">BMW</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.model && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.model.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
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
                  <Select
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
                  </Select>

                  {errors.with_trailer && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.with_trailer.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
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
                    {...register("trailer_number")}
                    placeholder="Введите номер"
                    className="mt-1"
                  />
                  {errors.trailer_number && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.trailer_number.message}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="fuel_type"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Тип топлива*
                  </label>
                  <Select
                    value={watch("fuel_type")}
                    onValueChange={(value) => setValue("fuel_type", value)}
                  >
                    <SelectTrigger id="fuel_type" className="mt-1">
                      <SelectValue placeholder="Газ" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="GAS">Газ</SelectItem>
                      <SelectItem value="DIESEL">Салярка</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.fuel_type && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.fuel_type.message}
                    </p>
                  )}
                </div>
              </div>
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <label
                    htmlFor="type_of_payment"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Тип оплаты*
                  </label>
                  <Select
                    onValueChange={(value) =>
                      setValue("type_of_payment", value)
                    }
                  >
                    <SelectTrigger id="type_of_payment" className="mt-1">
                      <SelectValue placeholder="Лизинг" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="leasing">Лизинг</SelectItem>
                      <SelectItem value="cash">Наличные</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.type_of_payment && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.type_of_payment.message}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="price_uzs"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Введите цену автомобиля*
                  </label>
                  <CurrencyInputs name="price" />
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                {type_of_payment !== "cash" && (
                  <div>
                    <label
                      htmlFor="leasing_period"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Введите срок лизинга*
                    </label>
                    <Input
                      id="leasing_period"
                      {...register("leasing_period", {
                        required: "Введите срок лизинга",
                      })}
                      type="number"
                      placeholder="Введите срок..."
                      className="mt-1"
                    />
                    {errors.leasing_period && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.leasing_period.message}
                      </p>
                    )}
                  </div>
                )}
                <div>
                  <label
                    htmlFor="distance_travelled"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Пройденное расстояние автомобиля (в км)*
                  </label>
                  <Input
                    id="distance_travelled"
                    {...register("distance_travelled", {
                      required: "Введите срок лизинга",
                    })}
                    type="number"
                    placeholder="Введите Пройденное расстояние автомобиля (в км)..."
                    className="mt-1"
                  />
                  {errors.distance_travelled && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.distance_travelled.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="w-full flex justify-end">
                <Button
                  type="submit"
                  className="bg-[#4880FF] text-white hover:bg-blue-600 w-[250px] rounded-md"
                >
                  Продат автомобил
                </Button>
              </div>
            </form>
          </FormProvider>
        </div>
      </div>
      <div className="container mx-auto py-6 space-y-6">
        <AutoPartsForm />

        <div className="space-y-2 bg-white p-8 rounded-2xl">
          <h2 className="text-lg font-semibold">Дата получения топлива</h2>
          <FuelLog />
        </div>

        <div className="space-y-2 bg-white p-8 rounded-2xl">
          <h2 className="text-lg font-semibold">Дата рейсов</h2>
          <RouteLog />
        </div>
      </div>
    </div>
  );
}
