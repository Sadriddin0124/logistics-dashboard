// 'use client'

// import { zodResolver } from "@hookform/resolvers/zod"
// import { useForm } from "react-hook-form"
// import * as z from "zod"

// import { Button } from "@/components/ui/button"
// import { Card, CardContent } from "@/components/ui/card"
// import { Input } from "@/components/ui/input"
// import { Textarea } from "@/components/ui/textarea"
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form"

// const formSchema = z.object({
//   reason: z.string().min(2, {
//     message: "Reason must be at least 2 characters.",
//   }),
//   amount: z.string().min(1, {
//     message: "Amount is required.",
//   }),
//   comments: z.string().optional(),
// })

// export default function ExpenseForm() {
//   const form = useForm<z.infer<typeof formSchema>>({
//     resolver: zodResolver(formSchema),
//     defaultValues: {
//       reason: "",
//       amount: "",
//       comments: "",
//     },
//   })

//   function onSubmit(values: z.infer<typeof formSchema>) {
//     console.log(values)
//   }

//   return (
//     <Card className="w-full container mx-auto">
//       <CardContent className="pt-6">
//         <Form {...form}>
//           <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <FormField
//                 control={form.control}
//                 name="reason"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Укажите причину прихода*</FormLabel>
//                     <FormControl>
//                       <Input placeholder="Введите..." {...field} />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
//               <FormField
//                 control={form.control}
//                 name="amount"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Введите сумму расхода*</FormLabel>
//                     <FormControl>
//                       <Input placeholder="Введите..." {...field} />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
//             </div>
//             <FormField
//               control={form.control}
//               name="comments"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Комментарий</FormLabel>
//                   <FormControl>
//                     <Textarea
//                       placeholder="Напишите комментарий"
//                       className="min-h-[120px] resize-none"
//                       {...field}
//                     />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
//             <div className="flex justify-end">
//               <Button type="submit">Сохранить</Button>
//             </div>
//           </form>
//         </Form>
//       </CardContent>
//     </Card>
//   )
// }

import { useForm, FormProvider } from "react-hook-form";
import { Textarea } from "@/components/ui/textarea";
import { useMutation } from "@tanstack/react-query";
import { createFinance } from "@/lib/actions/finance.action";
import { toast } from "react-toastify";
import { removeCommas } from "@/lib/utils";
import { queryClient } from "@/components/ui-items/ReactQueryProvider";
import { CurrencyInputs } from "@/components/ui-items/currency-inputs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// interface PartField {
//   name: string;
//   id: string;
//   price: string;
//   status: boolean;
// }

interface PartsFormData {
  action: string;
  amount_uzs: string;
  amount_usd: string;
  kind: string;
  flight: string;
  driver: string;
  car: string;
  balance: string;
  reason: string;
  comment: string;
}

export default function IncomeForm() {
  const methods = useForm<PartsFormData>();
  const {
    register,
    formState: { errors },
    reset
  } = methods;

  const { mutate: createMutation } = useMutation({
    mutationFn: createFinance,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["finance"] });
      toast.success(" muvaffaqiyatli qo'shildi!");
      reset()
    },
    onError: () => {
      toast.error("ni qo'shishda xatolik!");
    },
  });

  const onSubmit = (data: PartsFormData) => {
    const formData = {
      ...data,
      action: "INCOME",
      amount_uzs: Number(removeCommas(data?.amount_uzs)),
      amount_usd: Number(removeCommas(data?.amount_usd)),
      car: "",
      flight: "",
      employee: "",
    };
    createMutation(formData);
  };

  return (
    <div className="p-8 mt-8 bg-white">
      <FormProvider {...methods}>
        <form
          onSubmit={methods.handleSubmit(onSubmit)}
          className="flex flex-col"
        >
          <h2 className="text-2xl font-semibold capitalize">прихода</h2>
          <div className="grid grid-cols-1 gap-4 mt-4">
            <div className=" grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Причина*</label>
                <Input
                  {...register("reason", { required: true })}
                  placeholder="Введите причину..."
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Введите сумму расхода.*
                </label>
                <CurrencyInputs name="amount" />
              </div>
              {errors?.amount_usd && (
                <p className="text-red-500">{errors?.amount_usd?.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">
                Комментарий о ремонте
              </label>
              <Textarea
                placeholder="Напишите комментарий..."
                className="min-h-[120px] resize-none"
                {...register("comment", { required: "Это значение является обязательным" })}
              />
              {errors?.comment && (
                <p className="text-red-500">{errors?.comment?.message}</p>
              )}
            </div>
            <div className="w-full justify-end flex">
              <Button
                type="submit"
                className="bg-[#4880FF] text-white hover:bg-blue-600 w-[300px] rounded-md"
              >
                Добавит
              </Button>
            </div>
          </div>
        </form>
      </FormProvider>
    </div>
  );
}
