import { toast } from "react-toastify";
import { queryClient } from "../ui-items/ReactQueryProvider";
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog";
import { updateFlight } from "@/lib/actions/flight.action";
import { useMutation } from "@tanstack/react-query";
import { Button } from "../ui/button";
import React, { useEffect } from "react";
import { useRouter } from "next/router";
import { useForm, Controller } from "react-hook-form";
import { Input } from "../ui/input";
import { IEmployee } from "@/lib/types/employee.types";
import { updateEmployeeBalance } from "@/lib/actions/employees.action";

interface EndFlightProps {
  id: string;
  driver: IEmployee
  balance: number;

}

interface EndFlightForm {
  endKm: number;
  balance: number;
}

const EndFlight: React.FC<EndFlightProps> = ({ id, driver, balance }) => {
  const [open, setOpen] = React.useState(false);
  const { push } = useRouter();

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<EndFlightForm>({
    defaultValues: {
      endKm: 0,
      balance: 0,
    },
  });

  useEffect(()=> {
   setValue("balance", balance)
  },[setValue, balance])

  const { mutate: updateMutation } = useMutation({
    mutationFn: updateFlight,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["flights"] });
      setOpen(false);
      reset();
      push("/flight");
    },
    onError: () => {
      toast.error("Ошибка при завершении рейса!");
    },
  });
  const { mutate: changeMutation } = useMutation({
    mutationFn: updateEmployeeBalance,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["flights"] });
      setOpen(false);
      reset();
      push("/flight");
    },
    onError: () => {
      toast.error("Ошибка при завершении рейса!");
    },
  });
  console.log(balance, driver?.balance_uzs);
  

  const onSubmit = (data: EndFlightForm) => {
    updateMutation({ id, endKm: data?.endKm });
    changeMutation({ id: driver?.id as string, balance_usz: Number(data?.balance) + Number(driver?.balance_uzs) });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-[#4880FF] text-white hover:bg-blue-600 w-[250px] rounded-md">
          Завершить рейс
        </Button>
      </DialogTrigger>
      <DialogContent className="space-y-4 p-6">
        <h3 className="text-lg font-medium">Вы уверены, что хотите завершить рейс?</h3>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Введите текущий пробег*</label>
            <Controller
              name="endKm"
              control={control}
              rules={{ required: "Текущий пробег обязателен" }}
              render={({ field }) => (
                <Input
                  type="number"
                  placeholder="Текущий пробег"
                  {...field}
                />
              )}
            />
            {errors.endKm && (
              <p className="text-red-500 text-sm">{errors.endKm.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Баланс*</label>
            <Controller
              name="balance"
              control={control}
              rules={{ required: "Баланс обязателен" }}
              render={({ field }) => (
                <Input
                  type="number"
                  placeholder="Баланс"
                  {...field}
                />
              )}
            />
            {errors.balance && (
              <p className="text-red-500 text-sm">{errors.balance.message}</p>
            )}
          </div>
          <div className="flex justify-end gap-4">
            <DialogTrigger asChild>
              <Button variant="outline" className="px-4 py-2">
                Отмена
              </Button>
            </DialogTrigger>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-[#4880FF] text-white hover:bg-blue-600 px-4 py-2 rounded-md"
            >
              {isSubmitting ? "Завершение..." : "Завершить рейс"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EndFlight;
