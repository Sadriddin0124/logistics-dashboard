"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useRouter } from "next/router";
import { FormProvider, useForm } from "react-hook-form";
import { IOil, IOilType } from "@/lib/types/oil.types";
import { removeCommas } from "@/lib/utils";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  createOilPurchase,
  deleteOil,
  fetchOil,
} from "@/lib/actions/oil.action";
import { queryClient } from "@/components/ui-items/ReactQueryProvider";
import { toast } from "react-toastify";
import { Label } from "@/components/ui/label";
import PurchasedOilTable from "@/components/warehouse/oil/oil-purchased-table";
import RecycledOilTable from "@/components/warehouse/oil/oil-recycled-table";
import { ForceDeleteDialog } from "@/components/ui-items/force-delete";
import CurrencyInputWithSelect from "@/components/ui-items/currencySelect";

export default function GasManagementForm() {
  const methods = useForm<IOil>();
  const { register, handleSubmit, setValue, watch, reset } = methods;
  const amount_uzs = watch("amount_uzs");
  const price_uzs = watch("price_uzs");
  const router = useRouter();
  const { id } = router.query;
  const [status, setStatus] = useState<string>("");

  const { data: oilData } = useQuery<IOilType>({
    queryKey: ["oil"],
    queryFn: () => fetchOil(id as string),
    enabled: !!id,
  });

  useEffect(() => {
    if (oilData) {
      setValue("oil_name", oilData?.oil_name);
    }
    const payedPrice = Number(removeCommas(amount_uzs?.toString())) || 0;
    const pricePerLiter = Number(removeCommas(price_uzs?.toString())) || 0;
    if (pricePerLiter > 0) {
      const result = payedPrice / pricePerLiter;
      setValue("oil_volume", Number(result.toFixed(2)));
      if (result < 1) {
        setStatus("Цена на масла не должна быть выше уплаченной суммы.");
      } else {
        setStatus("");
      }
    } else {
      setValue("oil_volume", 0);
    }
  }, [price_uzs, amount_uzs, setValue, oilData]);

  const { mutate: createMutation } = useMutation({
    mutationFn: (data: { id: string; oilData: IOilType }) =>
      createOilPurchase(data.id, data.oilData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["oil"] });
      queryClient.invalidateQueries({ queryKey: ["oil_purchases"] });
      toast.success(" Сохранено успешно!");
    },
    onError: () => {
      toast.error("Ошибка сохранения!");
    },
  });

  const onSubmit = (data: IOil) => {
    const created_at = data?.created_at ? { created_at: data.created_at } : {};
    const formData = {
      oil_volume: data?.oil_volume,
      price: Number(removeCommas(data?.price as string)),
      amount: Number(removeCommas(data?.amount as string)),
      amount_uzs: data?.amount_uzs,
      amount_type: data?.amount_type,
      price_uzs: data?.price_uzs as number,
      price_type: data?.price_type,
      ...created_at,
    };
    createMutation({
      id: id as string,
      oilData: formData as IOilType,
    });
    reset();
  };
  const { mutate: deleteMutation } = useMutation({
    mutationFn: deleteOil,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["oil"] });
      router.push("/warehouse/oil");
      toast.success("Сохранено успешно!");
    },
    onError: () => {
      toast.error("Ошибка сохранения!");
    },
  });
  const handleDelete = (id: string) => {
    deleteMutation(id);
  };
  return (
    <div className="w-full container mx-auto mt-8 space-y-8">
      <Card>
        <CardContent className="mt-8">
          <FormProvider {...methods}>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="grid grid-cols-2 gap-5"
            >
              <div className="space-y-2">
                <label className="text-sm">Название масло</label>
                <Input {...register("oil_name")} disabled placeholder="Название..." />
              </div>

              <div className="space-y-2">
                <label className="text-sm">Оплаченная сумма</label>
                <CurrencyInputWithSelect name="amount" />
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
                <CurrencyInputWithSelect name="price" />
                {status && <p className="text-sm text-red-500">{status}</p>}
              </div>
              <div className="space-y-2">
                <label className="text-sm">Дата создания</label>
                <Input
                  type="date"
                  {...register("created_at")}
                />
              </div>

              <div className="flex justify-end mt-4 gap-2 col-span-2">
                <ForceDeleteDialog
                  id={id as string}
                  onDelete={handleDelete}
                  total={oilData?.oil_volume as number}
                  type="Установите сумму 0"
                />

                <Button className="bg-[#4880FF] text-white hover:bg-blue-600 w-[250px] rounded">
                  Добавить
                </Button>
              </div>
              <div>
                <Label>Оставшееся количество масло (литр)</Label>
                <Input
                  readOnly
                  value={oilData?.oil_volume?.toFixed(2)}
                  className="bg-muted"
                />
              </div>
            </form>
          </FormProvider>
        </CardContent>
      </Card>

      {/* Middle Table Section */}
      <Card>
        <CardContent className="p-6">
          <h2 className="text-2xl font-medium">Покупные масла</h2>
          <PurchasedOilTable />
        </CardContent>
      </Card>

      {/* Bottom Summary Section */}
      <Card>
        <CardContent className="p-6">
          <h2 className="text-2xl font-medium">Поменял масла</h2>
          <RecycledOilTable />
        </CardContent>
      </Card>
    </div>
  );
}
