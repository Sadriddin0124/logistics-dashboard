'use client'

import { Dispatch, SetStateAction, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useMutation } from '@tanstack/react-query'
import { createModel, updateModel } from '@/lib/actions/cars.action'
import { queryClient } from '../ui-items/ReactQueryProvider'
import { toast } from 'react-toastify'
import { IModel } from '@/lib/types/cars.types'

type FormData = {
  name: string
}

export default function CreateModel({isOpen, setIsOpen, editItem, setEditItem}: {editItem: null | IModel, setEditItem: Dispatch<SetStateAction<null | IModel>>, isOpen: boolean, setIsOpen: Dispatch<SetStateAction<boolean>>}) {
  const { register, handleSubmit, formState: { errors }, reset } = useForm<FormData>()
    useEffect(()=> {
        if (editItem) {
            reset(editItem)
        }
    },[reset, editItem])
    const { mutate: createMutation } = useMutation({
      mutationFn: createModel,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["models"] });
        toast.success(" Сохранено успешно!");
      },
      onError: () => {
        toast.error("Ошибка сохранения!");
      },
    });
    const { mutate: updateMutation } = useMutation({
      mutationFn: updateModel,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["models"] });
        reset();
        toast.success(" Сохранено успешно!");
        setEditItem(null)
      },
      onError: () => {
        toast.error("Ошибка сохранения!");
      },
    });
  const onSubmit = (data: FormData) => {
    if (editItem) {
      updateMutation({id: editItem?.id as string, ...data})
    }else {
        createMutation(data)
    }
    setIsOpen(false)
    reset()
  }

  return (
    <div className="p-4">
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button className='bg-[#4880FF] text-white hover:bg-blue-600'>Добавить бренд</Button>
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
            <Button type="submit" className='bg-[#4880FF] text-white hover:bg-blue-600'>Сохранять</Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

