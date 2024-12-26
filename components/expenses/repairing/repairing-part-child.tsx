'use client'

import { useFieldArray, useFormContext } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { X } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"

export default function RepairingPartChild() {
  const { control, register, setValue, watch } = useFormContext()
  const { fields, append, remove } = useFieldArray({
    control,
    name: "parts",
  })
const onCheckedChange = (index: number) => {
    const value = watch(`parts.${index}.status`)
    setValue(`parts.${index}.status`, !value)
} 
  return (
    <div>
      <div className="grid w-full">
        {fields.map((field, index) => (
          <div
            key={field.id}
            className="p-4 border grid grid-cols-2 gap-4 rounded-lg relative"
          >
            {index > 0 && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-2 top-0"
                onClick={() => remove(index)}
              >
                <X className="h-4 w-4" />
              </Button>
            )}

            <div className="grid gap-2">
              <Label htmlFor={`parts.${index}.name`}>Название запчасти</Label>
              <Input
                {...register(`parts.${index}.name`)}
                placeholder="Введите название запчасти..."
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor={`parts.${index}.id`}>ID запчасти</Label>
              <Input
                {...register(`parts.${index}.id`)}
                placeholder="Введите ID запчасти..."
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor={`parts.${index}.price`}>
                Введите цену запчасти
              </Label>
              <Input
                {...register(`parts.${index}.price`)}
                placeholder="Введите цену запчасти..."
              />
            </div>

            {/* Radio buttons for Confirm */}
            <div className="grid grid-cols-2 gap-2">
              <div className="flex items-center">
                <Checkbox
                  {...register(`parts.${index}.status`)}
                  id={`confirm-true-${index}`}
                  onCheckedChange={()=>onCheckedChange(index)}
                />
                <Label htmlFor={`confirm-true-${index}`} className="ml-2">Confirm</Label>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-2 items-center justify-end w-full">
        <Button
          type="button"
          variant="outline"
          onClick={() => append({ name: "", id: "", price: "", status: false })}
        >
          Добавить новую запчасть
        </Button>
        <Button type="submit">Сохранить</Button>
      </div>
    </div>
  )
}
