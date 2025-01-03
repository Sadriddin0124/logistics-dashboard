import { useForm, FormProvider } from "react-hook-form";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "../ui/button";
import { useCallback, useEffect, useState } from "react";
import { Option } from "@/pages/warehouse/diesel";
import { IEmployee } from "@/lib/types/employee.types";
import { useMutation, useQuery } from "@tanstack/react-query";
import { fetchEmployeesAll, updateEmployeeBalance } from "@/lib/actions/employees.action";
import Select, { SingleValue } from "react-select";
import { Input } from "../ui/input";
import { createFinance } from "@/lib/actions/finance.action";
import { queryClient } from "../ui-items/ReactQueryProvider";
import { toast } from "react-toastify";
import { removeCommas } from "@/lib/utils";
import { useRouter } from "next/router";
import { Checkbox } from "../ui/checkbox";
import CurrencyInputWithSelect from "../ui-items/currencySelect";

export interface SalaryFormData {
  action: string;
  amount_uzs: number;
  amount: string | number;
  kind: string;
  flight: string;
  employee: string;
  car: string;
  balance: string;
  comment: string;
  reason: string;
  volume?: number;
  bonus: boolean;
}

export default function Salary() {
  const methods = useForm<SalaryFormData>();
  const {
    register,
    setValue,
    formState: { errors },
    reset,
    watch
  } = methods;
  const [driverOptions, setDriverOptions] = useState<Option[]>([]);
  const [selectedDriver, setSelectedDriver] = useState<Option | null>(null);
  const [balance, setBalance] = useState<number>(0);
  const { id } = useRouter()?.query
  const { data: employeeList } = useQuery<IEmployee[]>({
    queryKey: ["employees-all"],
    queryFn: fetchEmployeesAll,
  });
  const addBalance = useCallback(() => {
    const balance = employeeList?.find(
      (item) => item?.id === selectedDriver?.value
    );
    setBalance(Number(balance?.balance_uzs) || 0);
  }, [employeeList, selectedDriver, setBalance]);
  useEffect(() => {
    const driverOption = employeeList?.map((driver) => {
      return {
        label: driver?.full_name,
        value: driver?.id,
      };
    });
    setDriverOptions(driverOption as Option[]);
    addBalance()
  }, [employeeList, setValue, addBalance, selectedDriver]);

  const { mutate: createMutation } = useMutation({
    mutationFn: createFinance,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["finance"] });
      toast.success(" Сохранено успешно!");
      reset();
      setSelectedDriver(null)
    },
    onError: () => {
      toast.error("Ошибка сохранения!");
    },
  });
  const { mutate: changeMutation } = useMutation({
    mutationFn: updateEmployeeBalance,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["flights"] });
      reset();
    },
    onError: () => {
      toast.error("Ошибка при завершении рейса!");
    },
  });
  

  const onSubmit = (data: SalaryFormData) => {
    const formData = {
      ...data,
      action: "OUTCOME",
      amount: Number(removeCommas(data?.amount as string)),
      kind: id as string,
      car: "",
      flight: "",
      comment: data?.bonus ? `Бонус / ${data?.comment}` : data?.comment
    };
    createMutation(formData);
    changeMutation({ id: selectedDriver?.value as string, balance_usz: data?.bonus ? balance + data?.amount_uzs : balance - data?.amount_uzs });
  };

  const handleSelectDriver = (newValue: SingleValue<Option>) => {
    setSelectedDriver(newValue);
    setValue("employee", newValue?.value as string);
  };
  return (
    <div>
      <FormProvider {...methods}>
        <form
          onSubmit={methods.handleSubmit(onSubmit)}
          className="flex flex-col"
        >
          <h2 className="text-2xl font-semibold">Ежемесячно для водителя</h2>
          <div className="grid grid-cols-1 gap-4 mt-4">
            <div className=" grid grid-cols-2 gap-4">
              {/* <div className="space-y-2">
                <label className="text-sm font-medium">Причина*</label>
                <Input
                  {...register("reason", { required: true })}
                  placeholder="Введите причину..."
                />
              </div> */}

              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Выберите сотрудника.*
                </label>
                <Select
                  {...register("employee", { required: "Это значение является обязательным" })}
                  options={driverOptions}
                  value={selectedDriver}
                  onChange={handleSelectDriver}
                  placeholder={"Выберите сотрудника..."}
                  noOptionsMessage={() => "Не найдено"}
                />
                {errors?.employee && (
                  <p className="text-red-500">{errors?.employee?.message}</p>
                )}
              </div>
              <div className="space-y-2 flex flex-col">
                  <label>Предоставление бонуса</label>
                  <Checkbox
                    checked={watch("bonus")}
                    onCheckedChange={(checked) =>
                      setValue("bonus", checked as boolean)
                    }
                  />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Баланс водителя*</label>
                <Input readOnly value={balance} className="bg-muted" />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Введите сумму расхода.*
                </label>
                <CurrencyInputWithSelect name="amount" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Комментарий </label>
              <Textarea
                placeholder="Напишите комментарий..."
                className="min-h-[120px] resize-none"
                {...register("comment")}
              />
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
