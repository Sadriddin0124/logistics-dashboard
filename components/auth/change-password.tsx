'use client'

import { Dispatch, SetStateAction } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ChangePassword } from '@/lib/actions/auth'
import { ChangePasswordType } from '@/types/auth'
import { useMutation } from '@tanstack/react-query'
import { queryClient } from '../ReactQueryProvider'

const passwordChangeSchema = z.object({
  old_password: z.string().min(1, { message: "Joriy parol kiritilishi shart" }),
  new_password: z.string().min(1, { message: "Yangi parol kamida 6 ta belgidan iborat bo'lishi kerak" }),
  confirm_password: z.string().min(1, { message: "Yangi parolni tasdiqlash shart" }),
}).refine((data) => data.new_password === data.confirm_password, {
  message: "Yangi parollar mos kelmadi",
  path: ["confirm_password"],
})

type PasswordChangeFormValues = z.infer<typeof passwordChangeSchema>

interface PasswordChangeDialogProps {
    isDialogOpen: boolean
    setIsDialogOpen: Dispatch<SetStateAction<boolean>>
}

export function PasswordChangeDialog({ isDialogOpen, setIsDialogOpen }: PasswordChangeDialogProps) {

  const form = useForm<PasswordChangeFormValues>({
    resolver: zodResolver(passwordChangeSchema),
    defaultValues: {
      old_password: '',
      new_password: '',
      confirm_password: '',
    }
  })
  const updateMutation = useMutation({
    mutationFn: (newData: ChangePasswordType) => ChangePassword(newData),
    onSuccess: () => {
    setIsDialogOpen(false)
    queryClient.invalidateQueries({ queryKey: ["me"] });
    },
});
  const onSubmit = (data: PasswordChangeFormValues) => {
    updateMutation.mutate(data)
    form.reset()
  }

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Parolni o&apos;zgartirish</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="old_password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Joriy parol</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="Joriy parolni kiriting" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="new_password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Yangi parol</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="Yangi parolni kiriting" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirm_password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Yangi parolni tasdiqlang</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="Yangi parolni qayta kiriting" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Parolni o&apos;zgartirish</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}