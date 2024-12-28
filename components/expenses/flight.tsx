import { useForm, FormProvider } from "react-hook-form";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "../ui/button";
import { useEffect, useState } from "react";
import { Option } from "@/pages/warehouse/diesel";
import { useMutation, useQuery } from "@tanstack/react-query";
import Select, { SingleValue } from "react-select";
import { createFinance } from "@/lib/actions/finance.action";
import { queryClient } from "../ui-items/ReactQueryProvider";
import { toast } from "react-toastify";
import { removeCommas } from "@/lib/utils";
import { SalaryFormData } from "./salary";
import { useRouter } from "next/router";
import { fetchAllFlights } from "@/lib/actions/flight.action";
import { IFlightFormEdit } from "@/lib/types/flight.types";
import { Input } from "../ui/input";
import CurrencyInputWithSelect from "../ui-items/currencySelect";

export default function FlightForm() {
  const methods = useForm<SalaryFormData>();
  const {
    register,
    setValue,
    formState: { errors },
    reset,
  } = methods;
  const [flightOptions, setFlightOptions] = useState<Option[]>([]);
  const [selectedFlight, setSelectedFlight] = useState<Option | null>(null);
  const [balance, setBalance] = useState(0);
  const { id } = useRouter()?.query;

  const { data: flights } = useQuery<IFlightFormEdit[]>({
    queryKey: ["all_flights"],
    queryFn: fetchAllFlights,
  });
  useEffect(() => {
    const carOption = flights
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
    setFlightOptions(carOption as Option[]);
    const balance = flights?.find(
      (item) => selectedFlight?.value === item?.id
    )?.flight_balance;
    setBalance(balance as number);
  }, [flights, selectedFlight?.value]);

  const { mutate: createMutation } = useMutation({
    mutationFn: createFinance,
    onSuccess: () => {
      reset();
      setSelectedFlight(null);
      queryClient.invalidateQueries({ queryKey: ["finance"] });
      toast.success(" Сохранено успешно!");
    },
    onError: () => {
      toast.error("Ошибка сохранения!");
    },
  });

  const onSubmit = (data: SalaryFormData) => {
    const formData = {
      ...data,
      action: "OUTCOME",
      amount: Number(removeCommas(data?.amount as string)),
      car: "",
      employee: "",
      kind: id as string,
    };
    createMutation(formData);
  };

  const handleSelectFlight = (newValue: SingleValue<Option>) => {
    setSelectedFlight(newValue);
    setValue("flight", newValue?.value as string);
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
                <label className="text-sm font-medium">Причина*</label>
                <Input
                  {...register("reason", { required: "Введите причину" })}
                  placeholder="Введите причину..."
                />
                {errors?.reason && (
                  <p className="text-red-500">{errors?.reason?.message}</p>
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
              <label className="text-sm font-medium">Баланс Рейса</label>
              <Input
                  value={balance}
                  className="bg-muted"
                  readOnly
                  placeholder="Введите причину..."
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">
                Комментарий о ремонте
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
