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
import { IFlightData, IOrderedFlight } from "@/lib/types/flight.types";
import { useMutation, useQuery } from "@tanstack/react-query";
import { queryClient } from "../ui-items/ReactQueryProvider";
import { toast } from "react-toastify";
import {
  fetchOrderedFlight,
  updateOrderedFlight,
} from "@/lib/actions/flight.action";
import { IRegion } from "@/lib/types/regions.types";
import { fetchRegionsAll } from "@/lib/actions/region.action";
import { removeCommas } from "@/lib/utils";
import { useRouter } from "next/router";
import { useEffect } from "react";
import EndOrderedFlight from "./end-ordered";

export default function OrderFlightFormInfo() {
  const methods = useForm<IFlightData>();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = methods;
  const router = useRouter();
  const { push } = router;
  const { id } = router.query;
  const { data: ordered } = useQuery<IOrderedFlight>({
    queryKey: ["flight-ordered", id],
    queryFn: () => fetchOrderedFlight(id as string),
    enabled: !!id,
  });
  const { data: regions } = useQuery<IRegion[]>({
    queryKey: ["regions"],
    queryFn: fetchRegionsAll,
  });

  useEffect(() => {
    if (ordered) {
      setValue("region", ordered?.region?.id as string);
      setValue("driver_name", ordered?.driver_name as string);
      setValue("driver_number", ordered?.driver_number as string);
      setValue("car_number", ordered?.car_number as string);
      setValue("cargo_info", ordered?.cargo_info as string);
      setValue("driver_expenses_uzs", ordered?.driver_expenses_uzs as string);
      setValue("price_uzs", ordered?.price_uzs as string);
    }
  }, [ordered, setValue]);

  const { mutate: updateMutation } = useMutation({
    mutationFn: updateOrderedFlight,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["recycled"] });
      toast.success(" muvaffaqiyatli qo'shildi!");
      push(`/flight`);
    },
    onError: () => {
      toast.error("ni qo'shishda xatolik!");
    },
  });
  const onSubmit = (data: IFlightData) => {
    updateMutation({
      ...data,
      region: data?.region,
      status: data?.status?.toUpperCase(),
      driver_expenses_uzs: Number(
        removeCommas(data?.driver_expenses_uzs as string)
      ),
      arrival_date: data?.arrival_date || "2024-12-26",
      departure_date: data?.arrival_date || "2024-12-26",
      price_uzs: Number(removeCommas(data?.price_uzs as string)),
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
              value={ordered?.region?.id}
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
          <EndOrderedFlight id={id as string} />
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
