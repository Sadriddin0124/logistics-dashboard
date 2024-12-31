import React, { useEffect, useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useMutation } from "@tanstack/react-query";
import { addGas, createGasStation } from "@/lib/actions/gas.action";
import { queryClient } from "@/components/ui-items/ReactQueryProvider";
import { toast } from "react-toastify";
import { removeCommas } from "@/lib/utils";
import { IGasCreate, IGasStation } from "@/lib/types/gas_station.types";
import { useRouter } from "next/router";
import CurrencyInputWithSelect from "@/components/ui-items/currencySelect";

interface FormValues {
  name?: string;
  remaining_gas?: number;
  price_usd: number;
  price_uzs: number;
  payed_price_usd: number;
  payed_price_uzs: number;
  amount: string
}

export default function GasManagementForm() {
  const methods = useForm<FormValues>();
  const { register, handleSubmit, watch, setValue, reset } = methods;
  const [addGasData, setAddGasData] = useState<IGasStation | null>(null);
  const [status, setStatus] = useState<string>("")
  const payed_price_uzs = watch("payed_price_uzs");
  const price_uzs = watch("price_uzs");
  const [gasId, setGasId] = useState<string>("")
  const { push } = useRouter()
  useEffect(() => {
    console.log(payed_price_uzs);
    console.log(price_uzs);
    
      const result =
        Number(removeCommas(payed_price_uzs?.toString())) /
        Number(removeCommas(price_uzs?.toString()));
        if (price_uzs && payed_price_uzs) {
          setValue("remaining_gas", Number(result.toFixed(2)) || 0);
        }
        if (result < 1) {
          setStatus("Цена газа не должна быть выше уплаченной суммы.")
        }
  }, [price_uzs, payed_price_uzs, setValue]);

  const { mutate: addMutation } = useMutation({
    mutationFn: (data: { id: string; gasData: IGasCreate }) =>
      addGas(data.id, data?.gasData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["gas_stations"] });
      push(`/warehouse/gas/gas-info?id=${gasId}`)
    },
    onError: () => {
      toast.error("Ошибка сохранения!");
    },
  });

  const { mutate: createMutation } = useMutation({
    mutationFn: createGasStation,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["gas_stations"] });
      setGasId(data?.id)
      addMutation({
        id: data.id,
        gasData: addGasData as IGasCreate,
      });
      reset()      
      toast.success("Сохранено успешно!");
    },
    onError: () => {
      toast.error("Ошибка сохранения!");
    },
  });

  const onSubmit = (data: FormValues) => {
    const formData: IGasCreate = {
      price_uzs: Number(removeCommas(data?.price_uzs.toString())),
      payed_price_uzs: Number(removeCommas(data?.payed_price_uzs.toString())),
    };
    setAddGasData({
      amount: data?.remaining_gas as number,
      ...formData,
    } as IGasStation);
    createMutation({ ...formData, name: data?.name });    
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
                  <CurrencyInputWithSelect name="payed_price" />
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
        </CardContent>
      </Card>
    </div>
  );
}
