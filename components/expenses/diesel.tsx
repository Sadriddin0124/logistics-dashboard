import { useForm, FormProvider } from "react-hook-form";
import { Button } from "../ui/button";
import { useEffect, useState } from "react";
import { Option } from "@/pages/warehouse/diesel";
import { useMutation, useQuery } from "@tanstack/react-query";
import Select, { SingleValue } from "react-select";
import { createFinance } from "@/lib/actions/finance.action";
import { queryClient } from "../ui-items/ReactQueryProvider";
import { toast } from "react-toastify";
import { fetchAllFlights } from "@/lib/actions/flight.action";
import { IFlightFormEdit } from "@/lib/types/flight.types";
import CurrencyInputWithSelect from "../ui-items/currencySelect";
import { fetchCarNoPage } from "@/lib/actions/cars.action";
import { ICars } from "@/lib/types/cars.types";
import { Input } from "../ui/input";
import { removeCommas } from "@/lib/utils";
import { useRouter } from "next/router";
import { Textarea } from "../ui/textarea";

interface FormValues {
  action: string;
  amount_uzs: string;
  amount: string;
  kind: string;
  flight: string;
  driver: string;
  car: string;
  balance: string;
  comment: string;
  reason: string;
  volume: string;
}

export default function DieselExpense() {
  const methods = useForm<FormValues>();
  const {
    register,
    setValue,
    formState: { errors },
  } = methods;
  const [flightOptions, setFlightOptions] = useState<Option[]>([]);
  const [selectedFlight, setSelectedFlight] = useState<Option | null>(null);
  const [carOptions, setCarOptions] = useState<Option[]>([]);
  const [selectedCar, setSelectedCar] = useState<Option | null>(null);
  const { id } = useRouter()?.query
  const { data: cars } = useQuery<ICars[]>({
    queryKey: ["cars"],
    queryFn: fetchCarNoPage,
  });
  const { data: flights } = useQuery<IFlightFormEdit[]>({
    queryKey: ["all_flights"],
    queryFn: fetchAllFlights,
  });
  useEffect(() => {
    const flightOption = flights
      ?.filter((item) => item?.status?.toLowerCase() === "active")
      ?.map((flight) => {
        let regionName: string | undefined;
        let carName: string | undefined;
        let modelName: string | undefined;
        if (typeof flight?.region === "object" && "id" in flight.region) {
          regionName = flight.region.name;
        }
        if (typeof flight?.car === "object" && "id" in flight.car) {
          carName = flight.car.name;
          modelName = flight.car.models?.name;
        }
        return {
          label: `${regionName} ${carName} ${modelName}`,
          value: flight?.id,
        };
      });
    setFlightOptions(flightOption as Option[]);
    const carOption = cars
      ?.filter((item) => item?.type_of_payment === "LEASING" && item?.fuel_type === "DIESEL")
      ?.map((car) => ({
        label: `${car?.name} ${car?.number}`,
        value: car?.id,
      }));
    setCarOptions(carOption as Option[]);
  }, [flights, cars]);

  // const { mutate: createMutation } = useMutation({
  //   mutationFn: createFinanceDiesel,
  //   onSuccess: () => {
  //     reset();
  //     setSelectedFlight(null);
  //     queryClient.invalidateQueries({ queryKey: ["finance"] });
  //     toast.success(" Сохранено успешно!");
  //   },
  //   onError: () => {
  //     toast.error("Ошибка сохранения!");
  //   },
  // });
   const { mutate: createFinanceMutation } = useMutation({
      mutationFn: createFinance,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["finance"] });
        toast.success("Данные успешно добавлены!");
        methods.reset();
        setSelectedCar(null);
      },
      onError: () => {
        toast.error("Ошибка при добавлении данных!");
      },
    });
  
    const onSubmit = (data: FormValues) => {
      const formData = {
        ...data,
        car: data?.car,
        action: "OUTCOME",
        amount: Number(removeCommas(data?.amount as string)),
        employee: "",
        kind: id as string,
      };
      createFinanceMutation(formData);
    };

  // const onSubmit = (data: IFinanceDiesel) => {
  //     console.log(data);
  //     const formData = {
  //       ...data,
  //       price: Number(removeCommas(data?.price as string))
  //     }
  //   createMutation(formData);
  // };

  const handleSelectFlight = (newValue: SingleValue<Option>) => {
    setSelectedFlight(newValue);
    setValue("flight", newValue?.value as string);
  };

  const handleSelectCar = (newValue: SingleValue<Option>) => {
    setSelectedCar(newValue);
    setValue("car", newValue?.value as string);
  };
  return (
    <div>
      <FormProvider {...methods}>
        <form
          onSubmit={methods.handleSubmit(onSubmit)}
          className="flex flex-col"
        >
          <h2 className="text-2xl font-semibold">Отправление в рейс</h2>
          <div className="grid grid-cols-1 gap-4 mt-4">
            <div className=" grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Выберите автомобиль*
                </label>
                <Select
                  options={carOptions}
                  value={selectedCar}
                  onChange={handleSelectCar}
                  placeholder="Выберите..."
                  noOptionsMessage={() => "Не найдено"}
                />
                {errors.car && (
                  <p className="text-red-500">{errors.car?.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Введите сумму расхода.*
                </label>
                <CurrencyInputWithSelect name="amount" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Выберите рейс*</label>
                <Select
                  {...register("flight", { required: "Выберите рейс" })}
                  options={flightOptions}
                  value={selectedFlight}
                  onChange={handleSelectFlight}
                  placeholder="Выберите..."
                  noOptionsMessage={() => "Не найдено"}
                />
                {errors?.flight && (
                  <p className="text-red-500">{errors?.flight?.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">
                Введите количество Солярканого топлива*
                </label>
                <Input {...register("volume", {required: "Обязательно указывается количество Солярканого топлива.", valueAsNumber: true})} />
              </div>
              {errors?.volume && (
                  <p className="text-red-500">{errors?.volume?.message}</p>
                )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">
                Комментарий
              </label>
              <Textarea
                placeholder="Напишите комментарий..."
                className="min-h-[120px] resize-none"
                {...register("comment")}
              />
            </div>
            <div className="w-full justify-end flex">
              <Button
                type="submit"
                className="bg-[#4880FF] text-white hover:bg-blue-600 w-[300px] rounded-md"
              >
                Добавит
              </Button>
            </div>
          </div>
        </form>
      </FormProvider>
    </div>
  );
}
