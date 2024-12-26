import React, { useEffect, useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import Select, { SingleValue } from "react-select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  createStationSales,
  fetchAllGasStation,
} from "@/lib/actions/gas.action";
import { queryClient } from "@/components/ui-items/ReactQueryProvider";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import { ICars } from "@/lib/types/cars.types";
import { fetchCarNoPage, updateCarDistance } from "@/lib/actions/cars.action";
import { IGasStation } from "@/lib/types/gas_station.types";

interface FormValues {
  station: string;
  amount: number;
  next_gas_distance: number;
  car: string;
}

interface Option {
  value: string;
  label: string;
}

export default function GasSold() {
  const methods = useForm<FormValues>();
  const {
    register,
    handleSubmit,
    // formState: { errors },
  } = methods;
  const [carOptions, setCarOptions] = useState<Option[]>([]);
  const [selectedStation, setSelectedStation] = useState<Option | null>(null);
  const [selectedCar, setSelectedCar] = useState<Option | null>(null);
  const [stationOptions, setStationOptions] = useState<Option[]>([]);
  const [remaining, setRemaining] = useState(0);
  const [distance, setDistance] = useState(0);
  const { push } = useRouter();
  const { data: cars } = useQuery<ICars[]>({
    queryKey: ["cars"],
    queryFn: fetchCarNoPage,
  });
  const { data: stations } = useQuery<IGasStation[]>({
    queryKey: ["all_stations"],
    queryFn: fetchAllGasStation,
  });
  useEffect(() => {
    if (cars && stations) {
      const carOption = cars
        ?.filter((car) => car?.fuel_type === "GAS")
        ?.map((car) => {
          return {
            label: `${car?.name} ${car?.number}`,
            value: car?.id,
          };
        });
      const distance = cars?.find(
        (item) => item?.id === selectedCar?.value
      )?.distance_travelled;
      setDistance(distance as number);
      const stationOption = stations?.map((station) => {
        return {
          label: station?.name,
          value: station?.id,
        };
      });
      const remaining_gas = stations?.find(
        (item) => item?.id === selectedStation?.value
      )?.remaining_gas;
      setRemaining(remaining_gas as number);
      setCarOptions(carOption as Option[]);
      setStationOptions(stationOption as Option[]);
    }
  }, [cars, stations, selectedStation, selectedCar]);

  const { mutate: createMutation } = useMutation({
    mutationFn: createStationSales,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["gas_stations"] });
      push(`/warehouse/gas/`);
      setSelectedStation(null);
      toast.success("Muvaffaqiyatli qo'shildi!");
    },
    onError: () => {
      toast.error("Xatolik yuz berdi!");
    },
  });
  const { mutate: updateMutation } = useMutation({
    mutationFn: updateCarDistance,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["gas_stations"] });
      setSelectedStation(null);
    },
    onError: () => {
      toast.error("Xatolik yuz berdi!");
    },
  });

  const onSubmit = (data: FormValues) => {

    createMutation({
      ...data,
      car: selectedCar?.value as string,
      station: selectedStation?.value as string,
    });
    updateMutation({id: selectedCar?.value as string, distance_travelled: data?.next_gas_distance})
  };

  const handleSelectStation = (newValue: SingleValue<Option>) => {
    setSelectedStation(newValue);
  };
  const handleSelectCar = (newValue: SingleValue<Option>) => {
    setSelectedCar(newValue);
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
                    options={carOptions}
                    value={selectedCar}
                    onChange={handleSelectCar}
                    placeholder="Выберите автомобиль"
                    noOptionsMessage={() => "Type to add new option..."}
                    isClearable
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm">
                    Количество купленного газа (м3)
                  </label>
                  <Input
                  type="number"
                    {...register("amount", {
                      valueAsNumber: true,
                      required: "This field is required",
                      validate: (value) =>
                        value <= remaining ||
                        `Value must not exceed ${remaining}`,
                    })}
                    placeholder="0"
                  />
                  {methods.formState.errors.amount && (
                    <p className="text-red-500 text-sm">
                      {methods.formState.errors.amount.message as string}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="mb-2">Выберите заправку</label>
                  <Select
                    options={stationOptions}
                    value={selectedStation}
                    onChange={handleSelectStation}
                    placeholder="Выберите заправку..."
                    noOptionsMessage={() => "Type to add new option..."}
                    isClearable
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm">
                     car distance
                  </label>
                  <Input
                    {...register("next_gas_distance", {
                      valueAsNumber: true,
                      required: "This field is required",
                      validate: (value) =>
                        value >= distance ||
                        `Value must bigger than ${distance}`,
                    })}
                    placeholder="0"
                  />
                  {methods.formState.errors.next_gas_distance && (
                    <p className="text-red-500 text-sm">
                      {methods.formState.errors.next_gas_distance.message as string}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex justify-end">
                <Button className="bg-[#4880FF] text-white hover:bg-blue-600 w-[250px] rounded">
                  Добавить
                </Button>
              </div>
            </form>
            <div className="grid grid-cols-2 gap-4 ">
            <div className="space-y-2">
              <label className="text-sm">Газ в базе (м3)</label>
              <Input value={remaining || 0} placeholder="0" readOnly className="bg-muted"/>
            </div>
            </div>
          </FormProvider>
        </CardContent>
      </Card>
    </div>
  );
}
