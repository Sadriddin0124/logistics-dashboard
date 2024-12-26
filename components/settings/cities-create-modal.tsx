'use client'

import { Dispatch, SetStateAction, useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useMutation } from '@tanstack/react-query'
import { createRegion, updateRegion } from '@/lib/actions/region.action'
import { queryClient } from '../ui-items/ReactQueryProvider'
import { toast } from 'react-toastify'
import { IRegion } from '@/lib/types/regions.types'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'


export default function CreateCityModal({isOpen, setIsOpen, editItem, setEditItem}: {editItem: null | IRegion, setEditItem: Dispatch<SetStateAction<null | IRegion>>, isOpen: boolean, setIsOpen: Dispatch<SetStateAction<boolean>>}) {
  const { register, handleSubmit, control, formState: { errors }, reset } = useForm<IRegion>()
  useEffect(()=> {
    if (editItem) {
      reset(editItem)
    }
  },[editItem, reset])
  const { mutate: createMutation } = useMutation({
    mutationFn: createRegion,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["regions"] });
      // push(`/warehouse/oil/oil-info?id=${data?.id}`)
      toast.success(" muvaffaqiyatli qo'shildi!");
    },
    onError: () => {
      toast.error("ni qo'shishda xatolik!");
    },
  });
  const { mutate: updateMutation } = useMutation({
    mutationFn: updateRegion,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["regions"] });
      // push(`/warehouse/oil/oil-info?id=${data?.id}`)
      toast.success(" muvaffaqiyatli qo'shildi!");
    },
    onError: () => {
      toast.error("ni qo'shishda xatolik!");
    },
  });
  const onSubmit = (data: IRegion) => {
    if (editItem) {
      console.log(data);
      updateMutation(data)
    }else {
      createMutation(data)
    }
    setEditItem(null)
    setIsOpen(false)
    reset({
      name: "",
      flight_type: undefined,
      price1: undefined,
      price2: undefined,
    });
  }
  const handleClose = () => {
    reset({
      name: "",
      flight_type: undefined, // or the appropriate default value
      price1: undefined,
      price2: undefined,
    }); // Reset the form before updating state
    setEditItem(null);
    setIsOpen(!isOpen); // Ensure the modal closes
  };
  
  return (
    <div className="p-4">
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogTrigger asChild>
          <Button onClick={()=> setIsOpen(true)} className='bg-[#4880FF] text-white hover:bg-blue-600'>Добавить регион</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Label htmlFor="name">Имя</Label>
              <Input
                id="name"
                {...register("name", { required: "Name is required" })}
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
            </div>
            
            <div>
              <Label htmlFor="price1">Цена отправления</Label>
              <Controller
              name="flight_type"
              control={control}
              rules={{ required: "Поле обязательно для заполнения." }}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="OUT">
                      За территории Узбекистана
                    </SelectItem>
                    <SelectItem value="IN_UZB">
                      На территории Узбекистана
                    </SelectItem>
                  </SelectContent>
                </Select>
              )}
            />            </div>

            <div>
              <Label htmlFor="price1">Цена отправления</Label>
              <Input
                id="price1"
                type="number"
                {...register("price1", { 
                  required: "Price for going is required",
                  min: { value: 0, message: "Price must be positive" }
                })}
              />
              {errors.price1 && <p className="text-red-500 text-sm mt-1">{errors.price1.message}</p>}
            </div>
            <div>
              <Label htmlFor="price2">Цена прибытия</Label>
              <Input
                id="price2"
                type="number"
                {...register("price2", { 
                  required: "Price for return is required",
                  min: { value: 0, message: "Price must be positive" }
                })}
              />
              {errors.price2 && <p className="text-red-500 text-sm mt-1">{errors.price2.message}</p>}
            </div>
            <Button type="submit" className='bg-[#4880FF] text-white hover:bg-blue-600'>Сохранять</Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

