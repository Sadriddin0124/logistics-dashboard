"use client";

import React, { useEffect, useState } from "react";
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
import { useMutation, useQuery } from "@tanstack/react-query";
import { fetchEmployee, updateEmployee } from "@/lib/actions/employees.action";
import { useRouter } from "next/router";
import { IEmployee } from "@/lib/types/employee.types";
import { queryClient } from "../ui-items/ReactQueryProvider";
import { toast } from "react-toastify";

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
  full_name: string;
  license: string;
  phone: string;
  flight_type: string;
  passport: string;
  balance: string;
}

function areObjectsEqual(obj1: IEmployee, obj2: IEmployee): boolean {
  for (const key in obj1) {
    if (obj1[key as keyof IEmployee] !== obj2[key as keyof IEmployee]) {
      return false;
    }
  }
  return true;
}



export default function EmployeesInfoForm() {
  const { id } = useRouter()?.query
  const [trips] = useState<Trip[]>([
    {
      vehicle: "Sonnatilla Sh.N.",
      price: 2300,
      departureDate: "12.12.2024",
      arrivalDate: "12.12.2024",
      cargo: "Ishimliklar",
    },
  ]);

  const [payments] = useState<Payment[]>([
    {
      administrator: "Sonnatilla Sh.N.",
      amount: 2300,
      date: "12.12.2024",
    },
  ]);
  const { control, handleSubmit, reset, watch, getValues } = useForm<FormValues>();
  const [isChanged, setIsChanged] = useState(false);

  const balance = watch("balance")
  const { data: employee } = useQuery<IEmployee>({
    queryKey: ["employee"],
    queryFn: ()=> fetchEmployee(id as string),
  });
  useEffect(()=> {
    if (employee) {
      reset(employee)
    }
  },[employee, reset])
  useEffect(() => {
    const subscription = watch((_, { name, type }) => {
      const currentValues = getValues();
      const hasChanged = !areObjectsEqual(employee as IEmployee, currentValues);
      setIsChanged(hasChanged);
      if (name) {
        console.log(`${name} changed (${type})`);
      }
    });

    console.log(isChanged);
    return () => subscription.unsubscribe();
  }, [employee, watch, getValues, isChanged]);
  const { mutate: updateMutation } = useMutation({
    mutationFn: updateEmployee,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employee"] });
      reset();
      toast.success(" muvaffaqiyatli qo'shildi!");
    },
    onError: () => {
      toast.error("ni qo'shishda xatolik!");
    },
  });
  const onSubmit = (data: FormValues) => {
    updateMutation({...data, id: id as string}); 
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
            name="full_name"
            control={control}
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
            name="phone"
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
            name="flight_type"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <Select onValueChange={field.onChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Выберите..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="IN_UZB">IN_UZB</SelectItem>
                  <SelectItem value="OUT">OUT</SelectItem>
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
            name="license"
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
            name="passport"
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
          <Button disabled={!isChanged} type="submit" className="bg-[#4880FF] text-white hover:bg-blue-600 w-[250px] rounded-md">Сохранить</Button>
        </div>

        <div>
          <label className="text-sm font-medium mb-2 block">Баланс водителя</label>
          <Input value={employee?.balance || "0"} readOnly placeholder="Введите баланс водителя..." className="bg-muted"/>
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
