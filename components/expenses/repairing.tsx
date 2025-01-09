import { useForm, FormProvider, useFieldArray } from "react-hook-form";
import { Textarea } from "@/components/ui/textarea";
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
import { useRouter } from "next/router";
import CurrencyInputWithSelect from "../ui-items/currencySelect";
import { Input } from "../ui/input";
import { Checkbox } from "../ui/checkbox";

interface FormValues {
  car?: string;
  amount_uzs: string;
  amount: string;
  comment?: string;
  created_at: string;
  parts: {
    name: string;
    id_detail: string;
    price_uzs: number;
    price: string;
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
          price_uzs: 0,
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
    control,
    watch,
  } = methods;
  const { fields, append, remove } = useFieldArray({
    control,
    name: "parts",
  });
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
    const created_at = data?.created_at ? { created_at: data.created_at } : {};
    if (data.created_at === "") {
      delete (data as { created_at?: string }).created_at;
    }
    const formData = {
      ...created_at,
      car: data?.car,
      action: "OUTCOME",
      amount: Number(removeCommas(data?.amount)),
      flight: "",
      employee: "",
      kind: id as string,
    };
    const formData2 = data.parts.map((item) => ({
      ...item,
      price: Number(removeCommas(item?.price)),
      car: data?.car as string,
    }));

    createMutation(formData2);
    createFinanceMutation(formData);
    methods.reset();
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
                Введите сумму на ремонт*
              </label>
              <CurrencyInputWithSelect name="amount" />
            </div>
            <div className="space-y-2">
              <label className="text-sm">Дата создания</label>
              <Input type="date" {...register("created_at")} />
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
          <div className="mt-6 space-y-6">
            <h2 className="text-2xl font-semibold">Запчасти для автомобиля</h2>

            {fields.map((item, index) => (
              <div key={item.id} className="grid grid-cols-2 gap-4">
                {/* Part Name */}
                <div className="space-y-2">
                  <label>Название запчасти</label>
                  <Input
                    {...register(`parts.${index}.name`, {
                      required: "Введите название",
                    })}
                    placeholder="Введите название запчасти"
                  />
                  {errors.parts?.[index]?.name && (
                    <p className="text-red-500">
                      {errors.parts[index].name.message}
                    </p>
                  )}
                </div>

                {/* Part ID */}
                <div className="space-y-2">
                  <label>ID запчасти</label>
                  <Input
                    {...register(`parts.${index}.id_detail`)}
                    placeholder="Введите ID запчасти"
                  />
                </div>

                {/* Price */}
                <div className="space-y-2">
                  <label>Цена</label>
                  <CurrencyInputWithSelect name={`parts.${index}.price`} />
                  {errors.parts?.[index]?.price && (
                    <p className="text-red-500">
                      {errors.parts[index].price.message}
                    </p>
                  )}
                </div>

                {/* Confirm Checkbox */}
                <div className="flex justify-between w-full">
                  <div className="space-y-2 flex flex-col">
                    <label>Подтвердить</label>
                    <Checkbox
                      checked={watch(`parts.${index}.in_sklad`) || false}
                      onCheckedChange={(checked) =>
                        setValue(`parts.${index}.in_sklad`, checked as boolean)
                      }
                    />
                  </div>

                  {/* Remove Button */}
                  <Button
                    disabled={fields.length <= 1}
                    variant="ghost"
                    type="button"
                    className="self-end"
                    onClick={() => remove(index)}
                  >
                    Удалить
                  </Button>
                </div>
              </div>
            ))}

            {/* Add Part Button */}
            <Button
              type="button"
              className="bg-[#4880FF] text-white hover:bg-blue-600"
              onClick={() =>
                append({
                  name: "",
                  id_detail: "",
                  price_uzs: 0,
                  price: "",
                  in_sklad: false,
                })
              }
            >
              Добавить запчасть
            </Button>
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
