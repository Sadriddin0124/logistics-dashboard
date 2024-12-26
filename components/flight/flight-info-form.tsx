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
import { Textarea } from "@/components/ui/textarea";
import { useEffect, useState } from "react";
import { ImageType } from "@/lib/types/file.types";
import { FileUploader } from "../ui-items/FileUploader";
import { CurrencyInputs } from "../ui-items/currency-inputs";
import { IFlightCreate, IFlightForm } from "@/lib/types/flight.types";
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

export default function FlightInfoForm() {
  const methods = useForm<IFlightCreate>();
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = methods;
  const [image, setImage] = useState<ImageType>({ id: "", file: "" });
  const region = watch("region");
  const flight_type = watch("flight_type");
  const [driverOptions, setDriverOptions] = useState<Option[]>([]);
  const [selectedDriver, setSelectedDriver] = useState<Option | null>(null);
  const [carOptions, setCarOptions] = useState<Option[]>([]);
  const [selectedCar, setSelectedCar] = useState<Option | null>(null);
  const { id } = useRouter()?.query;
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
  const { data: flight } = useQuery<IFlightForm>({
    queryKey: ["flight-one", id],
    queryFn: () => fetchFlight(id as string),
    enabled: !!id,
  });
  useEffect(() => {
    if (employeeList) {
      const driverOption = employeeList.map((driver) => ({
        label: driver?.full_name,
        value: driver?.id,
      }));
      const driverDefault = driverOption.find(
        (driver) => driver?.value === flight?.driver
      );
      setDriverOptions(driverOption as Option[]);
      setSelectedDriver((driverDefault as Option) || null);
    }

    if (cars) {
      const carOption = cars.map((car) => ({
        label: `${car?.name} ${car?.number}`,
        value: car?.id,
      }));
      const carDefault = carOption.find(
        (car) => car?.value === flight?.car?.id
      );
      setCarOptions(carOption as Option[]);
      setSelectedCar((carDefault as Option) || null);
    }
    
    
  }, [cars, employeeList, flight]);
  
  useEffect(() => {
    if (flight) {
      setValue("arrival_date", flight?.arrival_date);
      setValue("departure_date", flight?.departure_date);
      setValue("car", flight?.car?.id as string);
      setValue("driver", flight?.driver);
      setValue("region", flight?.region?.id as string);
      setValue("cargo_info", flight?.cargo_info);
      setValue("price_uzs", Number(flight?.price_uzs));
      setValue("driver_expenses_uzs", Number(flight?.driver_expenses_uzs));
      setValue("flight_type", flight?.flight_type);
      setImage({ id: flight?.upload as string, file: "" });
    }
  }, [flight, setValue]);
  const { mutate: createMutation } = useMutation({
    mutationFn: updateFlightData,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["recycled"] });
      toast.success(" muvaffaqiyatli qo'shildi!");
    },
    onError: () => {
      toast.error("ni qo'shishda xatolik!");
    },
  });
  const onSubmit = (data: IFlightCreate) => {
    createMutation({
      ...data,
      id: id as string,
      driver_expenses_usd: Number(data?.driver_expenses_usd),
      driver_expenses_uzs: Number(data?.driver_expenses_uzs),
      price_uzs: Number(data?.price_uzs),
      price_usd: Number(data?.price_usd),
      // upload: image?.id
    });
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
            <Selector
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
            <label className="text-sm font-medium">Выберите автомобиль*</label>
            <Select
              options={carOptions}
              value={selectedCar}
              onChange={handleSelectCar}
              placeholder={"Isuzu 01A111AA"}
              noOptionsMessage={() => "Type to add new option..."}
            />
          </div>

          {/* City Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Выберите область*</label>
            <Selector
              value={flight?.region?.id || ""}
              onValueChange={(value) => handleSelectChange(value, "region")}
            >
              <SelectTrigger>
                <SelectValue placeholder="Выберите..." />
              </SelectTrigger>
              <SelectContent>
              {regions?.filter(item=> item?.flight_type === flight_type)?.map((region) => (
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
              {...register("driver", { required: "Required" })}
              options={driverOptions}
              value={selectedDriver}
              onChange={handleSelectDriver}
              placeholder={"Выберите водителя"}
              noOptionsMessage={() => "Type to add new option..."}
            />
            {errors?.driver && (
              <p className="text-red-500">{errors?.driver?.message}</p>
            )}
          </div>

          {/* Route Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Маршрут*</label>
            <Selector
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
          {flight && <EndFlight id={id as string} />}
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
