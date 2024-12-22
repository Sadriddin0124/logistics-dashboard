"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FormProvider, useForm } from "react-hook-form";
import { IOilType } from "@/lib/types/oil.types";
import { CurrencyInputs } from "@/components/ui-items/currency-inputs";
import { useEffect } from "react";
import { removeCommas } from "@/lib/utils";
import { useMutation } from "@tanstack/react-query";
import { createOil } from "@/lib/actions/oil.action";
import { queryClient } from "@/components/ui-items/ReactQueryProvider";
import { toast } from "react-toastify";
// import { useRouter } from "next/router";

export default function GasManagementForm() {
  const methods = useForm<IOilType>();
  const { register, handleSubmit, setValue, watch, reset } = methods;
  const payed_price_uzs = watch("payed_price_uzs")?.toString();
  const price_uzs = watch("price_uzs")?.toString();
  // const router = useRouter()
  // const { id } = router?.query
  // const { push } = router
  useEffect(() => {
    const payedPrice = Number(removeCommas(payed_price_uzs)) || 0;
    const pricePerLiter = Number(removeCommas(price_uzs)) || 0;

    if (pricePerLiter > 0) {
      const result = payedPrice / pricePerLiter;
      setValue("oil_volume", result.toFixed(2));
    } else {
      setValue("oil_volume", "0");
    }
  }, [price_uzs, payed_price_uzs, setValue]);
  const { mutate: createMutation } = useMutation({
    mutationFn: createOil,
    onSuccess: () => {
      reset()
      queryClient.invalidateQueries({ queryKey: ["gas_stations"] });
      // push(`/warehouse/oil/oil-info?id=${data?.id}`)
      toast.success(" muvaffaqiyatli qo'shildi!");
    },
    onError: () => {
      toast.error("ni qo'shishda xatolik!");
    },
  });
  const onSubmit = (data: IOilType) => {
    createMutation({...data, 
        payed_price_usd: Number(data?.payed_price_usd),
        payed_price_uzs: Number(data?.payed_price_uzs),
        price_uzs: Number(data?.price_uzs),
        price_usd: Number(data?.price_usd)
    })
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
                  <CurrencyInputs name="payed_price" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
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
