import { useForm, Controller } from "react-hook-form";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { IUser } from "@/lib/types/user.types";
import { useEffect } from "react";

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (user: IUser) => void;
  user: IUser | null;
}

export function UserModal({ isOpen, onClose, onSave, user }: UserModalProps) {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
    setValue
  } = useForm<IUser>({
    defaultValues: {
      id: "",
      phone: "+998",
      full_name: "",
      password: "",
    },
  });

  // Обновление значений формы при изменении пользователя
  useEffect(() => {
    if (user) {
      reset(user);
      setValue("password", "password")
    } else {
      reset({
        id: "",
        phone: "+998",
        full_name: "",
        password: "",
      });
    }
  }, [user, reset, setValue]);

  const onSubmit = (data: IUser) => {
    onSave(data);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{user ? "Редактировать пользователя" : "Добавить пользователя"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="full_name" className="text-right">
                Полное имя
              </Label>
              <Controller
                name="full_name"
                control={control}
                rules={{ required: "Полное имя обязательно" }}
                render={({ field }) => (
                  <Input
                    id="full_name"
                    {...field}
                    className="col-span-3"
                  />
                )}
              />
              {errors.full_name && (
                <p className="text-red-500 text-sm col-span-4 text-right">
                  {errors.full_name.message}
                </p>
              )}
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="phone" className="text-right">
                Телефон
              </Label>
              <Controller
                name="phone"
                control={control}
                rules={{ required: "Телефон обязателен" }}
                render={({ field }) => (
                  <Input
                    id="phone"
                    {...field}
                    className="col-span-3"
                  />
                )}
              />
              {errors.phone && (
                <p className="text-red-500 text-sm col-span-4 text-right">
                  {errors.phone.message}
                </p>
              )}
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="password" className="text-right">
                Пароль
              </Label>
              <Controller
                name="password"
                control={control}
                rules={{ required: "Пароль обязателен" }}
                render={({ field }) => (
                  <Input
                    id="password"
                    type="password"
                    {...field}
                    className="col-span-3"
                  />
                )}
              />
              {errors.password && (
                <p className="text-red-500 text-sm col-span-4 text-right">
                  {errors.password.message}
                </p>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button type="submit" className="bg-blue-500">Сохранить</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
