import { useForm, FormProvider } from "react-hook-form";
import { Textarea } from "@/components/ui/textarea";
import { CurrencyInputs } from "../ui-items/currency-inputs";
import { Button } from "../ui/button";
import { useEffect, useState } from "react";
import { Option } from "@/pages/warehouse/diesel";
import { useMutation, useQuery } from "@tanstack/react-query";
import { ICars } from "@/lib/types/cars.types";
import { fetchCarNoPage, updateCarLeasing } from "@/lib/actions/cars.action";
import Select, { SingleValue } from "react-select";
import { createFinance } from "@/lib/actions/finance.action";
import { queryClient } from "../ui-items/ReactQueryProvider";
import { toast } from "react-toastify";
import { removeCommas } from "@/lib/utils";
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

export default function LeasingForm() {
  const methods = useForm<FormValues>({
    defaultValues: {
      car: "",
      amount_uzs: "",
      comment: "",
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
  const [carAmount, setCarAmount] = useState(0)
  const { id } = useRouter()?.query;
  const { data: cars } = useQuery<ICars[]>({
    queryKey: ["cars"],
    queryFn: fetchCarNoPage,
  });

  useEffect(() => {
    const carOption = cars?.filter(item=> item?.type_of_payment === "LEASING")?.map((car) => ({
      label: `${car?.name} ${car?.number}`,
      value: car?.id,
    }));
    setCarOptions(carOption as Option[]);
    const amount = cars?.find(item=> item?.id === selectedCar?.value)?.leasing_payed_amount
    setCarAmount(amount as number)
  }, [cars, selectedCar]);

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

  const { mutate: updateMutation } = useMutation({
    mutationFn: updateCarLeasing,
    onError: () => {
      toast.error("ni qo'shishda xatolik!");
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
    console.log(formData);

    createFinanceMutation(formData);
    const item = {id: selectedCar?.value as string, leasing_payed_amount: Number(removeCommas(data?.amount_uzs)) + carAmount}
    console.log(item);
    
    updateMutation({id: selectedCar?.value as string, leasing_payed_amount: Number(removeCommas(data?.amount_uzs)) + carAmount})
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
                noOptionsMessage={() => "Не найдено"}
              />
              {errors.car && (
                <p className="text-red-500">{errors.car?.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Введите сумму на car*
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
