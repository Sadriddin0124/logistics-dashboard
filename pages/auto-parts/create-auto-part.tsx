"use client";

import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { IAutoParts } from "@/lib/types/auto-part.types";

export default function CreateAutoPart() {
  const { register, handleSubmit, setValue } = useForm<IAutoParts>({
    defaultValues: {
      city: "",
      tripCost: "",
      driverExpenses: "",
      driverName: "",
      driverNumber: "",
      vehicleNumber: "",
      cargoInfo: "",
    },
  });

  const onSubmit = (data: IAutoParts) => {
    console.log(data);
  };

  return (
    <div className="p-8 mt-8 rounded-2xl bg-white mx-auto container">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 mx-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">Выберите город*</label>
            <Select onValueChange={(value) => setValue("city", value)}>
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
            <Input placeholder="Введите..." {...register("driverName")} />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">
              Введите стоимость рейса*
            </label>
            <Input
              placeholder="Введите цену"
              type="number"
              {...register("tripCost")}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">
              Введите номер водителя
            </label>
            <Input placeholder="Введите..." {...register("driverNumber")} />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">
              Расходы, выделяемые водителю на рейс*
            </label>
            <Input
              placeholder="Введите цену"
              type="number"
              {...register("driverExpenses")}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">
              Введите номер автомобиля
            </label>
            <Input placeholder="Введите..." {...register("vehicleNumber")} />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Информация о грузе</label>
          <Textarea
            placeholder="Введите информацию о грузе"
            className="min-h-[120px]"
            {...register("cargoInfo")}
          />
        </div>

        <div className="flex justify-end gap-4">
          <Button type="submit" variant="secondary">
            Завершить рейс
          </Button>
          <Button type="submit">Сохранить</Button>
        </div>
      </form>
    </div>
  );
}
