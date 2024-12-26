"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useRouter } from "next/router";
import { FormProvider, useForm } from "react-hook-form";
import { useMutation, useQuery } from "@tanstack/react-query";
import { queryClient } from "@/components/ui-items/ReactQueryProvider";
import { toast } from "react-toastify";
import { fetchOilRemaining, recycleOil } from "@/lib/actions/oil.action";
import { CurrencyInputs } from "@/components/ui-items/currency-inputs";
import { removeCommas } from "@/lib/utils";
import { OilRemainingResponse } from "@/lib/types/oil.types";
import UtilizedOilTable from "@/components/warehouse/oil/utilized-table";

interface FormValues {
  quantity_utilized: number;
  // price_usd?: string
  price_uzs: string;
}

export default function GasManagementForm() {
  const methods = useForm<FormValues>();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = methods;
  const { id } = useRouter().query;

  const { data: quantity } = useQuery<OilRemainingResponse>({
    queryKey: ["quantity"],
    queryFn: fetchOilRemaining,
  });

  const { mutate: createMutation } = useMutation({
    mutationFn: recycleOil,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["quantity"] });
      // push(`/warehouse/oil/oil-info?id=${data?.id}`)
      reset()
      toast.success(" muvaffaqiyatli qo'shildi!");
    },
    onError: () => {
      toast.error("ni qo'shishda xatolik!");
    },
  });
  const onSubmit = (data: FormValues) => {
    console.log(data);

    // price_usd: Number(removeCommas(data?.price_usd)),
    createMutation({
      ...data,
      price_uzs: Number(removeCommas(data?.price_uzs)),
    });
  };
  const oil_volume = quantity?.results?.[0]?.remaining_oil_quantity;

  return (
    <div className="w-full container mx-auto mt-8 space-y-8">
      {/* Top Form Section */}
      <Card>
        <CardContent className="p-6 space-y-6">
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm">
                    Цена на утилизированное масло (литр)
                  </label>
                  <CurrencyInputs name="price" />
                  </div>
                <div className="space-y-2">
                  <label className="text-sm">
                    Количество утилизированного масла (литр)
                  </label>
                  <Input
                    {...register("quantity_utilized", {
                      required: "Обязательно для заполнения",
                      valueAsNumber: true,
                      validate: (value) =>
                        value > (Number(oil_volume) || 0)
                          ? "Количество превышает остаток топлива"
                          : true,
                    })}
                    disabled={id ? true : false}
                    placeholder="0"
                  />
                  {errors.quantity_utilized && (
                    <p className="text-red-500 text-sm">
                      {errors.quantity_utilized.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex justify-end">
                <Button className="bg-[#4880FF] text-white hover:bg-blue-600 w-[250px] rounded">
                  Утилизировать
                </Button>
              </div>
            </form>
          </FormProvider>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm">
                Оставшееся количество переработанное масло (литр)
              </label>
              <Input value={oil_volume} readOnly className="bg-muted" />
            </div>
          </div>
        </CardContent>
      </Card>
      <UtilizedOilTable/>
    </div>
  );
}
