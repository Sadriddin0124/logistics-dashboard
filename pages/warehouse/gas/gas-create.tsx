import React, { useEffect, useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useMutation } from "@tanstack/react-query";
import { CurrencyInputs } from "@/components/ui-items/currency-inputs";
import { addGas, createGasStation } from "@/lib/actions/gas.action";
import { queryClient } from "@/components/ui-items/ReactQueryProvider";
import { toast } from "react-toastify";
import { removeCommas } from "@/lib/utils";
import { IGasStation } from "@/lib/types/gas_station.types";

interface FormValues {
  name?: string;
  remaining_gas?: number;
  price_usd: string;
  price_uzs: string;
  payed_price_usd: string;
  payed_price_uzs: string;
  amount: string
}

export default function GasManagementForm() {
  const methods = useForm<FormValues>();
  const { register, handleSubmit, watch, setValue } = methods;
  const [addGasData, setAddGasData] = useState<IGasStation | null>(null);
  const payed_price_uzs = watch("payed_price_uzs");
  const price_uzs = watch("price_uzs");
console.log(payed_price_uzs);

  useEffect(() => {
      const result =
        Number(removeCommas(payed_price_uzs)) /
        Number(removeCommas(price_uzs));
      setValue("remaining_gas", result || 0);
  }, [price_uzs, payed_price_uzs, setValue]);

  const { mutate: addMutation } = useMutation({
    mutationFn: (data: { id: string; gasData: IGasStation }) =>
      addGas(data.id, data.gasData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["gas_stations"] });
    },
    onError: () => {
      toast.error("Xatolik yuz berdi!");
    },
  });

  const { mutate: createMutation } = useMutation({
    mutationFn: createGasStation,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["gas_stations"] });
      addMutation({
        id: data.id,
        gasData: addGasData as IGasStation,
      });
      console.log(addGasData);
      
      toast.success("Muvaffaqiyatli qo'shildi!");
    },
    onError: () => {
      toast.error("Xatolik yuz berdi!");
    },
  });

  const onSubmit = (data: FormValues) => {
    const formData: IGasStation = {
      price_usd: Number(removeCommas(data?.price_usd)),
      price_uzs: Number(removeCommas(data?.price_uzs)),
      payed_price_usd: Number(removeCommas(data?.payed_price_usd)),
      payed_price_uzs: Number(removeCommas(data?.payed_price_uzs)),
    };
    setAddGasData({
      amount: data?.remaining_gas as number,
      ...formData,
    } as IGasStation);
    createMutation({ ...formData, name: data?.name });
    console.log(formData);
    
  };

  return (
    <div className="w-full p-4 space-y-8 container mx-auto">
      <Card>
        <CardContent className="p-6 space-y-6">
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="mb-2">Название заправки</label>
                  <Input
                    {...register("name", { required: true })}
                    placeholder="Название заправки..."
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-">Оплаченная сумма</label>
                  <CurrencyInputs name="payed_price" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm">
                    Количество купленного газа (м3)
                  </label>
                  <Input
                    readOnly
                    {...register("remaining_gas")}
                    placeholder="0"
                    className="bg-muted"
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
        </CardContent>
      </Card>
    </div>
  );
}
