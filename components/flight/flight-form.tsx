"use client";

import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { IFlight } from "@/lib/types/flight.types";
import { FileUploader } from "../ui-items/FileUploader";
import { useEffect, useState } from "react";
import { ImageType } from "@/lib/types/file.types";

export default function FlightForm() {
  const {
    register,
    handleSubmit,
    // formState: { errors },
    setValue,
    watch,
  } = useForm<IFlight>({
    defaultValues: {
      region: "",
      city: "",
      route: "",
      departureDate: "",
      arrivalDate: "",
      vehicle: "",
      driver: "",
      tripPrice: "",
      spending: "",
      cargoInfo: "",
      expenses: "",
    },
  });
  const [image, setImage] = useState<ImageType>({ id: "", file: "" });
  const region = watch("region");
  useEffect(() => {
    if (region === "На территории Узбекистана.") {
      setValue("city", "");
      setValue("route", "");
      setValue("departureDate", "");
      setValue("arrivalDate", "");
      setValue("vehicle", "");
      setValue("driver", "");
      setValue("tripPrice", "");
      setValue("spending", "");
      setValue("cargoInfo", "");
      setValue("expenses", "");
    }
  }, [region, setValue]);
  const onSubmit = (data: IFlight) => {
    console.log(data);
    // Handle form submission
  };

  // Custom handler for select components since they don't work directly with register
  const handleSelectChange = (value: string, name: keyof IFlight) => {
    setValue(name, value);
  };
  console.log(region);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6 w-full container mx-auto mt-8 bg-white p-12 rounded-2xl"
    >
      <div className="grid grid-cols-2 gap-6">
        {/* Region Selection */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Выберите регион*</label>
          <Select
            defaultValue="За территории Узбекистана"
            onValueChange={(value) => handleSelectChange(value, "region")}
          >
            <SelectTrigger>
              <SelectValue placeholder="Выберите..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="За территории Узбекистана">
                За территории Узбекистана
              </SelectItem>
              <SelectItem value="На территории Узбекистана.">
                На территории Узбекистана.
              </SelectItem>
              {/* Add more regions as needed */}
            </SelectContent>
          </Select>
        </div>

        {/* Vehicle Selection */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Выберите автомобиль*</label>
          <Select
            onValueChange={(value) => handleSelectChange(value, "vehicle")}
          >
            <SelectTrigger>
              <SelectValue placeholder="Выберите..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="car1">Автомобиль 1</SelectItem>
              <SelectItem value="car2">Автомобиль 2</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* City Selection */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Выберите область*</label>
          <Select onValueChange={(value) => handleSelectChange(value, "city")}>
            <SelectTrigger>
              <SelectValue placeholder="Выберите..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="city1">область 1</SelectItem>
              <SelectItem value="city2">область 2</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Driver Selection */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Выберите водителя*</label>
          <Select
            onValueChange={(value) => handleSelectChange(value, "driver")}
          >
            <SelectTrigger>
              <SelectValue placeholder="Выберите..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="driver1">Водитель 1</SelectItem>
              <SelectItem value="driver2">Водитель 2</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Route Selection */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Маршрут*</label>
          <Select onValueChange={(value) => handleSelectChange(value, "route")}>
            <SelectTrigger>
              <SelectValue placeholder="Выберите..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="route1">Маршрут 1</SelectItem>
              <SelectItem value="route2">Маршрут 2</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Trip Price */}
        <div className="space-y-2">
          <label className="text-sm font-medium">
            Введите стоимость рейса*
          </label>
          <Input
            type="text"
            placeholder="Введите цену"
            {...register("tripPrice", { required: true })}
          />
        </div>

        {/* Route Price */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Введите дату отъезда*</label>
          <Input
            type="date"
            placeholder="Введите цену"
            {...register("departureDate", { required: true })}
          />
        </div>

        {/* Cost */}
        <div className="space-y-2">
          <label className="text-sm font-medium">
            Расходы, выделяемые водителю на рейс*
          </label>
          <Input
            type="text"
            placeholder="Введите цену"
            {...register("spending", { required: true })}
          />
        </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">Введите дату прибытия*</label>
        <Input
          type="date"
          placeholder="Введите цену"
          {...register("arrivalDate", { required: true })}
        />
      </div>
      </div>
      {/* Cargo Information */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Информация о грузе</label>
        <Textarea
          placeholder="Введите информацию о грузе"
          className="min-h-[100px]"
          {...register("cargoInfo")}
        />
      </div>

      {/* Expenses */}
      {region !== "На территории Узбекистана." && (
        <div className="grid grid-cols-2 gap-6">
          <FileUploader image={image} setImage={setImage} type=".xlsx" />
          {/* <div className="space-y-2">
        <label className="text-sm font-medium">
          Загрузите отчет о расходах
        </label>
        <Input
          type="text"
          placeholder="Введите цену"
          {...register("expenses")}
        />
      </div> */}
        </div>
      )}

      <div className="w-full flex justify-end gap-6">
        <Button
          type="submit"
          className="bg-[#4880FF] text-white hover:bg-blue-600 w-[250px] rounded-md"
        >
          Завершить рейс
        </Button>
        <Button
          type="submit"
          className="bg-[#4880FF] text-white hover:bg-blue-600 w-[250px] rounded-md"
        >
          Сохранить
        </Button>
      </div>
    </form>
  );
}
