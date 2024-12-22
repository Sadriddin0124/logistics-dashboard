import { FormProvider, useForm } from "react-hook-form";
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
import { useEffect, useState } from "react";
import { ImageType } from "@/lib/types/file.types";
import { FileUploader } from "../ui-items/FileUploader";
import { CurrencyInputs } from "../ui-items/currency-inputs";
type FormValues = {
  region: string;
  city: string;
  route: number;
  car: string;
  driver: number;
  departure_date: string;
  arrival_date: string;
  price_uzs: number;
  price_usd: number;
  driver_expenses_uzs: number;
  driver_expenses_usd: number;
  cargo_info: string;
  status: string;
};

export default function FlightForm() {
  const methods = useForm<FormValues>({
    defaultValues: {
      region: "",
      city: "",
      route: 0, // Changed to a number
      car: "", // Changed to "car" instead of "vehicle"
      driver: 0, // Changed to a number
      departure_date: "", // Changed to "departure_date"
      arrival_date: "", // Changed to "arrival_date"
      price_uzs: 0, // Changed to "price_uzs"
      price_usd: 0, // Changed to "price_usd"
      driver_expenses_uzs: 0, // Changed to "driver_expenses_uzs"
      driver_expenses_usd: 0, // Changed to "driver_expenses_usd"
      cargo_info: "", // Changed to "cargo_info"
      status: "ACTIVE", // Changed to "status"
    },
  });
  const { register, handleSubmit, setValue, watch } = methods;
  const [image, setImage] = useState<ImageType>({ id: "", file: "" });
  const region = watch("region");

  useEffect(() => {
    if (region === "На территории Узбекистана.") {
      setValue("city", "");
      setValue("route", 0); // Set default value to 0 (or another appropriate default)
      setValue("departure_date", "");
      setValue("arrival_date", "");
      setValue("car", "");
      setValue("driver", 0);
      setValue("price_uzs", 0);
      setValue("price_usd", 0);
      setValue("driver_expenses_uzs", 0);
      setValue("driver_expenses_usd", 0);
      setValue("cargo_info", "");
      setValue("status", "ACTIVE");
    }
  }, [region, setValue]);

  const onSubmit = (data: FormValues) => {
    console.log(data);
    // Handle form submission
  };

  const handleSelectChange = (value: string, name: string) => {
    setValue(name as "region", value);
  };
console.log(image);

  return (
    <FormProvider {...methods}>
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
              </SelectContent>
            </Select>
          </div>

          {/* Car Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Выберите автомобиль*</label>
            <Select onValueChange={(value) => handleSelectChange(value, "car")}>
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
            <Select
              onValueChange={(value) => handleSelectChange(value, "city")}
            >
              <SelectTrigger>
                <SelectValue placeholder="Выберите..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="city1">Область 1</SelectItem>
                <SelectItem value="city2">Область 2</SelectItem>
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
            <Select
              onValueChange={(value) => handleSelectChange(value, "route")}
            >
              <SelectTrigger>
                <SelectValue placeholder="Выберите..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={"0"}>Маршрут 1</SelectItem>
                <SelectItem value={"1"}>Маршрут 2</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Trip Price */}
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Введите стоимость рейса*
            </label>
            <CurrencyInputs name="price" />
          </div>

          {/* Departure Date */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Введите дату отъезда*</label>
            <Input
              type="date"
              placeholder="Введите дату"
              {...register("departure_date", { required: true })}
            />
          </div>

          {/* Spending */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Расходы водителя*</label>
            <CurrencyInputs name="driver_expenses" />
          </div>

          {/* Arrival Date */}
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Введите дату прибытия*
            </label>
            <Input
              type="date"
              placeholder="Введите дату"
              {...register("arrival_date", { required: true })}
            />
          </div>
        </div>

        {/* Cargo Information */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Информация о грузе</label>
          <Textarea
            placeholder="Введите информацию о грузе"
            className="min-h-[100px]"
            {...register("cargo_info")}
          />
        </div>

        {/* Expenses */}
        {region !== "На территории Узбекистана." && (
          <div className="grid grid-cols-2 gap-6">
            <FileUploader image={image} setImage={setImage} type=".xlsx" />
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
    </FormProvider>
  );
}
