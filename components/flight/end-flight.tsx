import { toast } from "react-toastify";
import { queryClient } from "../ui-items/ReactQueryProvider";
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog";
import { closeFlight } from "@/lib/actions/flight.action";
import { useMutation } from "@tanstack/react-query";
import { Button } from "../ui/button";
import React, { Dispatch, SetStateAction, useEffect } from "react";
import { useRouter } from "next/router";
import { useForm, Controller, FormProvider } from "react-hook-form";
import { Input } from "../ui/input";
import { IEmployee } from "@/lib/types/employee.types";
import { ICars } from "@/lib/types/cars.types";
import { updateCarDistance } from "@/lib/actions/cars.action";
import CurrencyInputWithSelect from "../ui-items/currencySelect";
import { IFlightData } from "@/lib/types/flight.types";

interface EndFlightProps {
  flight: IFlightData
  id: string;
  driver: IEmployee;
  balance: number;
  car: ICars;
  expense: number;
  expenses_cook: number;
  arrival_date: string;
  setArrivalStatus: Dispatch<SetStateAction<string>>;
}

interface EndFlightForm {
  endKm: number;
  balance: number;
  balance_uzs: number;
  balance_type: string;
}

const EndFlight: React.FC<EndFlightProps> = ({
  // id,
  // driver,
  balance,
  car,
  expense,
  arrival_date,
  // expenses_cook,
  setArrivalStatus,
  flight
}) => {
  const [open, setOpen] = React.useState(false);
  const { push } = useRouter();

  const methods = useForm<EndFlightForm>({
    defaultValues: {
      endKm: 0,
      balance: 0,
    },
  });
  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = methods;

  useEffect(() => {
    setValue("balance", balance);
    setValue("endKm", car?.distance_travelled);
  }, [setValue, balance, car?.distance_travelled, expense]);

  const { mutate: updateMutation } = useMutation({
    mutationFn: closeFlight,
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
  // const { mutate: changeMutation } = useMutation({
  //   mutationFn: updateEmployeeBalance,
  //   onSuccess: () => {
  //     queryClient.invalidateQueries({ queryKey: ["employees-all"] });
  //   },
  //   onError: () => {
  //     toast.error("Ошибка при завершении рейса!");
  //   },
  // });
  const { mutate: updateCarMutation } = useMutation({
    mutationFn: updateCarDistance,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["flight-one"] });
      toast.success(" Сохранено успешно!");
    },
    onError: () => {
      toast.error("Ошибка сохранения!");
    },
  });
  // const { mutate: createMutation } = useMutation({
  //   mutationFn: createFinance,
  //   onSuccess: () => {
  //     queryClient.invalidateQueries({ queryKey: ["finance"] });
  //     reset();
  //   },
  //   onError: () => {
  //     toast.error("Ошибка сохранения!");
  //   },
  // });

  const onSubmit = (data: EndFlightForm) => {
    updateMutation({
      ...flight,
      status: "INACTIVE"
    });
    // changeMutation({
    //   id: driver?.id as string,
    //   balance_usz: Number(driver?.balance_uzs) + expense + expenses_cook,
    //   // balance: (Number(driver?.balance_uzs) + expense + expenses_cook)
    // });
    updateCarMutation({
      id: car?.id as string,
      distance_travelled: data?.endKm,
    });
    // const formData = {
    //   action: "OUTCOME",
    //   kind: "PAY_SALARY",
    //   car: "",
    //   flight: id,
    //   amount_uzs: data?.balance_uzs,
    //   employee: driver?.id,
    //   comment: `${driver?.full_name} заплатил за рейс ${data?.balance_uzs} ${data?.balance_type}`,
    // };
    // const formData2 = {
    //   action: "OUTCOME",
    //   kind: "PAY_SALARY",
    //   car: "",
    //   flight: id,
    //   amount_uzs: expenses_cook,
    //   employee: driver?.id,
    //   comment: `Расход на питание ${expenses_cook}`,
    // };
    // const formData3 = {
    //   action: "OUTCOME",
    //   kind: "PAY_SALARY",
    //   car: "",
    //   flight: id,
    //   amount_uzs: expense,
    //   employee: driver?.id,
    //   comment: `Расходы водителя ${expense}`,
    // };
    // createMutation(formData);
    // createMutation(formData2);
    // createMutation(formData3);
    reset();
  };

  const handleOpen = () => {
    if (arrival_date) {
      setOpen(true);
      setArrivalStatus("");
    } else {
      setArrivalStatus("Введите дату прибытия");
    }
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Button
        onClick={handleOpen}
        className="bg-[#4880FF] text-white hover:bg-blue-600 w-[250px] rounded-md"
      >
        Завершить рейс
      </Button>
      <DialogContent className="space-y-4 p-6">
        <h3 className="text-lg font-medium">
          Вы уверены, что хотите завершить рейс?
        </h3>
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Введите текущий пробег*
              </label>
              <Controller
                name="endKm"
                control={control}
                rules={{
                  required: "Текущий пробег обязателен",
                  validate: (value) =>
                    value < car?.distance_travelled
                      ? `Расстояние должно быть больше ${car?.distance_travelled}`
                      : true,
                }}
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
              <CurrencyInputWithSelect name="balance" />
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
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
};

export default EndFlight;
