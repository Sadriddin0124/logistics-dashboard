"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";

interface FormValues {
    price_1: string
    price_2: string
}

export default function GasManagementForm() {
    const { register, handleSubmit} = useForm<FormValues>({
        defaultValues: {
            price_1: "34$",
            price_2: "434$"
        }
    })
  const { id } = useRouter().query;
  const onSubmit = (data: FormValues) => {
    console.log(data);
  }
  return (
    <div className="w-full container mx-auto mt-8 space-y-8">
      {/* Top Form Section */}
      <Card>
        <CardContent className="p-6 space-y-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-2 gap-6">

              <div className="space-y-2">
                <label className="text-sm">Цена на утилизированное масло (литр)</label>
                <Input {...register("price_2",)} placeholder="Цена..." />
              </div>
            <div className="space-y-2">
                <label className="text-sm">
                Количество утилизированного масла (литр)
                </label>
                <Input disabled={id ? true : false} placeholder="0" />
              </div>
            </div>

            <div className="flex justify-end">
              <Button className="bg-[#4880FF] text-white hover:bg-blue-600 w-[250px] rounded">
              Утилизировать
              </Button>
            </div>
          </form>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm">Оставшееся количество переработанное масло  (литр)</label>
              <Input value="340" readOnly className="bg-muted" />
            </div>
          </div>
        </CardContent>
      </Card>

    </div>
  );
}
