import React, { useEffect, useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import Select, { SingleValue } from "react-select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useMutation, useQuery } from "@tanstack/react-query";
import { queryClient } from "@/components/ui-items/ReactQueryProvider";
import { toast } from "react-toastify";
import { fetchCarNoPage } from "@/lib/actions/cars.action";
import { ICars } from "@/lib/types/cars.types";
import { createDieselSale, fetchDiesel } from "@/lib/actions/diesel.action";
import { IDieselPaginated, IDieselSale } from "@/lib/types/diesel.types";
import SaleDiesel from "@/components/warehouse/diesel/sale";

interface Option {
  value: string;
  label: string;
}

export default function DieselFill() {
  const methods = useForm<IDieselSale>();
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = methods;
  const [carOptions, setCarOptions] = useState<Option[]>([]);
  const [selectedCar, setSelectedCar] = useState<Option | null>(null);

  const { data: cars } = useQuery<ICars[]>({
    queryKey: ["cars"],
    queryFn: fetchCarNoPage,
  });

  const { data: diesel } = useQuery<IDieselPaginated>({
    queryKey: ["diesel"],
    queryFn: () => fetchDiesel(1),
  });

  useEffect(() => {
    if (cars) {
      const carOption = cars?.filter(item=> item?.fuel_type === "DIESEL")?.map((car) => ({
        label: `${car?.name} ${car?.number}`,
        value: car?.id,
      }));
      setCarOptions(carOption as Option[]);
    }
  }, [cars]);

  const { mutate: createMutation } = useMutation({
    mutationFn: createDieselSale,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["diesel"] });
      queryClient.invalidateQueries({ queryKey: ["diesel_sale"] });
      setSelectedCar(null);
      toast.success("Сохранено успешно!");
    },
    onError: () => {
      toast.error("Ошибка сохранения!");
    },
  });

  const onSubmit = (data: IDieselSale) => {
    createMutation(data);
    reset();
  };

  const handleSelectCar = (newValue: SingleValue<Option>) => {
    setSelectedCar(newValue);
    setValue("car", newValue?.value as string);
  };

  const diesel_volume = diesel?.results?.[0]?.remaining_volume;

  return (
    <div className="w-full p-4 space-y-8 container mx-auto">
      <Card>
        <CardContent className="p-6 space-y-6">
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="mb-2">Выберите автомобиль</label>
                  <Select
                  {...register("car", {required: true})}
                    options={carOptions}
                    value={selectedCar}
                    onChange={handleSelectCar}
                    placeholder="Isuzu 01A111AA"
                    noOptionsMessage={() => "Не найдено"}
                    isClearable
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm">
                    Введите количество залитого топлива
                  </label>
                  <Input
                    {...register("volume", {
                      required: "Обязательно для заполнения",
                      validate: (value) =>
                        parseFloat(value) > (Number(diesel_volume?.volume) || 0)
                          ? "Количество превышает остаток топлива"
                          : true,
                    })}
                    placeholder="0"
                  />
                  {errors.volume && (
                    <p className="text-red-500 text-sm">
                      {errors.volume.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="text-sm">Дата создания</label>
                  <Input
                    type="date"
                    {...register("created_at", { required: true })}
                  />
                </div>
                <div className="flex justify-end col-span-2">
                  <Button
                    className="bg-[#4880FF] text-white hover:bg-blue-600 w-[250px] rounded"
                    type="submit"
                  >
                    Добавить
                  </Button>
                </div>
              </div>
            </form>
          </FormProvider>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm">
                Оставшееся количество cаларка (литр)
              </label>
              <Input readOnly placeholder="0" className="bg-muted" value={diesel_volume?.volume as number} />
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-6">
          <SaleDiesel />
        </CardContent>
      </Card>
    </div>
  );
}
