import { FormProvider, useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Select as Selector,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { ImageType } from "@/lib/types/file.types";
import { FileUploader } from "../ui-items/FileUploader";
import { IFlightFormEdit } from "@/lib/types/flight.types";
import { useMutation, useQuery } from "@tanstack/react-query";
import { queryClient } from "../ui-items/ReactQueryProvider";
import { toast } from "react-toastify";
import { updateFlightData, fetchFlight } from "@/lib/actions/flight.action";
import { Option } from "@/pages/warehouse/diesel";
import { fetchCarNoPage } from "@/lib/actions/cars.action";
import { ICars } from "@/lib/types/cars.types";
import Select, { SingleValue } from "react-select";
import { IRegion } from "@/lib/types/regions.types";
import { fetchRegionsAll } from "@/lib/actions/region.action";
import { IEmployee } from "@/lib/types/employee.types";
import { fetchEmployeesAll } from "@/lib/actions/employees.action";
import { useRouter } from "next/router";
import EndFlight from "./end-flight";
import CurrencyInputWithSelect from "../ui-items/currencySelect";
import { removeCommas } from "@/lib/utils";
import { API_URL } from "@/pages/api/api";

function calculateDaysBetweenDates(start: string, end: string): number {
  // Parse the dates into Date objects
  const startDate = new Date(start);
  const endDate = new Date(end);

  // Validate the dates
  if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
    throw new Error("Invalid date format. Use 'YYYY-MM-DD'.");
  }

  // Calculate the difference in time (milliseconds)
  const diffInMs = endDate.getTime() - startDate.getTime();

  // Convert the difference from milliseconds to days
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  return diffInDays;
}


export default function FlightInfoForm() {
  const methods = useForm<IFlightFormEdit>();
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = methods;

  const [image, setImage] = useState<ImageType>({ id: "", file: "" });
  const region = watch("region");
  const flight_type = watch("flight_type");
  const status = watch("status");
  const departure_date = watch("departure_date");
  const arrival_date = watch("arrival_date");

  const [driverOptions, setDriverOptions] = useState<Option[]>([]);
  const [selectedDriver, setSelectedDriver] = useState<Option | null>(null);
  const [carOptions, setCarOptions] = useState<Option[]>([]);
  const [selectedCar, setSelectedCar] = useState<Option | null>(null);
  const [driver, setDriver] = useState<IEmployee | null>(null);
  const [car, setCar] = useState<ICars | null>(null);
  const [travelPeriod, setTravelPeriod] = useState<number>(0)
  const { id } = useRouter()?.query;

  // Fetch Data
  const { data: cars } = useQuery<ICars[]>({
    queryKey: ["cars"],
    queryFn: fetchCarNoPage,
  });
  const { data: regions } = useQuery<IRegion[]>({
    queryKey: ["regions"],
    queryFn: fetchRegionsAll,
  });
  const { data: employeeList } = useQuery<IEmployee[]>({
    queryKey: ["employees"],
    queryFn: fetchEmployeesAll,
  });
  const { data: flight } = useQuery<IFlightFormEdit>({
    queryKey: ["flight-one", id],
    queryFn: () => fetchFlight(id as string),
    enabled: !!id,
  });

  // Map options
  useEffect(() => {
    if (employeeList) {
      const driverOption = employeeList.map((driver) => ({
        label: driver.full_name,
        value: driver.id,
      }));
      setDriverOptions(driverOption as Option[]);
      const driver = employeeList?.find((item) => item?.id === flight?.driver);
      setDriver(driver as IEmployee);
      const driverDefault = driverOption.find(
        (driver) => driver.value === flight?.driver
      );
      setSelectedDriver(driverDefault as Option);
    }

    if (cars) {
      const carOption = cars.map((car) => ({
        label: `${car?.name} ${car?.number}`,
        value: car?.id,
      }));
      setCarOptions(carOption as Option[]);
      let carId: string | undefined;
      if (typeof flight?.car === "object" && "id" in flight.car) {
        carId = flight.car.id;
      }
      const carDefault = carOption.find((car) => car.value === carId);
      setSelectedCar(carDefault as Option);
      const carItem = cars?.find((item) => item?.id === carId);
      setCar(carItem as ICars);
    }
    if (arrival_date) {
      setTravelPeriod(calculateDaysBetweenDates(departure_date, arrival_date as string))
    }
  }, [employeeList, cars, flight, car, arrival_date, departure_date]);
  console.log(travelPeriod);
  
  // Reset form on flight data change
  useEffect(() => {
    if (flight) {
      reset(flight);
      setImage({
        id: flight?.upload?.id || "",
        file: `${API_URL}${flight?.upload?.file}`,
      });
      setValue(
        "region",
        typeof flight?.region === "object" && "id" in flight.region
          ? (flight?.region?.id as string)
          : ""
      );
    }
  }, [flight, reset, setValue]);

  // Mutation for form submission
  const { mutate: createMutation } = useMutation({
    mutationFn: updateFlightData,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["recycled"] });
      toast.success("Сохранено успешно!");
    },
    onError: () => {
      toast.error("Ошибка сохранения!");
    },
  });

  // Form submission handler
  const onSubmit = (data: IFlightFormEdit) => {
    let regionId: string | undefined;
    if (typeof flight?.region === "object" && "id" in flight.region) {
      regionId = flight.region.id;
    }
    createMutation({
      ...data,
      id: id as string,
      region: regionId as string,
      car: selectedCar?.value as string,
      upload: image.id,
      arrival_date: data?.arrival_date || null,
      price:
        data?.price != null
          ? typeof data.price === "string"
            ? Number(removeCommas(data.price))
            : data.price
          : undefined,
      flight_expenses:
        typeof data?.flight_expenses === "string"
          ? Number(removeCommas(data?.flight_expenses as string))
          : data?.flight_expenses,
      other_expenses:
        typeof data?.other_expenses === "string"
          ? Number(removeCommas(data?.other_expenses as string))
          : data?.other_expenses,
      driver_expenses:
        data?.driver_expenses != null
          ? typeof data?.driver_expenses === "string"
            ? Number(removeCommas(data?.driver_expenses as string))
            : data?.driver_expenses
          : undefined,
    });
  };

  // Handlers for select components
  const handleSelectChange = (value: string, name: string) => {
    setValue(name as "region", value);
  };
  const handleSelectCar = (newValue: SingleValue<Option>) => {
    setSelectedCar(newValue);
    setValue("car", newValue?.value || "");
  };
  const handleSelectDriver = (newValue: SingleValue<Option>) => {
    setSelectedDriver(newValue);
    setValue("driver", newValue?.value || "");
  };
  return (
    <div className="mt-8 bg-white p-12 rounded-2xl">
      <FormProvider {...methods}>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-6 w-full container mx-auto"
        >
          <div className="grid grid-cols-2 gap-6">
            {/* Region Selection */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Выберите регион*</label>
              <Selector
                disabled={
                  flight?.status?.toLowerCase() === "inactive" ? true : false
                }
                value={flight?.flight_type || ""}
                onValueChange={(value) =>
                  handleSelectChange(value, "flight_type")
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Выберите..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="OUT">За территории Узбекистана</SelectItem>
                  <SelectItem value="IN_UZB">
                    На территории Узбекистана.
                  </SelectItem>
                </SelectContent>
              </Selector>
            </div>

            {/* Car Selection */}
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Выберите автомобиль*
              </label>
              <Select
                isDisabled={
                  flight?.status?.toLowerCase() === "inactive" ? true : false
                }
                options={carOptions}
                value={selectedCar}
                onChange={handleSelectCar}
                placeholder={"Isuzu 01A111AA"}
                noOptionsMessage={() => "Не найдено"}
              />
            </div>

            {/* City Selection */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Выберите область*</label>
              <Selector
                disabled={
                  flight?.status?.toLowerCase() === "inactive" ? true : false
                }
                onValueChange={(value) => handleSelectChange(value, "region")}
              >
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
            </div>

            {/* Driver Selection */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Выберите водителя*</label>
              <Select
                isDisabled={
                  flight?.status?.toLowerCase() === "inactive" ? true : false
                }
                {...register("driver", {
                  required: "Это значение является обязательным",
                })}
                options={driverOptions}
                value={selectedDriver}
                onChange={handleSelectDriver}
                placeholder={"Выберите водителя"}
                noOptionsMessage={() => "Не найдено"}
              />
              {errors?.driver && (
                <p className="text-red-500">{errors?.driver?.message}</p>
              )}
            </div>

            {/* Route Selection */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Маршрут*</label>
              <Selector
                disabled={
                  flight?.status?.toLowerCase() === "inactive" ? true : false
                }
                value={flight?.route || ""}
                onValueChange={(value) => handleSelectChange(value, "route")}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Выберите..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={"GONE_TO"}>Иду</SelectItem>
                  <SelectItem value={"BEEN_TO"}>Прихожу</SelectItem>
                </SelectContent>
              </Selector>
            </div>

            {/* Trip Price */}
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Введите стоимость рейса*
              </label>
              <CurrencyInputWithSelect disabled name="price" />
            </div>

            {/* Departure Date */}
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Введите дату отъезда*
              </label>
              <Input
                type="date"
                disabled={
                  flight?.status?.toLowerCase() === "inactive" ? true : false
                }
                placeholder="Введите дату"
                {...register("departure_date")}
              />
            </div>

            {/* Spending */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Расходы водителя*</label>
              <CurrencyInputWithSelect disabled name="driver_expenses" />
            </div>

            {/* Arrival Date */}
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Введите дату прибытия*
              </label>
              <Input
                type="date"
                disabled={
                  flight?.status?.toLowerCase() === "inactive" ? true : false
                }
                placeholder="Введите дату"
                {...register("arrival_date")}
              />
            </div>
            {flight_type === "OUT" && (
              <div className="space-y-2">
                <label className="text-sm font-medium">Расход на питание</label>
                <CurrencyInputWithSelect disabled name="other_expenses" />
              </div>
            )}
            <div className="space-y-2 hidden">
              <label className="text-sm font-medium">Расходы на Рейс*</label>
              <CurrencyInputWithSelect disabled name="flight_expenses" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Баланс Рейса</label>
              <Input
                value={flight?.flight_balance}
                className="bg-muted"
                readOnly
              />
            </div>
          </div>

          {/* Cargo Information */}
          {/* <div className="space-y-2">
          <label className="text-sm font-medium">Информация о грузе</label>
          <Textarea
            placeholder="Введите информацию о грузе"
            className="min-h-[100px]"
            {...register("cargo_info")}
          />
        </div> */}

          {/* Expenses */}
          {region !== "IN_UZB" && (
            <div className="grid grid-cols-2 gap-6">
              <FileUploader image={image} setImage={setImage} type=".xlsx" />
            </div>
          )}
          {status?.toLowerCase() !== "inactive" && (
            <div className="w-full flex justify-end gap-6">
              <Button
                type="submit"
                className="bg-[#4880FF] text-white hover:bg-blue-600 w-[250px] rounded-md"
              >
                Сохранить
              </Button>
            </div>
          )}
        </form>
      </FormProvider>
      <div className="w-full flex justify-end gap-6 mt-3">
        {status?.toLowerCase() !== "inactive" && (
          <EndFlight
            id={id as string}
            balance={Number(flight?.flight_expenses_uzs)}
            driver={driver as IEmployee}
            car={car as ICars}
            arrival_date={arrival_date as string}
            expenses_cook={((flight?.other_expenses_uzs ?? 0) * travelPeriod)}
            expense={flight?.driver_expenses_uzs as number}
          />
        )}
      </div>
    </div>
  );
}
