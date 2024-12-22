'use client'

import { Dispatch, SetStateAction } from 'react'
import { useForm } from 'react-hook-form'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { IGasStation } from '@/lib/types/gas_station.types'

type FormData = {
  name: string
  goingPrice: number
  returnPrice: number
}

export default function CreateCityModal({isOpen, setIsOpen, editItem, setEditItem}: {editItem: null | IGasStation, setEditItem: Dispatch<SetStateAction<null | IGasStation>>, isOpen: boolean, setIsOpen: Dispatch<SetStateAction<boolean>>}) {
  const { register, handleSubmit, formState: { errors }, reset } = useForm<FormData>()

  const onSubmit = (data: FormData) => {
    if (editItem) {
      console.log(data);
    }
    setEditItem(null)
    setIsOpen(false)
    reset()
  }

  return (
    <div className="p-4">
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button className='bg-[#4880FF] text-white hover:bg-blue-600'>Open Travel Form</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Travel Information</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                {...register("name", { required: "Name is required" })}
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
            </div>
            <div>
              <Label htmlFor="goingPrice">Price for Going</Label>
              <Input
                id="goingPrice"
                type="number"
                {...register("goingPrice", { 
                  required: "Price for going is required",
                  min: { value: 0, message: "Price must be positive" }
                })}
              />
              {errors.goingPrice && <p className="text-red-500 text-sm mt-1">{errors.goingPrice.message}</p>}
            </div>
            <div>
              <Label htmlFor="returnPrice">Price for Return</Label>
              <Input
                id="returnPrice"
                type="number"
                {...register("returnPrice", { 
                  required: "Price for return is required",
                  min: { value: 0, message: "Price must be positive" }
                })}
              />
              {errors.returnPrice && <p className="text-red-500 text-sm mt-1">{errors.returnPrice.message}</p>}
            </div>
            <Button type="submit" className='bg-[#4880FF] text-white hover:bg-blue-600'>Submit</Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

