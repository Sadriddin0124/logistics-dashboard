import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

interface ExpenseFormValues {
  expenseType: string
  reason: string
  amount: string
  comment: string
}

export default function ExpenseForm() {
  const form = useForm<ExpenseFormValues>({
    defaultValues: {
      expenseType: "other",
      reason: "",
      amount: "",
      comment: "",
    },
  })

  function onSubmit(data: ExpenseFormValues) {
    console.log(data)
  }

  return (
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 w-full max-w-2xl">
        <div className="space-y-2">
          <Label htmlFor="expenseType">Выберите тип расхода*</Label>
          <Select
            onValueChange={(value) => form.setValue("expenseType", value)}
            defaultValue={form.watch("expenseType")}
          >
            <SelectTrigger>
              <SelectValue placeholder="Выберите тип расхода" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="other">Прочие расходы</SelectItem>
              <SelectItem value="travel">Командировочные расходы</SelectItem>
              <SelectItem value="office">Офисные расходы</SelectItem>
            </SelectContent>
          </Select>
          {form.formState.errors.expenseType && (
            <p className="text-sm text-red-500">{form.formState.errors.expenseType.message}</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="reason">Укажите причину расхода*</Label>
            <Input
              id="reason"
              placeholder="Введите..."
              {...form.register("reason")}
            />
            {form.formState.errors.reason && (
              <p className="text-sm text-red-500">{form.formState.errors.reason.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">Введите сумму расхода*</Label>
            <Input
              id="amount"
              placeholder="Введите..."
              {...form.register("amount")}
            />
            {form.formState.errors.amount && (
              <p className="text-sm text-red-500">{form.formState.errors.amount.message}</p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="comment">Комментарий</Label>
          <Textarea
            id="comment"
            placeholder="Напишите комментарий"
            className="min-h-[120px]"
            {...form.register("comment")}
          />
          {form.formState.errors.comment && (
            <p className="text-sm text-red-500">{form.formState.errors.comment.message}</p>
          )}
        </div>

        <Button type="submit" className="w-full">
          Отправить
        </Button>
      </form>
  )
}

