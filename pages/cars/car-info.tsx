"use client";

import { useForm, SubmitHandler } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { formatNumberAsPrice } from "@/lib/functions";
import { AutoPartsForm } from "@/components/cars/autoparts-form";
import { FuelLog } from "@/components/cars/fuel-log";
import { RouteLog } from "@/components/cars/route-log";

interface FormValues {
  vehicleName: string;
  vehicleBrand: string;
  registrationNumber: string;
  hasPrescription: string;
  prescriptionNumber?: string;
  paymentType: string;
  leasingTerm: string;
  fuelType: string;
  vehiclePrice: string;
  carSpace: string;
}

export default function VehicleForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<FormValues>({
    defaultValues: {
      vehicleName: "",
      vehicleBrand: "",
      registrationNumber: "",
      hasPrescription: "",
      prescriptionNumber: "",
      paymentType: "",
      leasingTerm: "",
      fuelType: "",
      vehiclePrice: "",
      carSpace: "",
    },
  });
  const paymentType = watch("paymentType");
  const onSubmit: SubmitHandler<FormValues> = (data) => {
    console.log(data);
  };
  const vehiclePrice = watch("vehiclePrice");
  const handleVehiclePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/[^0-9]/g, ""); // Only allow numeric input
    const formattedValue = formatNumberAsPrice(rawValue); // Format the value with commas
    setValue("vehiclePrice", rawValue); // Store raw numeric value
    e.target.value = formattedValue; // Set formatted value to input field
  };
  return (
    <div>
      <div className="p-10 mt-8 container mx-auto bg-white rounded-2xl">
        <div className="w-full mx-auto p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label
                  htmlFor="vehicleName"
                  className="block text-sm font-medium text-gray-700"
                >
                  Название автомобиля*
                </label>
                <Input
                  id="vehicleName"
                  {...register("vehicleName", {
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
                {errors.vehicleName && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.vehicleName.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="vehicleBrand"
                  className="block text-sm font-medium text-gray-700"
                >
                  Марка автомобиля*
                </label>
                <Select
                  onValueChange={(value) => setValue("vehicleBrand", value)}
                >
                  <SelectTrigger id="vehicleBrand" className="mt-1">
                    <SelectValue placeholder="Выберите марку" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="toyota">Toyota</SelectItem>
                    <SelectItem value="honda">Honda</SelectItem>
                    <SelectItem value="volkswagen">Volkswagen</SelectItem>
                    <SelectItem value="bmw">BMW</SelectItem>
                  </SelectContent>
                </Select>
                {errors.vehicleBrand && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.vehicleBrand.message}
                  </p>
                )}
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label
                  htmlFor="registrationNumber"
                  className="block text-sm font-medium text-gray-700"
                >
                  Государственный номер автомобиля*
                </label>
                <Input
                  id="registrationNumber"
                  {...register("registrationNumber", {
                    required: "Введите государственный номер автомобиля",
                  })}
                  placeholder="Введите номер"
                  className="mt-1"
                />
                {errors.registrationNumber && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.registrationNumber.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="hasPrescription"
                  className="block text-sm font-medium text-gray-700"
                >
                  Есть ли прецепта*
                </label>
                <Select
                  onValueChange={(value) => setValue("hasPrescription", value)}
                >
                  <SelectTrigger id="hasPrescription" className="mt-1">
                    <SelectValue placeholder="Да" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="yes">Да</SelectItem>
                    <SelectItem value="no">Нет</SelectItem>
                  </SelectContent>
                </Select>
                {errors.hasPrescription && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.hasPrescription.message}
                  </p>
                )}
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label
                  htmlFor="prescriptionNumber"
                  className="block text-sm font-medium text-gray-700"
                >
                  Государственный номер прецепта*
                </label>
                <Input
                  id="prescriptionNumber"
                  {...register("prescriptionNumber")}
                  placeholder="Введите номер"
                  className="mt-1"
                />
                {errors.prescriptionNumber && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.prescriptionNumber.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="fuelType"
                  className="block text-sm font-medium text-gray-700"
                >
                  Тип топлива*
                </label>
                <Select onValueChange={(value) => setValue("fuelType", value)}>
                  <SelectTrigger id="fuelType" className="mt-1">
                    <SelectValue placeholder="Газ" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="gas">Газ</SelectItem>
                    <SelectItem value="diesel">Салярка</SelectItem>
                  </SelectContent>
                </Select>
                {errors.fuelType && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.fuelType.message}
                  </p>
                )}
              </div>
            </div>
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label
                  htmlFor="paymentType"
                  className="block text-sm font-medium text-gray-700"
                >
                  Тип оплаты*
                </label>
                <Select
                  onValueChange={(value) => setValue("paymentType", value)}
                >
                  <SelectTrigger id="paymentType" className="mt-1">
                    <SelectValue placeholder="Лизинг" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="leasing">Лизинг</SelectItem>
                    <SelectItem value="cash">Наличные</SelectItem>
                  </SelectContent>
                </Select>
                {errors.paymentType && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.paymentType.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="vehiclePrice"
                  className="block text-sm font-medium text-gray-700"
                >
                  Введите цену автомобиля*
                </label>
                <Input
                  id="vehiclePrice"
                  {...register("vehiclePrice", {
                    required: "Введите цену автомобиля",
                  })}
                  value={formatNumberAsPrice(vehiclePrice || "")} // Format with commas
                  placeholder="Введите оплату"
                  type="text" // Use text for formatting
                  onChange={handleVehiclePriceChange} // Ensure only numeric input
                  className="mt-1"
                />
                {errors.vehiclePrice && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.vehiclePrice.message}
                  </p>
                )}
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {paymentType !== "cash" && (
                <div>
                  <label
                    htmlFor="leasingTerm"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Введите срок лизинга*
                  </label>
                  <Input
                    id="leasingTerm"
                    {...register("leasingTerm", {
                      required: "Введите срок лизинга",
                    })}
                    type="number"
                    placeholder="Введите срок..."
                    className="mt-1"
                  />
                  {errors.leasingTerm && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.leasingTerm.message}
                    </p>
                  )}
                </div>
              )}
              <div>
                <label
                  htmlFor="leasingTerm"
                  className="block text-sm font-medium text-gray-700"
                >
                  Пройденное расстояние автомобиля (в км)*
                </label>
                <Input
                  id="carSpace"
                  {...register("carSpace", {
                    required: "Введите срок лизинга",
                  })}
                  type="number"
                  placeholder="Введите Пройденное расстояние автомобиля (в км)..."
                  className="mt-1"
                />
                {errors.carSpace && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.carSpace.message}
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
