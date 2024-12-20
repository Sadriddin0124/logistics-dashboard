"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FormProvider, useForm } from "react-hook-form";
import { useEffect } from "react";
import { CurrencyInputs } from "@/components/ui-items/currency-inputs";

interface FormValues {
  gas_price: string;
  gas_price_usd: string;
  gas_price_uzs: string;
  purchased_volume_usd?: number;
  purchased_volume_uzs?: number;
  purchased_volume?: number;
  paid_amount: string;
  paid_amount_usd: string;
  paid_amount_uzs: string;
}

export default function GasManagementForm() {
  const methods = useForm<FormValues>({
    defaultValues: {
      gas_price: "",
      paid_amount: "",
      purchased_volume: 0,
    },
  });
  const { register, handleSubmit, watch, setValue } = methods;
  const paid_amount_uzs = watch("paid_amount_uzs");
  const gas_price_uzs = watch("gas_price_uzs");

  useEffect(() => {
    const result = Number(paid_amount_uzs) / Number(gas_price_uzs);
    setValue("purchased_volume_uzs", result || 0);
  }, [
    gas_price_uzs,
    paid_amount_uzs,
    setValue,
  ]);
  //   const { id } = useRouter().query;
  const onSubmit = (data: FormValues) => {
    console.log(data);
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
                  <Input placeholder="Название заправки..." />
                </div>
                <div className="space-y-2">
                  <label className="text-">Оплаченная сумма</label>
                  <CurrencyInputs name="paid_amount" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm">
                    Количество купленного газа (м3)
                  </label>
                  <Input
                    {...register("purchased_volume_uzs")}
                    placeholder="0"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm">Цена на газ (м3)</label>
                  <CurrencyInputs name="gas_price" />
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
              <label className="text-sm">Оставшееся количество газа (м3)</label>
              <Input value="2300" readOnly className="bg-muted" />
            </div>
            <div className="space-y-2">
              <label className="text-sm">Оставшаяся сумма платежа</label>
              <Input value="5,650,000" readOnly className="bg-muted" />
            </div>
          </div> */}
        </CardContent>
      </Card>
    </div>
  );
}
