import { Controller, FormProvider, useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Select as Selector,
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
import { IFlightData } from "@/lib/types/flight.types";
import { useMutation, useQuery } from "@tanstack/react-query";
import { queryClient } from "../ui-items/ReactQueryProvider";
import { toast } from "react-toastify";
import { createFlight } from "@/lib/actions/flight.action";
import { Option } from "@/pages/warehouse/diesel";
import { fetchCarNoPage, updateCarDistance } from "@/lib/actions/cars.action";
import { ICars } from "@/lib/types/cars.types";
import Select, { SingleValue } from "react-select";
import { IRegion } from "@/lib/types/regions.types";
import { fetchRegionsAll } from "@/lib/actions/region.action";
import { IEmployee } from "@/lib/types/employee.types";
import { fetchEmployeesAll } from "@/lib/actions/employees.action";
import { removeCommas } from "@/lib/utils";
import { useRouter } from "next/router";
import CurrencyInputWithSelect from "../ui-items/currencySelect";

export default function FlightForm() {
  const [image, setImage] = useState<ImageType>({ id: "", file: "" });
  const [driverOptions, setDriverOptions] = useState<Option[]>([]);
  const [selectedDriver, setSelectedDriver] = useState<Option | null>(null);
  const [carOptions, setCarOptions] = useState<Option[]>([]);
  const [selectedCar, setSelectedCar] = useState<Option | null>(null);
  const [distance, setDistance] = useState<number>(0);
  const methods = useForm<IFlightData>({
    defaultValues: {
      price_uzs: "",
    },
  });
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = methods;
  const flight_type = watch("flight_type");
  const route = watch("route");

  const { push } = useRouter();
  const { data: cars } = useQuery<ICars[]>({
    queryKey: ["cars"],
    queryFn: fetchCarNoPage,
  });
  const { data: regions } = useQuery<IRegion[]>({
    queryKey: ["regions"],
    queryFn: fetchRegionsAll,
  });
  const { data: employeeList } = useQuery<IEmployee[]>({
    queryKey: ["employees-all"],
    queryFn: fetchEmployeesAll,
  });
  useEffect(() => {
    const driverOption = employeeList
      ?.filter((driver) => driver?.flight_type === flight_type)
      ?.map((driver) => {
        return {
          label: driver?.full_name,
          value: driver?.id,
        };
      });
    const carOption = cars?.map((car) => {
      return {
        label: `${car?.name} ${car?.number}`,
        value: car?.id,
      };
    });
    const distance = cars?.find(
      (item) => item?.id === selectedCar?.value
    )?.distance_travelled;
    setDistance(distance as number);
    setCarOptions(carOption as Option[]);
    setDriverOptions(driverOption as Option[]);
  }, [cars, employeeList, flight_type, selectedCar?.value]);
  useEffect(() => {
    if (flight_type === "IN_UZB") {
      setValue("region", "");
      setValue("route", ""); // Set default value to 0 (or another appropriate default)
      setValue("departure_date", "");
      setValue("arrival_date", "");
      setValue("car", "");
      setValue("driver", "");
      setValue("price_uzs", "");
      setValue("driver_expenses_uzs", "");
      setValue("cargo_info", "");
    }
  }, [flight_type, setValue, image, regions, watch]);

  const { mutate: createMutation } = useMutation({
    mutationFn: createFlight,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["recycled"] });
      toast.success(" Сохранено успешно!");
      push(`/flight`);
    },
    onError: () => {
      toast.error("Ошибка сохранения!");
    },
  });
  const { mutate: updateCarMutation } = useMutation({
    mutationFn: updateCarDistance,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["flight-one"] });
    },
    onError: () => {
      toast.error("Ошибка сохранения!");
    },
  });
  const onSubmit = (data: IFlightData) => {
    createMutation({
      ...data,
      upload: image?.id,
      driver_expenses_uzs: Number(
        removeCommas(data?.driver_expenses_uzs?.toString())
      ),
      driver_expenses: Number(
        removeCommas(data?.driver_expenses_uzs?.toString())
      ),
      price_uzs: Number(removeCommas(data?.price_uzs?.toString())),
      price: Number(removeCommas(data?.price_uzs?.toString())),
      flight_expenses: Number(removeCommas(data?.flight_expenses?.toString())),
      other_expenses: Number(removeCommas(data?.other_expenses?.toString())),
      flight_balance: data?.flight_expenses_uzs,
      flight_balance_uzs: data?.flight_expenses_uzs,
      arrival_date: data?.arrival_date || null,
    });
    updateCarMutation({
      id: selectedCar?.value as string,
      distance_travelled: data?.start_km,
    });
    reset();
  };

  const handleSelectChange = (value: string, name: string) => {
    setValue(name as "region", value);
  };
  const handleSelectCar = (newValue: SingleValue<Option>) => {
    setSelectedCar(newValue);
    setValue("car", newValue?.value as string);
  };
  const handleSelectDriver = (newValue: SingleValue<Option>) => {
    setSelectedDriver(newValue);
    setValue("driver", newValue?.value as string);
  };
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
            <Controller
              name="flight_type"
              control={methods.control}
              rules={{ required: "Поле обязательно для заполнения." }}
              render={({ field }) => (
                <Selector onValueChange={field.onChange} value={field.value}>
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
                </Selector>
              )}
            />
            {errors?.flight_type && (
              <p className="text-red-500">{errors?.flight_type?.message}</p>
            )}
          </div>

          {/* Car Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Выберите автомобиль*</label>
            <Select
              {...register("car", {
                required: "Это значение является обязательным",
              })}
              options={carOptions}
              value={selectedCar}
              onChange={handleSelectCar}
              placeholder={"Isuzu 01A111AA"}
              noOptionsMessage={() => "Не найдено"}
            />
            {errors?.car && (
              <p className="text-red-500">{errors?.car?.message}</p>
            )}
          </div>

          {/* City Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Выберите область*</label>
            <Controller
              name="region"
              control={methods.control}
              rules={{ required: "Поле обязательно для заполнения." }}
              render={({ field }) => (
                <Selector onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите..." />
                  </SelectTrigger>
                  <SelectContent>
                    {regions
                      ?.filter((item) => item?.flight_type === flight_type)
                      ?.map((region) => (
                        <SelectItem key={region.id} value={region.id as string}>
                          {region.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Selector>
              )}
            />
            {errors?.region && (
              <p className="text-red-500">{errors?.region?.message}</p>
            )}
          </div>

          {/* Driver Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Выберите водителя*</label>
            <Select
              {...register("driver", {
                required: "Это значение является обязательным",
              })}
              options={driverOptions}
              value={selectedDriver}
              onChange={handleSelectDriver}
              placeholder={"Выберите водителя"}
              noOptionsMessage={() => "Выберите регион*"}
            />
            {errors?.driver && (
              <p className="text-red-500">{errors?.driver?.message}</p>
            )}
          </div>

          {/* Route Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Маршрут*</label>
            <Selector
              onValueChange={(value) => handleSelectChange(value, "route")}
              {...register("route", { required: "Требуется маршрут" })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Выберите..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={"GONE_TO"}>Туда</SelectItem>
                <SelectItem value={"BEEN_TO"}>Туда и обратно</SelectItem>
              </SelectContent>
            </Selector>
            {errors?.route && (
              <p className="text-red-500">{errors?.route?.message}</p>
            )}
          </div>

          {/* Trip Price */}
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Введите стоимость рейса*
            </label>
            <CurrencyInputWithSelect name="price" />
            {/* {errors?.price_uzs && (
              <p className="text-red-500">{errors?.price_uzs?.message}</p>
            )} */}
          </div>

          {/* Departure Date */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Введите дату отъезда*</label>
            <Input
              type="date"
              placeholder="Введите дату"
              {...register("departure_date", {
                required: "Это значение является обязательным",
              })}
            />
            {errors?.departure_date && (
              <p className="text-red-500">{errors?.departure_date?.message}</p>
            )}
          </div>

          {/* Spending */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Расходы водителя*</label>
            <CurrencyInputWithSelect name="driver_expenses" />
            {/* {errors?.driver_expenses_uzs && (
              <p className="text-red-500">{errors?.driver_expenses_uzs?.message}</p>
            )} */}
          </div>

          {/* Arrival Date */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Введите дату прибытия</label>
            <Input
              type="date"
              placeholder="Введите дату"
              {...register("arrival_date", {
                required:
                  route === "BEEN_TO"
                    ? "Это значение является обязательным"
                    : false,
              })}
            />
            {errors?.arrival_date && (
              <p className="text-red-500">{errors?.arrival_date?.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Расходы на Рейс*</label>
            <CurrencyInputWithSelect name="flight_expenses" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Введите текущий пробег*
            </label>
            <Input
              placeholder="Текущий пробег"
              type="number"
              {...register("start_km", {
                required: "Введите текущий пробег",
                valueAsNumber: true,
                validate: (value) =>
                  value < distance
                    ? `Расстояние должно быть больше ${distance}`
                    : true,
              })}
            />
            {errors?.start_km && (
              <p className="text-red-500">{errors?.start_km?.message}</p>
            )}
          </div>
          {flight_type === "OUT" && (
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Расход на питание (за день)
              </label>
              <CurrencyInputWithSelect name="other_expenses" />
            </div>
          )}
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
        {flight_type !== "IN_UZB" && (
          <div className="grid grid-cols-2 gap-6">
            <FileUploader image={image} setImage={setImage} type=".xlsx" />
          </div>
        )}

        <div className="w-full flex justify-end gap-6">
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
