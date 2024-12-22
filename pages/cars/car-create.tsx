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
import Select, { SingleValue } from "react-select";
import { CurrencyInputs } from "@/components/ui-items/currency-inputs";
import { useMutation } from "@tanstack/react-query";
import { createCar } from "@/lib/actions/cars.action";
import { toast } from "react-toastify";
import { queryClient } from "@/components/ui-items/ReactQueryProvider";
import { removeCommas } from "@/lib/utils";
import { useState } from "react";
import { Option } from "../warehouse/diesel";
import { createStation } from "@/lib/actions/gas.action";

interface FormValues {
  name: string;
  model: string;
  number: string;
  with_trailer: string;
  trailer_number?: null | string;
  type_of_payment: string;
  leasing_period: string;
  fuel_type: string;
  price_usd: number;
  price_uzs: number;
  distance_travelled: string;
}

export default function VehicleForm() {
  const methods = useForm<FormValues>();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = methods;
  const [modelOptions] = useState<Option[]>([]);
  const [selectedModel, setSelectedModel] = useState<Option | null>(null);
  const [stationValue, setModel] = useState<string>("");
  const type_of_payment = watch("type_of_payment");
  const { mutate: createMutation } = useMutation({
    mutationFn: createCar,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cars"] });
      reset();
      toast.success(" muvaffaqiyatli qo'shildi!");
    },
    onError: () => {
      toast.error("ni qo'shishda xatolik!");
    },
  });
  const onSubmit: SubmitHandler<FormValues> = (data) => {
    console.log(data);
    const formData = {
      ...data,
      with_trailer: data?.with_trailer === "true" ? true : false,
      leasing_period: Number(data?.leasing_period),
      distance_travelled: Number(data?.distance_travelled),
      price_usd: Number(removeCommas(data?.price_usd?.toString())),
      price_uzs: Number(removeCommas(data?.price_uzs?.toString())),
      // price_usd: data?.price_usd.toString(),
      // price_uzs: data?.price_uzs.toString()
    };
    createMutation({...formData, model: selectedModel?.value as string});
  };

  const with_trailer = watch("with_trailer");
  const handleSelectModel = (newValue: SingleValue<Option>) => {
    setSelectedModel(newValue);
  };
  const { mutate: createGasMutation } = useMutation({
    mutationFn: createStation,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["gas_stations"] });
      setSelectedModel({ label: data?.name, value: data?.id });
    },
  });
  const handleAddModel = () => {
    if (stationValue) {
      createGasMutation(stationValue);
    }
  };
  return (
    <div>
      <div className="p-10 mx-auto container mt-8 bg-white rounded-2xl">
        <div className="w-full ">
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

                <div className="space-y-1">
                  <label
                    htmlFor="model"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Марка автомобиля*
                  </label>
                  <Select
                    options={modelOptions}
                    value={selectedModel}
                    onChange={handleSelectModel}
                    onBlur={handleAddModel}
                    onInputChange={(value) => setModel(value)}
                    placeholder="BMW"
                    noOptionsMessage={() => "Type to add new option..."}
                    isClearable
                  />
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
                  <Selector
                    onValueChange={(value) => setValue("with_trailer", value)}
                  >
                    <SelectTrigger id="with_trailer" className="mt-1">
                      <SelectValue placeholder="Да" />
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
                    disabled={with_trailer === "false" ? true : false}
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
                  <Selector
                    onValueChange={(value) => setValue("fuel_type", value)}
                  >
                    <SelectTrigger id="fuel_type" className="mt-1">
                      <SelectValue placeholder="Газ" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="GAS">Газ</SelectItem>
                      <SelectItem value="DIESEL">Салярка</SelectItem>
                    </SelectContent>
                  </Selector>
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
                  <Selector
                    onValueChange={(value) =>
                      setValue("type_of_payment", value)
                    }
                  >
                    <SelectTrigger id="type_of_payment" className="mt-1">
                      <SelectValue placeholder="Лизинг" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="LEASING">Лизинг</SelectItem>
                      <SelectItem value="CASH">Наличные</SelectItem>
                    </SelectContent>
                  </Selector>
                  {errors.type_of_payment && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.type_of_payment.message}
                    </p>
                  )}
                </div>

                <div className="space-y-1">
                  <label
                    htmlFor="price"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Введите цену автомобиля*
                  </label>
                  {/* <Input
            id="price"
            {...register("price", {
              required: "Введите цену автомобиля",
            })}
            value={formatNumberAsPrice(price || "")} // Format with commas
            placeholder="Введите оплату"
            type="text" // Use text for formatting
            onChange={handlepriceChange} // Ensure only numeric input
            className="mt-1"
          /> */}
                  <CurrencyInputs name="price" />
                  {errors?.price_uzs && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors?.price_uzs.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                {type_of_payment !== "CASH" && (
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
                    htmlFor="leasing_period"
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
                  Добавить
                </Button>
              </div>
            </form>
          </FormProvider>
        </div>
      </div>
    </div>
  );
}
