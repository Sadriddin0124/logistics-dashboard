import { useForm, Controller } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { IUser } from "@/lib/types/user.types";
import { useEffect } from "react";
import { Checkbox } from "@/components/ui/checkbox";

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
    setValue,
    formState: { errors },
  } = useForm<IUser>({
    defaultValues: {
      id: "",
      phone: "+998",
      full_name: "",
      password: "password",
      can_delete: false, // Default value for the checkbox
    },
  });

  // Update form values when the user changes
  useEffect(() => {
    if (user) {
      reset({ ...user, password: "" });
    } else {
      reset({
        id: "",
        phone: "+998",
        full_name: "",
        password: "",
        can_delete: false,
      });
    }
  }, [user, reset, setValue]);

  const onSubmit = (data: IUser) => {
    onSave(data);
    reset()
  };
  const handleClose = () => {
    onClose()
    reset()
  }
  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {user ? "Редактировать пользователя" : "Добавить пользователя"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-4 py-4">
            {/* Full Name Field */}
            <div className="flex flex-col items-start gap-2">
              <Label htmlFor="full_name">Полное имя</Label>
              <Controller
                name="full_name"
                control={control}
                rules={{ required: "Полное имя обязательно" }}
                render={({ field }) => (
                  <Input id="full_name" {...field} className="col-span-3" />
                )}
              />
              {errors.full_name && (
                <p className="text-red-500 text-sm">{errors.full_name.message}</p>
              )}
            </div>

            {/* Phone Field */}
            <div className="flex flex-col items-start gap-2">
              <Label htmlFor="phone">Телефон</Label>
              <Controller
                name="phone"
                control={control}
                rules={{ required: "Телефон обязателен" }}
                render={({ field }) => (
                  <Input id="phone" {...field} className="col-span-3" />
                )}
              />
              {errors.phone && (
                <p className="text-red-500 text-sm">{errors.phone.message}</p>
              )}
            </div>

            {/* Password Field */}
            <div className="flex flex-col items-start gap-2">
              <Label htmlFor="password">Пароль</Label>
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
                <p className="text-red-500 text-sm">{errors.password.message}</p>
              )}
            </div>

            {/* Can Delete Checkbox */}
            <div className="flex flex-col items-start gap-2">
              <Label htmlFor="can_delete">Можно удалить</Label>
              <Controller
                name="can_delete"
                control={control}
                render={({ field }) => (
                  <Checkbox
                    checked={field.value} // Bind checkbox state to `field.value`
                    onCheckedChange={field.onChange} // Update form state on change
                    className="col-span-3"
                  />
                )}
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="submit" className="bg-blue-500">
              Сохранить
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
