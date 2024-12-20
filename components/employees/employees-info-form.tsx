"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useForm, Controller } from "react-hook-form";

interface Trip {
  vehicle: string;
  price: number;
  departureDate: string;
  arrivalDate: string;
  cargo: string;
}

interface Payment {
  administrator: string;
  amount: number;
  date: string;
}
interface FormValues {
  driverName: string;
  drivingLicenseId: string;
  phoneNumber: string;
  route: string;
  passportId: string;
  balance: string;
}

export default function EmployeesInfoForm() {
  const [trips] = React.useState<Trip[]>([
    {
      vehicle: "Sonnatilla Sh.N.",
      price: 2300,
      departureDate: "12.12.2024",
      arrivalDate: "12.12.2024",
      cargo: "Ishimliklar",
    },
  ]);

  const [payments] = React.useState<Payment[]>([
    {
      administrator: "Sonnatilla Sh.N.",
      amount: 2300,
      date: "12.12.2024",
    },
  ]);
  const { control, handleSubmit, reset, watch } = useForm<FormValues>();
  const balance = watch("balance")
  const onSubmit = (data: FormValues) => {
    console.log(data); // Handle form submission
  };
  return (
    <div className="container mx-auto space-y-8 mt-8 ">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid gap-6 md:grid-cols-2 bg-white rounded-2xl p-8"
      >
        <div>
          <label className="text-sm font-medium mb-2 block">
            Полное имя водителя*
          </label>
          <Controller
            name="driverName"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <Input {...field} placeholder="Введите имя сотрудника" />
            )}
          />
        </div>

        <div>
          <label className="text-sm font-medium mb-2 block">
            Номер телефона сотрудника*
          </label>
          <Controller
            name="phoneNumber"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <Input
                {...field}
                placeholder="Введите номер телефона сотрудника."
              />
            )}
          />
        </div>

        <div>
          <label className="text-sm font-medium mb-2 block">
            Выберите маршрут водителя*
          </label>
          <Controller
            name="route"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <Select onValueChange={field.onChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Выберите..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="route1">Маршрут 1</SelectItem>
                  <SelectItem value="route2">Маршрут 2</SelectItem>
                  <SelectItem value="route3">Маршрут 3</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
        </div>

        <div>
          <label className="text-sm font-medium mb-2 block">
            ID водительских прав
          </label>
          <Controller
            name="drivingLicenseId"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <Input {...field} placeholder="Введите..." />
            )}
          />
        </div>

        <div>
          <label className="text-sm font-medium mb-2 block">
            ID паспорта водителя
          </label>
          <Controller
            name="passportId"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <Input {...field} placeholder="Введите..." />
            )}
          />
        </div>
        <div className="flex col-span-2 justify-end gap-4 mt-8">
          <Button
            type="button"
            className="bg-[#4880FF] text-white hover:bg-blue-600 w-[250px] rounded-md"
            onClick={() => reset()} // Reset form fields
            disabled={balance !== "0" ? true  : false}
          >
            Удалить сотрудника
          </Button>
          <Button type="submit" className="bg-[#4880FF] text-white hover:bg-blue-600 w-[250px] rounded-md">Сохранить</Button>
        </div>

        <div>
          <label className="text-sm font-medium mb-2 block">Баланс водителя</label>
          <Controller
            name="balance"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <Input {...field} placeholder="Введите баланс водителя..." />
            )}
          />
        </div>

      </form>

      <div className="space-y-6">
        <div className=" p-8 rounded-2xl bg-white min-h-[50vh]">
          <h3 className="text-lg font-medium mb-4">История рейсов</h3>
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow className="border-b border-b-gray-200">
                  <TableHead>Автомобиль</TableHead>
                  <TableHead>Цена</TableHead>
                  <TableHead>Дата отправления</TableHead>
                  <TableHead>Дата приезда</TableHead>
                  <TableHead>Груз</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {trips.map((trip, index) => (
                  <TableRow key={index} className="border-b border-b-gray-200">
                    <TableCell>{trip.vehicle}</TableCell>
                    <TableCell>${trip.price}</TableCell>
                    <TableCell>{trip.departureDate}</TableCell>
                    <TableCell>{trip.arrivalDate}</TableCell>
                    <TableCell>{trip.cargo}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

        <div className=" p-8 rounded-2xl bg-white min-h-[50vh]">
          <h3 className="text-lg font-medium mb-4">История платежей</h3>
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow className="border-b border-b-gray-200">
                  <TableHead>Администратор</TableHead>
                  <TableHead>Сумма</TableHead>
                  <TableHead>Дата</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payments.map((payment, index) => (
                  <TableRow key={index} className="border-b border-b-gray-200">
                    <TableCell>{payment.administrator}</TableCell>
                    <TableCell>${payment.amount}</TableCell>
                    <TableCell>{payment.date}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
}
