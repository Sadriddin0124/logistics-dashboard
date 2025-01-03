"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FormProvider, useForm } from "react-hook-form";
import { IOil, IOilType } from "@/lib/types/oil.types";
import { useEffect, useState } from "react";
import { removeCommas } from "@/lib/utils";
import { useMutation } from "@tanstack/react-query";
import { createOil, createOilPurchase } from "@/lib/actions/oil.action";
import { queryClient } from "@/components/ui-items/ReactQueryProvider";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import CurrencyInputWithSelect from "@/components/ui-items/currencySelect";
// import { useRouter } from "next/router";

export default function GasManagementForm() {
  const methods = useForm<IOil>();
  const { register, handleSubmit, setValue, watch, reset } = methods;
  const amount_uzs = watch("amount_uzs")?.toString();
  const price_uzs = watch("price_uzs")?.toString();
  const router = useRouter();
  const [oilId, setOilId] = useState<string>("");
  const [addOilData, setAddOilData] = useState<IOilType | null>(null);
  const [status, setStatus] = useState<string>("");

  const { push } = router;
  useEffect(() => {
    const payedPrice = Number(removeCommas(amount_uzs)) || 0;
    const pricePerLiter = Number(removeCommas(price_uzs)) || 0;
    console.log(payedPrice);
    console.log(pricePerLiter);

    if (pricePerLiter > 0) {
      const result = payedPrice / pricePerLiter;
      console.log(result);
      if (result < 1) {
        setStatus("Цена на масла не должна быть выше уплаченной суммы.");
      }else {
        setStatus("")
      }
      setValue("oil_volume", Number(result.toFixed(2)));
    } else {
      setValue("oil_volume", 0);
    }
  }, [price_uzs, amount_uzs, setValue]);
  const { mutate: addMutation } = useMutation({
    mutationFn: (data: { id: string; oilData: IOilType }) =>
      createOilPurchase(data.id, data.oilData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["gas_stations"] });
      push(`/warehouse/oil/oil-info?id=${oilId}`);
      reset();
    },
    onError: () => {
      toast.error("Ошибка сохранения!");
    },
  });
  const { mutate: createMutation } = useMutation({
    mutationFn: createOil,
    onSuccess: (data) => {
      setOilId(data?.id);
      addMutation({
        id: data?.id,
        oilData: addOilData as IOilType,
      });
      reset();
      queryClient.invalidateQueries({ queryKey: ["gas_stations"] });
      toast.success(" Сохранено успешно!");
    },
    onError: () => {
      toast.error("Ошибка сохранения!");
    },
  });

  const onSubmit = (data: IOil) => {
    const formData = {
      amount_uzs: Number(removeCommas(data?.amount_uzs?.toString())),
      price_uzs: Number(removeCommas(data?.price_uzs?.toString())),
      price: Number(removeCommas(data?.price?.toString())),
    };
    createMutation({
      oil_name: data?.oil_name,
      oil_volume: 0,
    });
    setAddOilData({
      oil_volume: data?.oil_volume,
      ...formData,
    });
  };

  return (
    <div className="w-full container mx-auto mt-8 space-y-8">
      {/* Top Form Section */}
      <Card>
        <CardContent className="p-6 space-y-6">
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm">Название масло</label>
                  <Input {...register("oil_name")} placeholder="Название..." />
                </div>

                <div className="space-y-2">
                  <label className="text-sm">Оплаченная сумма</label>
                  <CurrencyInputWithSelect name="amount" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm">
                    Количество купленного масло (литр)
                  </label>
                  <Input
                    {...register("oil_volume", {
                      required: true,
                      valueAsNumber: true,
                    })}
                    disabled
                    placeholder="0"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm">Цена на масло (литр)</label>
                  <CurrencyInputWithSelect name="price" />
                  {status && <p className="text-sm text-red-500">{status}</p>}
                </div>
              </div>

              <div className="flex justify-end">
                <Button className="bg-[#4880FF] text-white hover:bg-blue-600 w-[250px] rounded">
                  Добавить
                </Button>
              </div>
            </form>
          </FormProvider>

          {/* <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm">
                Оставшееся количество масло (литр)
              </label>
              <Input value="2300" readOnly className="bg-muted" />
            </div>
          </div> */}
        </CardContent>
      </Card>
    </div>
  );
}
