'use client'

import { Dispatch, SetStateAction, useEffect } from 'react'
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

export default function CreateModel({isOpen, setIsOpen, editItem, setEditItem}: {editItem: null | IGasStation, setEditItem: Dispatch<SetStateAction<null | IGasStation>>, isOpen: boolean, setIsOpen: Dispatch<SetStateAction<boolean>>}) {
  const { register, handleSubmit, formState: { errors }, reset } = useForm<FormData>()
    useEffect(()=> {
        if (editItem) {
            reset(editItem)
        }
    },[reset, editItem])
  const onSubmit = (data: FormData) => {
    if (editItem) {
        setEditItem(null)
    }else {
        console.log(data)
    }
    setIsOpen(false)
    reset()
  }

  return (
    <div className="p-4">
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button className='bg-[#4880FF] text-white hover:bg-blue-600'>Open Model Form</Button>
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
            <Button type="submit" className='bg-[#4880FF] text-white hover:bg-blue-600'>Submit</Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

