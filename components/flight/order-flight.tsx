"use client";

import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface DriverFormData {
  city: string;
  tripCost: string;
  driverExpenses: string;
  driverName: string;
  driverNumber: string;
  vehicleNumber: string;
  cargoInfo: string;
}

export default function DriverForm() {
  const { register, handleSubmit } = useForm<DriverFormData>();

  const onSubmit = (data: DriverFormData) => {
    console.log(data);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="container mx-auto bg-white min-h-[70vh] flex flex-col justify-between p-8 mt-8 space-y-4 rounded-2xl"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Выберите город*</label>
          <Select
            onValueChange={(value) =>
              register("city").onChange({ target: { value } })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Выберите..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="moscow">Москва</SelectItem>
              <SelectItem value="spb">Санкт-Петербург</SelectItem>
              <SelectItem value="kazan">Казань</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Введите имя водителя</label>
          <Input {...register("driverName")} placeholder="Введите..." />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">
            Введите стоимость рейса*
          </label>
          <Input
            {...register("tripCost")}
            placeholder="Введите цену"
            type="number"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Введите номер водителя</label>
          <Input {...register("driverNumber")} placeholder="Введите..." />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">
            Расходы, выделяемые водителю на рейс*
          </label>
          <Input
            {...register("driverExpenses")}
            placeholder="Введите цену"
            type="number"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">
            Введите номер автомобиля
          </label>
          <Input {...register("vehicleNumber")} placeholder="Введите..." />
        </div>
        <div className="space-y-2 col-span-2">
          <label className="text-sm font-medium">Информация о грузе</label>
          <Textarea
            {...register("cargoInfo")}
            placeholder="Введите информацию о грузе"
            className="min-h-[100px]"
          />
        </div>
      </div>

      <div className="flex justify-end gap-4">
        <Button
          type="submit"
          className="bg-[#4880FF] text-white hover:bg-blue-600 w-[300px] rounded-md"
        >
          Завершить рейс
        </Button>
        <Button
          type="submit"
          className="bg-[#4880FF] text-white hover:bg-blue-600 w-[300px] rounded-md"
        >
          Сохранить
        </Button>
      </div>
    </form>
  );
}
