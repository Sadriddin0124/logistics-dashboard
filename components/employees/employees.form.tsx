'use client'

import { useForm } from 'react-hook-form'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface FormValues {
  employeeName: string
  phoneNumber: string
  region: string
  route: string
  price: string
  departureDate: string
  cargoInfo: string
}

export default function EmployeesForm() {
  const { register, handleSubmit, setValue, formState: { errors } } = useForm<FormValues>()

  const onSubmit = (data: FormValues) => {
    console.log(data)
  }

  return (
    <div className="p-6 container bg-white rounded-xl mt-8 mx-auto">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 bg-white">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm">
              Имя сотрудника*
            </label>
            <Input
              className="bg-[#F4F4F5]"
              placeholder="Введите имя сотрудника"
              {...register("employeeName", { required: "Это поле обязательно" })}
            />
            {errors.employeeName && <p className="text-red-500 text-xs mt-1">{errors.employeeName.message}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-sm">
              Номер телефона сотрудника*
            </label>
            <Input
              className="bg-[#F4F4F5]"
              placeholder="Введите номер телефона сотрудника."
              {...register("phoneNumber", { required: "Это поле обязательно" })}
            />
            {errors.phoneNumber && <p className="text-red-500 text-xs mt-1">{errors.phoneNumber.message}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm">
              Выберите область*
            </label>
            <Select onValueChange={(value) => setValue('region', value)}>
              <SelectTrigger className="bg-[#F4F4F5]">
                <SelectValue placeholder="Выберите..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="region1">Область 1</SelectItem>
                <SelectItem value="region2">Область 2</SelectItem>
                <SelectItem value="region3">Область 3</SelectItem>
              </SelectContent>
            </Select>
            {errors.region && <p className="text-red-500 text-xs mt-1">{errors.region.message}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-sm">
              введите цену Рейсы
            </label>
            <Input
              className="bg-[#F4F4F5]"
              placeholder="Введите цену"
              {...register("price", { required: "Это поле обязательно" })}
            />
            {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price.message}</p>}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm">
            Маршрут
          </label>
          <Select onValueChange={(value) => setValue('route', value)}>
            <SelectTrigger className="bg-[#F4F4F5]">
              <SelectValue placeholder="Выберите..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="route1">Маршрут 1</SelectItem>
              <SelectItem value="route2">Маршрут 2</SelectItem>
              <SelectItem value="route3">Маршрут 3</SelectItem>
            </SelectContent>
          </Select>
          {errors.route && <p className="text-red-500 text-xs mt-1">{errors.route.message}</p>}
        </div>

        <div className="space-y-2">
          <label className="text-sm">
            Введите дату отъезда
          </label>
          <Input
            className="bg-[#F4F4F5]"
            placeholder="Введите дату"
            type="date"
            {...register("departureDate", { required: "Это поле обязательно" })}
          />
          {errors.departureDate && <p className="text-red-500 text-xs mt-1">{errors.departureDate.message}</p>}
        </div>

        <div className="space-y-2">
          <label className="text-sm">
            Информация о грузе
          </label>
          <Textarea
            className="bg-[#F4F4F5] min-h-[120px]"
            placeholder="Введите информацию о грузе"
            {...register("cargoInfo", { required: "Это поле обязательно" })}
          />
          {errors.cargoInfo && <p className="text-red-500 text-xs mt-1">{errors.cargoInfo.message}</p>}
        </div>

        <div className="w-full flex justify-end">
        <Button
          type="submit"
          className="bg-[#4880FF] text-white hover:bg-blue-600 w-[250px] rounded-md"
        >
          Добавить
        </Button>
      </div>
      </form>
    </div>
  )
}

