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
import { IOilType } from "@/lib/types/oil.types";
import { removeCommas } from "@/lib/utils";
import { useMutation, useQuery } from "@tanstack/react-query";
import { fetchOil, updateOil } from "@/lib/actions/oil.action";
import { queryClient } from "@/components/ui-items/ReactQueryProvider";
import { toast } from "react-toastify";
import { Label } from "@/components/ui/label";

interface GasEntry {
  machine: string;
  quantity: string;
  start: string;
  end: string;
}

export default function GasManagementForm() {
  const [entries] = useState<GasEntry[]>([
    {
      machine: "Isuzu 01A113AA",
      quantity: "10 (литр)",
      start: "12.12.2024",
      end: "12.05.2025",
    },
    {
      machine: "Isuzu 01A113AA",
      quantity: "10 (литр)",
      start: "12.12.2024",
      end: "12.05.2025",
    },
    {
      machine: "Isuzu 01A113AA",
      quantity: "10 (литр)",
      start: "12.12.2024",
      end: "12.05.2025",
    },
    {
      machine: "Isuzu 01A113AA",
      quantity: "10 (литр)",
      start: "12.12.2024",
      end: "12.05.2025",
    },
    {
      machine: "Isuzu 01A113AA",
      quantity: "10 (литр)",
      start: "12.12.2024",
      end: "12.05.2025",
    },
    {
      machine: "Isuzu 01A113AA",
      quantity: "10 (литр)",
      start: "12.12.2024",
      end: "12.05.2025",
    },
  ]);
  const methods = useForm<IOilType>();
  const { register, handleSubmit, setValue, watch, reset } = methods;
  const payed_price_uzs = watch("payed_price_uzs")?.toString();
  const price_uzs = watch("price_uzs")?.toString();
  const { id } = useRouter()?.query

  const { data: oilData } = useQuery<IOilType>({
    queryKey: ["oil"],
    queryFn: ()=> fetchOil(id as string),
    enabled: !!id
  });
  useEffect(() => {
    if (oilData) {
      reset(oilData);
    }
    const payedPrice = Number(removeCommas(payed_price_uzs)) || 0;
    const pricePerLiter = Number(removeCommas(price_uzs)) || 0;

    if (pricePerLiter > 0) {
      const result = payedPrice / pricePerLiter;
      setValue("oil_volume", result.toFixed(2));
    } else {
      setValue("oil_volume", "0");
    }
  }, [price_uzs, payed_price_uzs, setValue, reset, oilData]);
  const { mutate: createMutation } = useMutation({
    mutationFn: updateOil,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["gas_stations"] });
      toast.success(" muvaffaqiyatli qo'shildi!");
    },
    onError: () => {
      toast.error("ni qo'shishda xatolik!");
    },
  });
  const onSubmit = (data: IOilType) => {
    createMutation({
      ...data,
      id: id as string,
      payed_price_usd: Number(data?.payed_price_usd),
      payed_price_uzs: Number(data?.payed_price_uzs),
      price_uzs: Number(data?.price_uzs),
      price_usd: Number(data?.price_usd),
    });
  };
  return (
    <div className="w-full container mx-auto mt-8 space-y-8">
      {/* Top Form Section */}
      <Card>
        <CardContent className="mt-8">
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm">Название масло</label>
                  <Input {...register("oil_name")} placeholder="Название..." />
                </div>

                <div className="space-y-2">
                  <label className="text-sm">Оплаченная сумма</label>
                  <CurrencyInputs name="payed_price" />
                </div>

                <div className="space-y-2">
                  <label className="text-sm">
                    Количество купленного масло (литр)
                  </label>
                  <Input
                    {...register("oil_volume", { required: true })}
                    disabled
                    placeholder="0"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm">Цена на масло (литр)</label>
                  <CurrencyInputs name="price" />
                </div>

              <div className="flex justify-end col-span-2">
                <Button className="bg-[#4880FF] text-white hover:bg-blue-600 w-[250px] rounded">
                  Добавить
                </Button>
              </div>
          <div >
            <Label>Оставшееся количество масло  (литр)</Label>
            <Input readOnly value={0} className="bg-muted" />
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
                <TableHead className="font-bold">
                  Последний дата заменa
                </TableHead>
                <TableHead className="font-bold">
                  Следующая дата замены
                </TableHead>
                <TableHead className="font-bold"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {entries.map((entry, index) => (
                <TableRow key={index} className="border-b border-b-gray-300">
                  <TableCell>{entry.machine}</TableCell>
                  <TableCell>{entry.quantity}</TableCell>
                  <TableCell>{entry.start}</TableCell>
                  <TableCell>{entry.end}</TableCell>
                  <TableCell className="text-center">
                    <Button
                      variant="secondary"
                      className="bg-red-100 hover:bg-red-200 text-red-600"
                    >
                      Заменён
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
              <TableRow className="border-b border-b-gray-300">
                <TableCell className="font-medium">10,000,000 сум</TableCell>
                <TableCell>300(м3)</TableCell>
                <TableCell>2500 сум</TableCell>
                <TableCell className="text-center">
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
