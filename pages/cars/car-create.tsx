"use client";

import { useForm, SubmitHandler, FormProvider } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Select as Selector,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import Select, { SingleValue } from "react-select";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  createCar,
  createModel,
  fetchAllModels,
} from "@/lib/actions/cars.action";
import { toast } from "react-toastify";
import { queryClient } from "@/components/ui-items/ReactQueryProvider";
import { removeCommas } from "@/lib/utils";
import { useEffect, useState } from "react";
import { Option } from "../warehouse/diesel";
import { IModel } from "@/lib/types/cars.types";
import { useRouter } from "next/router";
import CurrencyInputWithSelect from "@/components/ui-items/currencySelect";
// import { Checkbox } from "@/components/ui/checkbox";

interface FormValues {
  name: string;
  model: string;
  number: string;
  with_trailer: string | boolean;
  trailer_number?: null | string;
  type_of_payment: string;
  leasing_period: string;
  fuel_type: string;
  price: string;
  price_uzs: string;
  distance_travelled: string;
  created_at: string;
  income_status: boolean;
}

export default function VehicleForm() {
  const methods = useForm<FormValues>({
    defaultValues: {
      with_trailer: "false",
      type_of_payment: "CASH",
    },
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = methods;
  const [modelOptions, setModelOptions] = useState<Option[]>([]);
  const [selectedModel, setSelectedModel] = useState<Option | null>(null);
  const [model, setModel] = useState<string>("");
  const [status, setStatus] = useState(true);
  const type_of_payment = watch("type_of_payment");
  const { push } = useRouter();
  const { data: models } = useQuery<IModel[]>({
    queryKey: ["models_all"],
    queryFn: () => fetchAllModels(),
  });
  useEffect(() => {
    const modelOptions = models?.map((model) => {
      return {
        label: model?.name,
        value: model?.id,
      };
    });
    setModelOptions(modelOptions as Option[]);
  }, [models, setValue]);

  const { mutate: createMutation } = useMutation({
    mutationFn: createCar,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["cars"] });
      push(`/cars/car-info?id=${data?.id}`);
      toast.success(" Сохранено успешно!");
    },
    onError: () => {
      toast.error("Ошибка сохранения!");
    },
  });


  const onSubmit: SubmitHandler<FormValues> = (data) => {
    const created_at = data?.created_at ? { created_at: data.created_at } : {};
    if (data.created_at === "") {
      delete (data as { created_at?: string }).created_at;
    }
    const formData = {
      ...created_at,
      ...data,
      with_trailer: data?.with_trailer === "false" ? false : true,
      type_of_payment: data?.type_of_payment || "CASH",
      leasing_period: Number(data?.leasing_period),
      distance_travelled: Number(data?.distance_travelled),
      price: Number(removeCommas(data?.price)),
    };
    
    createMutation({ ...formData, model: selectedModel?.value as string });
    reset();
  };

  const with_trailer = watch("with_trailer");

  const handleSelectModel = (newValue: SingleValue<Option>) => {
    setSelectedModel(newValue);
    setValue("model", newValue?.value as string);
  };
  const { mutate: createModelMutation } = useMutation({
    mutationFn: createModel,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["models_all"] });
      setSelectedModel({ label: data?.name, value: data?.id });
      setValue("model", data?.id);
    },
  });
  const handleAddModel = () => {
    if (model && status) {
      createModelMutation({ name: model });
    }
  };
  const enterModel = (event: React.KeyboardEvent) => {
    setStatus(false);
    if (event?.key === "Enter") {
      createModelMutation({ name: model });
    }
  };

  return (
    <div>
      <div className="p-10 mx-auto container mt-8 bg-white rounded-2xl">
        <div className="w-full ">
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Название автомобиля*
                  </label>
                  <Input
                    id="name"
                    {...register("name", {
                      required:
                        "Название автомобиля должно содержать минимум 2 символа",
                      minLength: {
                        value: 2,
                        message:
                          "Название автомобиля должно содержать минимум 2 символа",
                      },
                    })}
                    placeholder="Название автомобиля..."
                    className="mt-1"
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.name.message}
                    </p>
                  )}
                </div>

                <div className="space-y-1">
                  <label
                    htmlFor="model"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Марка автомобиля*
                  </label>
                  <Select
                    {...register("model", {
                      required: "Введите марку автомобиля",
                    })}
                    options={modelOptions}
                    value={selectedModel}
                    onChange={handleSelectModel}
                    onBlur={handleAddModel}
                    onInputChange={(value) => setModel(value)}
                    onKeyDown={enterModel}
                    placeholder="Марка автомобиля"
                    noOptionsMessage={() => "Не найдено"}
                    isClearable
                  />
                  {errors.model && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.model.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <label
                    htmlFor="number"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Государственный номер автомобиля*
                  </label>
                  <Input
                    id="number"
                    {...register("number", {
                      required: "Введите государственный номер автомобиля",
                    })}
                    placeholder="Введите номер"
                    className="mt-1"
                    onChange={(e) => {
                      const value = e.target.value;
                      setValue("number", value.toUpperCase());
                    }}
                  />
                  {errors.number && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.number.message}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="with_trailer"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Есть ли прецепта*
                  </label>
                  <Selector
                    {...register("with_trailer", {
                      required: false,
                      // "Поле обязательно для выбора",
                    })} // Set required validation here
                    defaultValue="false"
                    onValueChange={(value) => setValue("with_trailer", value)}
                  >
                    <SelectTrigger id="with_trailer" className="mt-1">
                      <SelectValue placeholder="Есть ли прецепта" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="true">Да</SelectItem>
                      <SelectItem value="false">Нет</SelectItem>
                    </SelectContent>
                  </Selector>
                  {errors.with_trailer && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.with_trailer.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <label
                    htmlFor="trailer_number"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Государственный номер прецепта*
                  </label>
                  <Input
                    disabled={with_trailer === "false" ? true : false}
                    id="trailer_number"
                    {...register("trailer_number", {
                      required:
                        with_trailer === "true"
                          ? "Это значение является обязательным"
                          : false,
                    })}
                    placeholder="Введите номер"
                    className="mt-1"
                    onChange={(e) => {
                      const value = e.target.value;
                      setValue("trailer_number", value.toUpperCase());
                    }}
                  />
                  {errors.trailer_number && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.trailer_number.message}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="fuel_type"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Тип топлива*
                  </label>
                  <Selector
                    {...register("fuel_type", {
                      required: "Тип топлива обязательный", // Optionally set it as required
                    })}
                    onValueChange={(value) => setValue("fuel_type", value)} // Ensure that the form state is updated when the value changes
                  >
                    <SelectTrigger id="fuel_type" className="mt-1">
                      <SelectValue placeholder="Выберите тип топлива" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="GAS">Газ</SelectItem>
                      <SelectItem value="DIESEL">Салярка</SelectItem>
                    </SelectContent>
                  </Selector>
                  {errors.fuel_type && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.fuel_type.message}
                    </p>
                  )}
                </div>
              </div>
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <label
                    htmlFor="type_of_payment"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Тип оплаты*
                  </label>
                  <Selector
                    {...register("type_of_payment", {
                      // required: "Тип оплаты обязателен",
                    })} // Set required validation here
                    onValueChange={(value) =>
                      setValue("type_of_payment", value)
                    }
                    defaultValue="CASH"
                  >
                    <SelectTrigger id="type_of_payment" className="mt-1">
                      <SelectValue placeholder="Лизинг" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="LEASING">Лизинг</SelectItem>
                      <SelectItem value="CASH">Наличные</SelectItem>
                    </SelectContent>
                  </Selector>
                  {errors.type_of_payment && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.type_of_payment.message}
                    </p>
                  )}
                </div>

                <div className="space-y-1">
                  <label
                    htmlFor="price"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Введите цену автомобиля*
                  </label>
                  {/* <CurrencyInputs name="price" /> */}
                  <CurrencyInputWithSelect name="price" />
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <label
                    htmlFor="leasing_period"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Введите срок лизинга*(в месяцах)
                  </label>
                  <Input
                    id="leasing_period"
                    {...register("leasing_period", {
                      required:
                        watch("type_of_payment") === "LEASING"
                          ? "Это значение является обязательным"
                          : false,
                    })}
                    type="number"
                    placeholder="Введите срок..."
                    className="mt-1"
                    disabled={type_of_payment === "CASH" ? true : false}
                  />
                  {errors.leasing_period && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.leasing_period.message}
                    </p>
                  )}
                </div>
                <div>
                  <label
                    htmlFor="leasing_period"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Введите пробег автомобиля (в км)*
                  </label>
                  <Input
                    id="distance_travelled"
                    {...register("distance_travelled", {
                      required: "Введите пробег автомобиля",
                    })}
                    type="number"
                    placeholder="Введите пробег автомобиля (в км)..."
                    className="mt-1"
                  />
                  {errors.distance_travelled && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.distance_travelled.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="text-sm">Дата создания</label>
                  <Input type="date" {...register("created_at")} />
                </div>
              </div>

              <div className="w-full flex justify-end">
                {/* <div className="space-y-2 flex items-center gap-3">
                  <Checkbox
                    checked={watch("income_status")}
                    onCheckedChange={(checked) =>
                      setValue("income_status", checked as boolean)
                    }
                  />
                  <label>Добавить на склад</label>
                </div> */}
                <Button
                  type="submit"
                  className="bg-[#4880FF] text-white hover:bg-blue-600 w-[250px] rounded-md"
                >
                  Добавить
                </Button>
              </div>
            </form>
          </FormProvider>
        </div>
      </div>
    </div>
  );
}
