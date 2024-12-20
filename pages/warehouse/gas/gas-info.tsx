"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";

interface GasEntry {
  machine: string;
  quantity: string;
  price: string;
}

interface FormValues {
  price: string;
  purchased?: string;
  paid: string;
}

export default function GasManagementForm() {
  const { register, handleSubmit } = useForm<FormValues>({
    defaultValues: {
      price: "",
      paid: "",
      purchased : "",
    },
  });
  const [entries] = useState<GasEntry[]>([
    { machine: "Isuzu 01A113AA", quantity: "300(м3)", price: "2500 сум" },
    { machine: "Isuzu 01A113AA", quantity: "300(м3)", price: "2500 сум" },
    { machine: "Isuzu 01A113AA", quantity: "300(м3)", price: "2500 сум" },
    { machine: "Isuzu 01A113AA", quantity: "300(м3)", price: "2500 сум" },
    { machine: "Isuzu 01A113AA", quantity: "300(м3)", price: "2500 сум" },
    { machine: "Isuzu 01A113AA", quantity: "300(м3)", price: "2500 сум" },
  ]);
  const { id } = useRouter().query;
  const onSubmit = (data: FormValues) => {
    console.log(data);
  };
  return (
    <div className="w-full p-4 space-y-8 container mx-auto">
      {/* Top Form Section */}
      <Card>
        <CardContent className="p-6 space-y-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              
              <div className="space-y-2">
                <label className="text-sm">Название заправки</label>
                <Input
                  disabled={id ? true : false}
                  placeholder="Название заправки..."
                />
              </div>
              <div className="space-y-2">
                <label className="text-">Оплаченная сумма</label>
                <Input {...register("paid")} placeholder="Цена..." />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
                <label className="text-sm">
                  Количество купленного газа (м3)
                </label>
                <Input disabled={id ? true : false} placeholder="0" />
              </div>

              <div className="space-y-2">
                <label className="text-sm">Цена на газ (м3)</label>
                <Input {...register("price")} placeholder="Цена..." />
              </div>
            </div>

            <div className="flex justify-end">
              <Button className="bg-[#4880FF] text-white hover:bg-blue-600 w-[250px] rounded">
                Добавить
              </Button>
            </div>
          </form>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm">Оставшееся количество газа (м3)</label>
              <Input value="2300" readOnly className="bg-muted" />
            </div>
            <div className="space-y-2">
              <label className="text-sm">Оставшаяся сумма платежа</label>
              <Input value="5,650,000" readOnly className="bg-muted" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Middle Table Section */}
      <Card>
        <CardContent className="p-6">
          <Table>
            <TableHeader className="font-bold">
              <TableRow className="border-b border-b-gray-300">
                <TableHead className="font-bold">Машина</TableHead>
                <TableHead className="font-bold">Количество</TableHead>
                <TableHead className="font-bold">Цена</TableHead>
                <TableHead className="font-bold"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {entries.map((entry, index) => (
                <TableRow key={index} className="border-b border-b-gray-300">
                  <TableCell>{entry.machine}</TableCell>
                  <TableCell>{entry.quantity}</TableCell>
                  <TableCell>{entry.price}</TableCell>
                  <TableCell>
                    <Button
                      variant="secondary"
                      className="bg-red-100 hover:bg-red-200 text-red-600"
                    >
                      Налили
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Bottom Summary Section */}
      <Card>
        <CardContent className="p-6">
          <Table>
            <TableHeader className="font-bold">
              <TableRow className="border-b border-b-gray-300">
                <TableHead className="font-bold">Оплаченная сумма</TableHead>
                <TableHead className="font-bold">Количество</TableHead>
                <TableHead className="font-bold">Цена</TableHead>
                <TableHead className="font-bold"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">10,000,000 сум</TableCell>
                <TableCell>300(м3)</TableCell>
                <TableCell>2500 сум</TableCell>
                <TableCell>
                  <Button
                    variant="secondary"
                    className="bg-green-100 hover:bg-green-200 text-green-600"
                  >
                    Куплено
                  </Button>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
