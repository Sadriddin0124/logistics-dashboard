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

import { useForm, Controller } from "react-hook-form";
import { IEmployee } from "@/lib/types/employee.types";
import { useMutation } from "@tanstack/react-query";
import { createEmployee } from "@/lib/actions/employees.action";
import { queryClient } from "../ui-items/ReactQueryProvider";
import { toast } from "react-toastify";

import { useRouter } from "next/router";

export default function EmployeesInfoForm() {
  const { control, handleSubmit } = useForm<IEmployee>({
    defaultValues: {
      phone: ""
    }
  });
  const { push } = useRouter()
  const { mutate: createMutation } = useMutation({
    mutationFn: createEmployee,
    onSuccess: () => {
      push(`/employees`)
      queryClient.invalidateQueries({ queryKey: ["employees"] });
      toast.success(" muvaffaqiyatli qo'shildi!");
    },
    onError: () => {
      toast.error("ni qo'shishda xatolik!");
    },
  });
  const onSubmit = (data: IEmployee) => {
    createMutation({ ...data });
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
            render={({ field }) => (
              <Input {...field} placeholder="Введите номер сотрудника" />
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
          <Button
            type="submit"
            className="bg-[#4880FF] text-white hover:bg-blue-600 w-[250px] rounded-md"
          >
            Сохранить
          </Button>
        </div>
      </form>
    </div>
  );
}
