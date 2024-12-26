import { useForm, FormProvider } from "react-hook-form";
import { Textarea } from "@/components/ui/textarea";
import { CurrencyInputs } from "../ui-items/currency-inputs";
import { Button } from "../ui/button";
import { useEffect, useState } from "react";
import { Option } from "@/pages/warehouse/diesel";
import { useMutation, useQuery } from "@tanstack/react-query";
import { ICars } from "@/lib/types/cars.types";
import { createAutoDetail, fetchCarNoPage } from "@/lib/actions/cars.action";
import Select, { SingleValue } from "react-select";
import { createFinance } from "@/lib/actions/finance.action";
import { queryClient } from "../ui-items/ReactQueryProvider";
import { toast } from "react-toastify";
import { removeCommas } from "@/lib/utils";
import { AutoPartsExpense } from "./auto-parts";
import { useRouter } from "next/router";

interface FormValues {
  car?: string;
  amount_uzs: string;
  comment?: string;
  parts: {
    name: string;
    id_detail: string;
    price_uzs: string;
    in_sklad: boolean;
  }[];
}

export default function RepairingForm() {
  const methods = useForm<FormValues>({
    defaultValues: {
      car: "",
      amount_uzs: "",
      comment: "",
      parts: [
        {
          name: "",
          id_detail: "",
          price_uzs: "",
          in_sklad: false,
        },
      ],
    },
  });

  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors },
  } = methods;

  const [carOptions, setCarOptions] = useState<Option[]>([]);
  const [selectedCar, setSelectedCar] = useState<Option | null>(null);
  const { id } = useRouter()?.query;
  const { data: cars } = useQuery<ICars[]>({
    queryKey: ["cars"],
    queryFn: fetchCarNoPage,
  });

  useEffect(() => {
    const carOption = cars?.map((car) => ({
      label: `${car?.name} ${car?.number}`,
      value: car?.id,
    }));
    setCarOptions(carOption as Option[]);
  }, [cars]);

  const { mutate: createFinanceMutation } = useMutation({
    mutationFn: createFinance,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["finance"] });
      toast.success("Данные успешно добавлены!");
      methods.reset();
      setSelectedCar(null);
    },
    onError: () => {
      toast.error("Ошибка при добавлении данных!");
    },
  });

  const handleSelectCar = (newValue: SingleValue<Option>) => {
    setSelectedCar(newValue);
    setValue("car", newValue?.value as string);
  };

  const { mutate: createMutation } = useMutation({
    mutationFn: createAutoDetail,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["car_details"] });
      methods.reset();
    },
    onError: () => {
      toast.error("Ошибка при сохранении!");
    },
  });
  const onSubmit = (data: FormValues) => {
    const formData = {
      car: data?.car,
      action: "OUTCOME",
      amount_uzs: Number(removeCommas(data?.amount_uzs)),
      flight: "",
      employee: "",
      kind: id as string,
    };
    console.log(data);
    const formData2 = data.parts.map((item) => ({
      ...item,
      price_uzs: Number(removeCommas(item?.price_uzs)),
      car: data?.car as string,
    }));
    console.log(formData);
    console.log(formData2);

    createMutation(formData2);
    createFinanceMutation(formData);
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <h2 className="text-2xl font-semibold">Ремонт автомобиля.</h2>
        <div className="grid grid-cols-1 gap-4 mt-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Выберите автомобиль*
              </label>
              <Select
                options={carOptions}
                value={selectedCar}
                onChange={handleSelectCar}
                placeholder="Выберите..."
                noOptionsMessage={() => "Type to add new option..."}
              />
              {errors.car && (
                <p className="text-red-500">{errors.car?.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Введите сумму на ремонт*
              </label>
              <CurrencyInputs name="amount" />
            </div>
            <div className="space-y-2 col-span-2">
              <label className="text-sm font-medium">
                Комментарий о ремонте
              </label>
              <Textarea
                placeholder="Напишите комментарий..."
                className="min-h-[120px] resize-none"
                {...register("comment")}
              />
            </div>
          </div>
          <AutoPartsExpense />
          <div className="flex justify-end">
            <Button
              type="submit"
              className="bg-[#4880FF] text-white hover:bg-blue-600 w-[300px] rounded-md"
            >
              Добавить
            </Button>
          </div>
        </div>
      </form>
    </FormProvider>
  );
}
