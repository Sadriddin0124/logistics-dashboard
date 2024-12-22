"use client";

import { useState } from "react";
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
import Select, { SingleValue } from "react-select";
import { CurrencyInputs } from "@/components/ui-items/currency-inputs";
import { IDieselType } from "@/lib/types/diesel.types";
import { useMutation } from "@tanstack/react-query";
import { createDiesel } from "@/lib/actions/diesel.action";
import { queryClient } from "@/components/ui-items/ReactQueryProvider";
import { toast } from "react-toastify";

interface GasEntry {
  machine: string;
  quantity: string;
  price: string;
}


export interface Option {
  label: string;
  value: string;
}

const carList: Option[] = [
  { value: "", label: "+ Добавить" },
  { value: "2", label: "Honda Civic" },
  { value: "3", label: "Tesla Model 3" },
  { value: "4", label: "Ford Mustang" },
  { value: "5", label: "Toyota Camry" },
];

export default function GasManagementForm() {
  const methods = useForm<IDieselType>();
  const { register, handleSubmit, setValue, reset } = methods;
  const [carOptions] = useState<Option[]>(carList);
  const [selectedCar, setSelectedCar] = useState<Option | null>(null);
  const [entries] = useState<GasEntry[]>([
    { machine: "Isuzu 01A113AA", quantity: "10 (литр)", price: "2500 сум" },
    { machine: "Isuzu 01A113AA", quantity: "10 (литр)", price: "2500 сум" },
    { machine: "Isuzu 01A113AA", quantity: "10 (литр)", price: "2500 сум" },
    { machine: "Isuzu 01A113AA", quantity: "10 (литр)", price: "2500 сум" },
    { machine: "Isuzu 01A113AA", quantity: "10 (литр)", price: "2500 сум" },
    { machine: "Isuzu 01A113AA", quantity: "10 (литр)", price: "2500 сум" },
  ]);
  const { id } = useRouter().query;
  const { mutate: createMutation } = useMutation({
    mutationFn: createDiesel,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["diesel"] });
      reset()
      toast.success(" muvaffaqiyatli qo'shildi!");
    },
    onError: () => {
      toast.error("ni qo'shishda xatolik!");
    }
  });
  const onSubmit = (data: IDieselType) => {
    createMutation(data);
  };
  const handleSelectCar = (newValue: SingleValue<Option>) => {
    setSelectedCar(newValue);
    setValue("car", newValue?.value as string)
  };
  return (
    <div className="w-full container mx-auto mt-8 space-y-8">
      {/* Top Form Section */}
      <Card>
        <CardContent className="p-6 space-y-6">
          <FormProvider {...methods}>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-6 col-span-1"
            >
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="mb-2">Выберите </label>
                  <Select
                    options={carOptions}
                    value={selectedCar}
                    onChange={handleSelectCar}
                    placeholder={"Isuzu 01A111AA"}
                    noOptionsMessage={() => "Type to add new option..."}
                  />
                </div>
                {selectedCar?.value === "" && (
                  <div className="space-y-2">
                    <label className="text-sm">Добавить марку автомобиля</label>
                    <Input {...register("car")} disabled={id ? true : false} placeholder="" />
                  </div>
                )}
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm">Цена на cаларка (литр)</label>
                  <CurrencyInputs name="price"/>
                </div>
                <div className="space-y-2">
                  <label className="text-sm">
                    Количество купленного cаларка (литр)
                  </label>
                  <Input {...register("oil_volume", {required: true, valueAsNumber: true})} placeholder="0" type="number"/>
                </div>
              </div>

              <div className="flex justify-end">
                <Button className="bg-[#4880FF] text-white hover:bg-blue-600 w-[250px] rounded">
                  Добавить
                </Button>
              </div>
            </form>
          </FormProvider>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm">
                Оставшееся количество cаларка (литр)
              </label>
              <Input value="2300" readOnly className="bg-muted" />
            </div>
          </div>
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
              {entries.map((entry, index) => (
                <TableRow key={index} className="border-b border-b-gray-300">
                  <TableCell>{entry.machine}</TableCell>
                  <TableCell>{entry.quantity}</TableCell>
                  <TableCell>{entry.price}</TableCell>
                  <TableCell>
                    <Button
                      variant="secondary"
                      className="bg-red-100 hover:bg-red-200 text-red-600"
                    >
                      Налили
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Bottom Summary Section */}
      <Card>
        <CardContent className="p-6">
          <Table>
            <TableHeader className="font-bold">
              <TableRow className="border-b border-b-gray-300">
                <TableHead className="font-bold">Оплаченная сумма</TableHead>
                <TableHead className="font-bold">Количество</TableHead>
                <TableHead className="font-bold">Цена</TableHead>
                <TableHead className="font-bold"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">10,000,000 сум</TableCell>
                <TableCell>10 (литр)</TableCell>
                <TableCell>2500 сум</TableCell>
                <TableCell>
                  <Button
                    variant="secondary"
                    className="bg-green-100 hover:bg-green-200 text-green-600"
                  >
                    Куплено
                  </Button>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
