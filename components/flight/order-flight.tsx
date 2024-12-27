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
import { CurrencyInputs } from "../ui-items/currency-inputs";
import { IFlightData } from "@/lib/types/flight.types";
import { useMutation, useQuery } from "@tanstack/react-query";
import { queryClient } from "../ui-items/ReactQueryProvider";
import { toast } from "react-toastify";
import { orderFlight } from "@/lib/actions/flight.action";
import { IRegion } from "@/lib/types/regions.types";
import { fetchRegionsAll } from "@/lib/actions/region.action";
import { removeCommas } from "@/lib/utils";
import { useRouter } from "next/router";

export default function FlightForm() {
  const methods = useForm<IFlightData>();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = methods;
  const { push } = useRouter();

  const { data: regions } = useQuery<IRegion[]>({
    queryKey: ["regions"],
    queryFn: fetchRegionsAll,
  });

  const { mutate: createMutation } = useMutation({
    mutationFn: orderFlight,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["recycled"] });
      toast.success(" Сохранено успешно!");
      push(`/flight`);
    },
    onError: () => {
      toast.error("Ошибка сохранения!");
    },
  });
  const onSubmit = (data: IFlightData) => {
    createMutation({
      ...data,
      driver_expenses_uzs: Number(
        removeCommas(data?.driver_expenses_uzs as string)
      ),
      arrival_date: data?.arrival_date || "2024-12-26",
      departure_date: data?.arrival_date || "2024-12-26",
      price_uzs: Number(removeCommas(data?.price_uzs as string)),
      // upload: image?.id
    });
  };

  const handleSelectChange = (value: string, name: string) => {
    setValue(name as "region", value);
  };
  return (
    <FormProvider {...methods}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-6 w-full container mx-auto mt-8 bg-white p-12 rounded-2xl"
      >
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">Выберите область*</label>
            <Selector
              onValueChange={(value) => handleSelectChange(value, "region")}
              {...register("region", { required: "Выбор региона обязателен" })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Выберите..." />
              </SelectTrigger>
              <SelectContent>
                {regions
                  ?.filter((item) => item?.flight_type === "IN_UZB")
                  ?.map((region) => (
                    <SelectItem key={region.id} value={region.id as string}>
                      {region.name}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Selector>
            {errors?.region && (
              <p className="text-red-500">{errors?.region?.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Введите имя водителя</label>
            <Input
              placeholder="Введите..."
              {...register("driver_name", {
                required: "Имя водителя обязателен",
              })}
            />
            {errors?.driver_name && (
              <p className="text-red-500">{errors?.driver_name?.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Введите стоимость рейса*
            </label>
            <CurrencyInputs name="price" />
            {errors?.price_uzs && (
              <p className="text-red-500">{errors?.price_uzs?.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">
              Введите номер водителя
            </label>
            <Input
              placeholder="Введите..."
              {...register("driver_number", {
                required: "Номер водителя обязателен",
              })}
              
            />
            {errors?.driver_number && (
              <p className="text-red-500">{errors?.driver_number?.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Расходы водителя*</label>
            <CurrencyInputs name="driver_expenses" />
            {errors?.driver_expenses_uzs && (
              <p className="text-red-500">
                {errors?.driver_expenses_uzs?.message}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Введите номер автомобиля
            </label>
            <Input
              placeholder="Введите..."
              {...register("car_number", {
                required: "Номер автомобиля обязателен",
              })}
              onChange={(e)=> {
                const value = e.target.value
                setValue("car_number", value.toUpperCase())
              }}
            />
            {errors?.car_number && (
              <p className="text-red-500">{errors?.car_number?.message}</p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Информация о грузе</label>
          <Textarea
            placeholder="Введите информацию о грузе"
            className="min-h-[100px]"
            {...register("cargo_info")}
          />
        </div>

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
