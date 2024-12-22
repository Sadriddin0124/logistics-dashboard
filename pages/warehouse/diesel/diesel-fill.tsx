import React, { useEffect, useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import Select, { SingleValue } from "react-select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  createGasStation,
  createStation,
  fetchGasStationName,
} from "@/lib/actions/gas.action";
import { queryClient } from "@/components/ui-items/ReactQueryProvider";
import { toast } from "react-toastify";
import { removeCommas } from "@/lib/utils";
import { StationCars } from "@/lib/types/gas_station.types";
import { useRouter } from "next/router";

interface FormValues {
  station: string;
  price_usd: string;
  price_uzs: string;
  purchased_volume: number;
  payed_price_usd: string;
  payed_price_uzs: string;
}

interface Option {
  value: string;
  label: string;
}

export default function DieselFill() {
  const methods = useForm<FormValues>();
  const { register, handleSubmit, watch, setValue } = methods;
  const payed_price_uzs = watch("payed_price_uzs");
  const price_uzs = watch("price_uzs");
  const [stationOptions, setStationOptions] = useState<Option[]>([]);
  const [selectedStation, setSelectedStation] = useState<Option | null>(null);
  const [stationValue, setStation] = useState<string>("");
  const { push } = useRouter();
  const { data: stationNames } = useQuery<StationCars[]>({
    queryKey: ["stationNames"],
    queryFn: fetchGasStationName,
  });
  useEffect(() => {
    if (stationNames) {
      const stationOption = stationNames?.map((station) => {
        return {
          label: station?.name,
          value: station?.id,
        };
      });
      setStationOptions(stationOption as Option[]);
      console.log(stationOption);
    }

    const result =
      Number(removeCommas(payed_price_uzs)) / Number(removeCommas(price_uzs));
    setValue("purchased_volume", Number(result.toFixed(2)) || 0);
  }, [price_uzs, payed_price_uzs, setValue, stationNames]);

  const { mutate: createMutation } = useMutation({
    mutationFn: createGasStation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["gas_stations"] });
      push(`/warehouse/gas/gas-info?id=${selectedStation?.value}`);
      setSelectedStation(null);
      toast.success("Muvaffaqiyatli qo'shildi!");
    },
    onError: () => {
      toast.error("Xatolik yuz berdi!");
    },
  });

  const { mutate: createGasMutation } = useMutation({
    mutationFn: createStation,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["gas_stations"] });
      setSelectedStation({ label: data?.name, value: data?.id });
    },
  });

  const onSubmit = (data: FormValues) => {
    console.log(data);

    createMutation({
      ...data,
      name: selectedStation?.value as string,
      price_usd: Number(removeCommas(data?.price_usd.toString())),
      price_uzs: Number(removeCommas(data?.price_uzs.toString())),
      payed_price_usd: Number(removeCommas(data?.payed_price_usd.toString())),
      payed_price_uzs: Number(removeCommas(data?.payed_price_uzs.toString())),
    });
  };

  const handleSelectStation = (newValue: SingleValue<Option>) => {
    setSelectedStation(newValue);
  };

  const handleAddStation = () => {
    if (stationValue) {
      createGasMutation(stationValue);
    }
  };

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
                    options={stationOptions}
                    value={selectedStation}
                    onChange={handleSelectStation}
                    onBlur={handleAddStation}
                    onInputChange={(value) => setStation(value)}
                    placeholder="Isuzu 01A111AA"
                    noOptionsMessage={() => "Type to add new option..."}
                    isClearable
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm">
                    Введите количество залитого топлива
                  </label>
                  <Input
                    readOnly
                    {...register("purchased_volume")}
                    placeholder="0"
                  />
                </div>
                <div className="flex justify-end col-span-2">
                  <Button className="bg-[#4880FF] text-white hover:bg-blue-600 w-[250px] rounded">
                    Добавить
                  </Button>
                </div>
                <div className="space-y-2">
                  <label className="text-sm">
                    Оставшееся количество cаларка (литр){" "}
                  </label>
                  <Input
                    readOnly
                    {...register("purchased_volume")}
                    placeholder="0"
                  />
                </div>
              </div>
            </form>
          </FormProvider>
        </CardContent>
      </Card>
    </div>
  );
}
