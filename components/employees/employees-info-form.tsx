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
import { useForm, Controller } from "react-hook-form";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  deleteEmployee,
  fetchEmployee,
  updateEmployee,
} from "@/lib/actions/employees.action";
import { useRouter } from "next/router";
import { IEmployee } from "@/lib/types/employee.types";
import { queryClient } from "../ui-items/ReactQueryProvider";
import { toast } from "react-toastify";
import { DeleteAlertDialog } from "../ui-items/delete-dialog";
import { EmployeeFlightTable } from "./employee.flight";
import { EmployeeExpensesTable } from "./employe-expenses";

interface FormValues {
  full_name: string;
  license: string;
  phone: string;
  flight_type: string;
  passport: string;
  balance_uzs: string;
}

export function areObjectsEqual(obj1: IEmployee, obj2: IEmployee): boolean {
  for (const key in obj1) {
    if (obj1[key as keyof IEmployee] !== obj2[key as keyof IEmployee]) {
      return false;
    }
  }
  return true;
}

export default function EmployeesInfoForm() {
  const router = useRouter();
  const { id } = router?.query;
  
  const { data: employee } = useQuery<IEmployee>({
    queryKey: ["employee"],
    queryFn: () => fetchEmployee(id as string),
  });
  const { control, handleSubmit, reset, watch, getValues } =
    useForm<FormValues>({
      defaultValues: {
        flight_type: employee?.flight_type
      }
    });
  const [isChanged, setIsChanged] = useState(false);

  const balance = watch("balance_uzs");
  console.log(balance);
  
  useEffect(() => {
    if (employee) {
      reset(employee);
    }
  }, [employee, reset]);
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
      toast.success(" Сохранено успешно!");
    },
    onError: () => {
      toast.error("Ошибка сохранения!");
    },
  });
  const onSubmit = (data: FormValues) => {
    updateMutation({ ...data, id: id as string });
  };
  const { mutate: deleteMutation } = useMutation({
    mutationFn: deleteEmployee,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employees"] });
      toast.success(" Сохранено успешно!");
      router.push("/employees");
    },
    onError: () => {
      toast.error("Ошибка сохранения!");
    },
  });
  const handleDelete = (id: string) => {
    deleteMutation(id as string);
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
          <label className="text-sm font-medium">Выберите регион*</label>

          <Controller
            name="flight_type"
            control={control}
            
            render={({ field }) => (
              <Select value={field?.value} onValueChange={field.onChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Выберите..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="OUT">За территории Узбекистана</SelectItem>
                  <SelectItem value="IN_UZB">
                    На территории Узбекистана.
                  </SelectItem>
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
          {!balance && (
            <DeleteAlertDialog
              id={id as string}
              onDelete={handleDelete}
              type="big"
            />
          )}
          <Button
            disabled={!isChanged}
            type="submit"
            className="bg-[#4880FF] text-white hover:bg-blue-600 w-[250px] rounded-md"
          >
            Сохранить
          </Button>
        </div>

        <div>
          <label className="text-sm font-medium mb-2 block">
            Баланс водителя
          </label>
          <Input
            value={employee?.balance_uzs || "0"}
            readOnly
            placeholder="Введите баланс водителя..."
            className="bg-muted"
          />
        </div>
      </form>

      <div className="space-y-6">
        <div className=" p-8 rounded-2xl bg-white min-h-[50vh]">
          <h3 className="text-lg font-medium mb-4">История рейсов</h3>
          <div className="border rounded-lg">
            <EmployeeFlightTable />
          </div>
        </div>

        <div className=" p-8 rounded-2xl bg-white min-h-[50vh]">
          <h3 className="text-lg font-medium mb-4">История платежей</h3>
          <div className="border rounded-lg">
            <EmployeeExpensesTable />
          </div>
        </div>
      </div>
    </div>
  );
}
