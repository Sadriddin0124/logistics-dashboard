"использовать клиент";

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
import { LoginUser } from "@/lib/actions/auth";
import {
  formatPhoneNumber,
} from "@/lib/functions";
import { LoginTypes } from "@/lib/types/auth.types";

const loginSchema = z.object({
  phone: z.string(),
  password: z.string(),
  // .min(8, { message: "Пароль должен содержать не менее 8 символов" }),
});

type LoginFormData = z.infer<typeof loginSchema>;

type ErrorType = {
  status: number;
};
export default function LoginForm() {
  const methods = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      phone: "",
    },
  });
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = methods;
  const { push } = useRouter();
  const [errorMessage, setErrorMessage] = useState<string>("");
  const { mutate, isPending, isError } = useMutation({
    mutationFn: LoginUser,
    onSuccess: (data) => {
      console.log(data);
      localStorage.setItem("accessToken", data?.access_token);
      localStorage.setItem("refreshToken", data?.refresh_token);
      localStorage.setItem("role", data?.role);
    },
    onError: (error: ErrorType) => {
      console.log(error);
      if (error?.status === 401) {
        setErrorMessage("Имя пользователя или пароль неверны");
      } else {
        setErrorMessage("Ошибка при загрузке данных");
      }
    },
  });

  const onSubmit = (data: LoginTypes) => {
    mutate(
      { ...data, phone: formatPhoneNumber(data?.phone) },
      {
        onSuccess: () => {
          sessionStorage.setItem("isLoggedIn", "true");
          push("/");
        },
        onError: () => {},
      }
    );
  };

  return (
    <section className="w-full h-screen flex justify-center items-center bg-slate-100 fixed top-0 left-0">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl">Вход в систему</CardTitle>
          <CardDescription>
            Введите свои данные для входа в систему
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Номер телефона</Label>
              <Controller
                name="phone"
                control={control}
                render={({ field: { value, ...field } }) => (
                  <Input
                    {...field}
                    id="phone"
                    type="tel"
                    value={value}
                    placeholder="Введите номер телефона"
                    aria-describedby="phone-hint"
                  />
                )}
              />
              {errors.phone && (
                <p className="text-sm text-destructive">
                  {errors.phone.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Пароль</Label>
              <Input
                id="password"
                type="password"
                placeholder="Введите пароль"
                {...register("password", { required: "Введите пароль" })}
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
                <AlertTitle>Ошибка</AlertTitle>
                <AlertDescription>{errorMessage}</AlertDescription>
              </Alert>
            )}
            <Button
              type="submit"
              className="bg-[#4880FF] text-white hover:bg-blue-600 w-full rounded-md"
              disabled={isPending}
            >
              {isPending ? "Вход..." : "Войти в систему"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </section>
  );
}
