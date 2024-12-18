"use client";

import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { useRouter } from "next/router";
import { useMutation } from "@tanstack/react-query";
import { LoginTypes, LoginUser } from "@/lib/actions/auth";
import { formatPhoneNumber, formatUzbekistanPhoneNumber } from "@/lib/functions";

const loginSchema = z.object({
  phone_number: z.string(),
  password: z.string()
    // .min(8, { message: "Password must be at least 8 characters long" }),
});

type LoginFormData = z.infer<typeof loginSchema>;

type ErrorType = {
  status: number
}
export default function LoginForm() {
  const methods =  useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      phone_number: "+998 ",
    }
  });
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = methods
const { push } = useRouter()
const [errorMessage, setErrorMessage] = useState<string>("")
const { mutate, isPending, isError } = useMutation({
  mutationFn: LoginUser,
  onSuccess: (data) => {
    console.log(data);
    localStorage.setItem("accessToken", data?.access)
    localStorage.setItem("refreshToken", data?.refresh)
    localStorage.setItem("role", data?.role)
  },
  onError: (error: ErrorType) => {
    console.log(error);
    if (error?.status === 401) {
      setErrorMessage("Kontragent nomi yoki parol noto‘g‘ri")
    } else {
      setErrorMessage("Ma'lumotlarni yuklashda xatolik")
    }
  }
})

const onSubmit = (data: LoginTypes) => {
  mutate({...data, phone_number: formatPhoneNumber(data?.phone_number)}, {
    onSuccess: () => {
      sessionStorage.setItem("isLoggedIn", "true")
      push('/');
    },
    onError: () => {
      
    }
  });
};

  return (
    <section className="w-full h-screen flex justify-center items-center bg-slate-100 fixed top-0 left-0">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl">Tizimga kirish</CardTitle>
          <CardDescription>
            Tizimga kirish uchun ma&apos;lumotlaringizni kiriting
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="phone_number">Telefon raqam</Label>
              <Controller
                  name="phone_number"
                  control={control}
                  rules={{
                    required: true,
                    pattern: {
                      value: /^\+998 \d{2} \d{3} \d{2} \d{2}$/,
                      message: "Noto‘g‘ri raqam formati",
                    },
                  }}
                  render={({ field: { onChange, value, ...field } }) => (
                    <Input
                      {...field}
                      id="phone_number"
                      type="tel"
                      value={value}
                      onChange={(e) => {
                        const formattedValue = formatUzbekistanPhoneNumber(e.target.value)
                        onChange(formattedValue);
                        e.target.value = formattedValue;
                      }}
                      className="font-mono"
                      placeholder="+998 __ ___ __ __"
                      aria-describedby="phone-hint"
                    />
                  )}
                />
                {errors.phone_number && (
                  <p className="text-sm text-destructive">
                    {errors.phone_number.message}
                  </p>
                )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Parol</Label>
              <Input
                id="password"
                type="password"
                placeholder="Parolni kiriting"
                {...register("password", {required: "Parolni kiriting"})}
                aria-invalid={errors.password ? "true" : "false"}
              />
              {errors.password && (
                <p className="text-sm text-red-500">
                  {errors.password.message}
                </p>
              )}
            </div>
            {isError && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Xato</AlertTitle>
                <AlertDescription>{errorMessage}</AlertDescription>
              </Alert>
            )}
            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? "Kirilmoqda..." : "Tizimga kirish"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </section>
  );
}
