"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { useRouter } from "next/router";
import { FormProvider, useForm } from "react-hook-form";
import { CurrencyInputs } from "@/components/ui-items/currency-inputs";
import { Option } from "../diesel";
import { useMutation, useQuery } from "@tanstack/react-query";
import { fetchCarNoPage } from "@/lib/actions/cars.action";
import Select, { SingleValue } from "react-select";
import { ICars } from "@/lib/types/cars.types";
import { queryClient } from "@/components/ui-items/ReactQueryProvider";
import { toast } from "react-toastify";
import { createAnotherStation, fetchAnotherStation } from "@/lib/actions/gas.action";
import { AnotherStation, AnotherStationListResponse } from "@/lib/types/gas_station.types";
import { removeCommas } from "@/lib/utils";


export default function GasManagementForm() {
  const methods = useForm<AnotherStation>();
  const { register, handleSubmit, setValue } = methods;
  const { data: carsList } = useQuery<ICars[]>({
    queryKey: ["cars_no_page"],
    queryFn: fetchCarNoPage,
  });
  const { data: stationList } = useQuery<AnotherStationListResponse>({
    queryKey: ["another_stations"],
    queryFn: fetchAnotherStation,
  });
  const [carOptions, setCarOptions] = useState<Option[]>([]);
  const [selectedCar, setSelectedCar] = useState<Option | null>(null);

  useEffect(() => {
    const carOptions = carsList?.map((car) => {
      return {
        label: `${car?.model} ${car?.name}`,
        value: car?.id as string,
      };
    }) as Option[];
    setCarOptions(carOptions)
  }, [carsList]);
  const { id } = useRouter().query;
  const { mutate: createMutation } = useMutation({
    mutationFn: createAnotherStation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["another_stations"] });
      toast.success(" muvaffaqiyatli qo'shildi!");
    },
    onError: () => {
      toast.error("ni qo'shishda xatolik!");
    },
  });
  const onSubmit = (data: AnotherStation) => {
    createMutation({
      ...data,
      payed_price_usd: Number(removeCommas(data?.payed_price_usd.toString())),
      payed_price_uzs: Number(removeCommas(data?.payed_price_uzs.toString())),
    });
    console.log(data);
  };
  const handleSelectCar = (newVale: SingleValue<Option>) => {
    setSelectedCar(newVale);
    setValue("car", newVale?.value as string);
  };
  return (
    <div className="w-full container mx-auto mt-8 space-y-8">
      {/* Top Form Section */}
      <Card>
        <CardContent className="p-6 space-y-6">
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 ">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm">Цена на газ (м3)</label>
                  <Select
                    options={carOptions}
                    value={selectedCar}
                    onChange={handleSelectCar}
                    placeholder={"Isuzu 01A111AA"}
                    noOptionsMessage={() => "Type to add new option..."}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm">Цена на газ (м3)</label>
                  <CurrencyInputs name="payed_price" />
                </div>
                <div className="space-y-2 col">
                  <label className="text-sm">
                    Количество купленного газа (м3)
                  </label>
                  <Input
                    disabled={id ? true : false}
                    {...register("purchased_volume", {
                      valueAsNumber: true,
                      required: true,
                    })}
                    placeholder="0"
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <Button className="bg-[#4880FF] text-white hover:bg-blue-600 w-[250px] rounded">
                  Добавить
                </Button>
              </div>
            </form>
          </FormProvider>
        </CardContent>
      </Card>

      {/* Middle Table Section */}
      <Card>
        <CardContent className="p-6">
          <Table>
            <TableHeader className="font-bold">
              <TableRow className="border-b border-b-gray-300">
                <TableHead className="font-bold">Машина</TableHead>
                <TableHead className="font-bold">Количество</TableHead>
                <TableHead className="font-bold">Цена</TableHead>
                <TableHead className="font-bold"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {stationList?.results?.map((entry, index) => (
                <TableRow key={index} className="border-b border-b-gray-300">
                  <TableCell>{entry?.car?.name}</TableCell>
                  <TableCell>{entry?.purchased_volume}</TableCell>
                  <TableCell>{entry?.payed_price_uzs}</TableCell>
                  <TableCell>
                    <Button
                      variant="secondary"
                      className="bg-red-100 hover:bg-red-200 text-red-600"
                    >
                      Наличи
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
