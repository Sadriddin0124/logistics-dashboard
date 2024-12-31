"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useRouter } from "next/router";
import { FormProvider, useForm } from "react-hook-form";
import { IGasCreate, IGasStation, IGasStationTotal } from "@/lib/types/gas_station.types";
import { useMutation, useQuery } from "@tanstack/react-query";
import { addGas, deleteStation, fetchGasStationOne } from "@/lib/actions/gas.action";
import { queryClient } from "@/components/ui-items/ReactQueryProvider";
import { toast } from "react-toastify";
import { removeCommas } from "@/lib/utils";
import PurchasedGasTable from "@/components/warehouse/gas/purchased-table";
import SalesGasTable from "@/components/warehouse/gas/gas-sales-table";
import { ForceDeleteDialog } from "@/components/ui-items/force-delete";
import CurrencyInputWithSelect from "@/components/ui-items/currencySelect";

export default function GasManagementForm() {
  const methods = useForm<IGasStation>();
  const { handleSubmit, reset, setValue, watch, register } = methods;
  const [status, setStatus] = useState<string>("")
  const payed_price_uzs = watch("payed_price_uzs");
  const price_uzs = watch("price_uzs");
  const router = useRouter()
  const { id } = router.query;
  const { data: total } = useQuery<IGasStationTotal>({
    queryKey: ["station", id],
    queryFn: () => fetchGasStationOne(id as string),
    enabled: !!id,
  }); 

  useEffect(() => {
    const result =
      Number(removeCommas(payed_price_uzs?.toString())) /
      Number(removeCommas(price_uzs?.toString()));
      if (price_uzs && payed_price_uzs) {
    setValue("remaining_gas", Number(result.toFixed(2)) || 0);
      }
      if (result < 1) {
        setStatus("gaz narxi to'langan summadan baland bo'lmasligi kerak")
      }
      
  }, [setValue, payed_price_uzs, price_uzs]);
  const { mutate: updateMutation, isPending } = useMutation({
    mutationFn: (data: { id: string; gasData: IGasCreate }) =>
      addGas(data.id, data.gasData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["station"] });
      queryClient.invalidateQueries({ queryKey: ["purchased"] });
      reset();
      toast.success("Сохранено успешно!");
    },
    onError: () => {
      toast.error("Ошибка сохранения!");
    },
  });
  const onSubmit = (data: IGasStation) => {
    const formData: IGasCreate = {
      amount: data?.remaining_gas,
      price_uzs: Number(removeCommas(data?.price_uzs?.toString())),
      payed_price_uzs: Number(removeCommas(data?.payed_price_uzs?.toString())),
    };
    updateMutation({ id: id as string, gasData: formData });
  };
  const { mutate: deleteMutation } = useMutation({
    mutationFn: deleteStation,
   onSuccess: () => {
     queryClient.invalidateQueries({ queryKey: ["gas_stations"] });
     router.push("/warehouse/gas")
     toast.success("Сохранено успешно!");
   },
   onError: () => {
     toast.error("Ошибка сохранения!");
   },
 });
 const handleDelete = (id: string) => {
  deleteMutation(id)
 }
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
                    value={total?.name}
                    disabled={id ? true : false}
                    placeholder="Название заправки..."
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-">Оплаченная сумма</label>
                  <CurrencyInputWithSelect name="payed_price" />
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
                  <CurrencyInputWithSelect name="price" />
                  {status && <p className="text-sm text-red-500">{status}</p>}
                </div>
              </div>

              <div className="flex justify-end gap-4">
                <ForceDeleteDialog id={id as string} onDelete={handleDelete} total={total?.remaining_gas as number} type="Установите сумму 0"/>
                <Button
                  disabled={isPending}
                  className="bg-[#4880FF] text-white hover:bg-blue-600 w-[250px] rounded"
                >
                  {isPending ? "Загруска..." : "Добавить"}
                </Button>
              </div>
            </form>
          </FormProvider>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm">Оставшееся количество газа (м3)</label>
              <Input
                value={total?.remaining_gas?.toFixed(2)}
                readOnly
                className="bg-muted"
              />
            </div>
          </div>
        </CardContent>
      </Card>


      <Card>
        <CardContent className="p-6">
          <PurchasedGasTable />
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-6">
          <SalesGasTable />
        </CardContent>
      </Card>
    </div>
  );
}
