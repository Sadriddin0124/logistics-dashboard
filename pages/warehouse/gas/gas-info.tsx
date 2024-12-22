"use client";

import { useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useRouter } from "next/router";
import { FormProvider, useForm } from "react-hook-form";
import { IGasStation, IGasStationTotal } from "@/lib/types/gas_station.types";
import { CurrencyInputs } from "@/components/ui-items/currency-inputs";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  addGas,
  fetchGasStationOne,
} from "@/lib/actions/gas.action";
import { queryClient } from "@/components/ui-items/ReactQueryProvider";
import { toast } from "react-toastify";
import { removeCommas } from "@/lib/utils";
import PurchasedGasTable from "@/components/warehouse/gas/purchased-table";
import SalesGasTable from "@/components/warehouse/gas/gas-sales-table";


 
export default function GasManagementForm() {
  const methods = useForm<IGasStation>();
  const { handleSubmit, reset, setValue, watch, register } = methods;
  const payed_price_uzs = watch("payed_price_uzs");
  const price_uzs = watch("price_uzs");
  const { id } = useRouter().query;
  const { data: total } = useQuery<IGasStationTotal>({
    queryKey: ["station", id],
    queryFn: () => fetchGasStationOne(id as string),
    enabled: !!id,
  });

  useEffect(() => {
    const result =
      Number(removeCommas(payed_price_uzs?.toString())) / Number(removeCommas(price_uzs?.toString()));
    setValue("remaining_gas", Number(result.toFixed(2)) || 0);
  }, [setValue, payed_price_uzs, price_uzs]);
  const { mutate: updateMutation } = useMutation({
     mutationFn: (data: { id: string; gasData: IGasStation }) =>
          addGas(data.id, data.gasData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["gas_stations"] });
      reset();
      toast.success("Muvaffaqiyatli qo'shildi!");
    },
    onError: () => {
      toast.error("Xatolik yuz berdi!");
    },
  });
  const onSubmit = (data: IGasStation) => {
    const formData: IGasStation = {
    amount: data?.remaining_gas,
    price_usd: Number(removeCommas(data?.price_usd?.toString())),
    price_uzs: Number(removeCommas(data?.price_uzs?.toString())),
    payed_price_usd: Number(removeCommas(data?.payed_price_usd?.toString())),
    payed_price_uzs: Number(removeCommas(data?.payed_price_uzs?.toString())),
  }
    updateMutation({id: id as string, gasData: formData}
  );
  };
  return (
    <div className="w-full p-4 space-y-8 container mx-auto">
      {/* Top Form Section */}
      <Card>
        <CardContent className="p-6 space-y-6">
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm">Название заправки</label>
                  <Input
                  value={total?.station_name}
                    disabled={id ? true : false}
                    placeholder="Название заправки..."
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-">Оплаченная сумма</label>
                  <CurrencyInputs name="payed_price" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm">
                    Количество купленного газа (м3)
                  </label>
                  <Input
                    {...register("remaining_gas")}
                    disabled={id ? true : false}
                    placeholder="0"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm">Цена на газ (м3)</label>
                  <CurrencyInputs name="price" />
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
              <label className="text-sm">Оставшееся количество газа (м3)</label>
              <Input
                value={total?.remaining_gas}
                readOnly
                className="bg-muted"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <SalesGasTable/>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <PurchasedGasTable/>
        </CardContent>
      </Card>
    </div>
  );
}
