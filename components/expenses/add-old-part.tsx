import { useForm, useFieldArray, FormProvider } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/router";
import { createAutoDetail } from "@/lib/actions/cars.action";
import { queryClient } from "../ui-items/ReactQueryProvider";
import { toast } from "react-toastify";
import { useMutation } from "@tanstack/react-query";
import { Input } from "../ui/input";
import { removeCommas } from "@/lib/utils";
import { formatNumberWithCommas } from "../ui-items/currency-inputs";
import { Checkbox } from "../ui/checkbox";
interface FormValues {
  id?: string;
  name: string;
  id_detail: string;
  price_uzs: string;
  in_sklad: boolean;
}

export function OldPartsForm() {
  const methods = useForm<{ parts: FormValues[] }>({
    defaultValues: {
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
    control,
    handleSubmit,
    register,
    setValue,
    watch, // Watch for dynamic field changes
    formState: { errors },
  } = methods;

  const router = useRouter();
  const { id } = router.query;

  const { fields, append, remove } = useFieldArray({
    control,
    name: "parts",
    keyName: "_key",
  });

  const { mutate: createMutation } = useMutation({
    mutationFn: createAutoDetail,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["car_details"] });
      methods.reset();
      toast.success("Утилизация завершена успешно!");
    },
    onError: () => {
      toast.error("Ошибка при утилизации!");
    },

  });

  const onSubmit = (data: { parts: FormValues[] }) => {
    const formData = data.parts.map((item) => ({
      ...item,
      price_uzs: Number(removeCommas(item?.price_uzs)),
      car: id as string,
    }));
    console.log(data?.parts);

    createMutation(formData);
  };

  const watchedFields = watch("parts");

  const isLastFieldValid = () => {
    const lastField = watchedFields?.[watchedFields.length - 1];
    return (
      lastField?.id_detail?.trim() &&
      lastField?.name?.trim() &&
      lastField?.price_uzs?.trim()
    );
  };

  return (
    <Card className="rounded-2xl">
      <CardHeader>
        <CardTitle className="text-2xl">Старые запчасти для автомобиля</CardTitle>
      </CardHeader>
      <CardContent>
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">
            {fields.map((item, index) => (
              <div key={item.id} className="grid grid-cols-2 gap-4 mb-4">
                <div className="flex-1">
                  <label className="text-sm mb-2 block">
                    Название запчасти
                  </label>
                  <Input
                    {...register(`parts.${index}.name`, { required: true })}
                    defaultValue={item.name}
                    placeholder="Введите название запчасти..."
                  />
                  {errors.parts?.[index]?.name && (
                    <span className="text-red-500 text-xs">
                      Поле обязательно для заполнения
                    </span>
                  )}
                </div>
                <div className="flex-1 relative">
                  <label className="text-sm mb-2 block">ID запчасти</label>
                  <Input
                    {...register(`parts.${index}.id_detail`)}
                    defaultValue={item.id_detail}
                    placeholder="Введите ID запчасти..."
                  />
                </div>
                <div className="flex-1">
                  <label className="text-sm mb-2 block">Цена</label>
                  <Input
                    {...register(`parts.${index}.price_uzs`)}
                    placeholder="Цена..."
                    onInput={(e) => {
                      const rawValue = e.currentTarget.value.replace(/,/g, "");

                      if (rawValue === "0") {
                        // If the user types 0, allow it without formatting
                        e.currentTarget.value = "0";
                      } else {
                        const parsedValue = parseFloat(rawValue);
                        // Apply formatting if it's not 0
                        e.currentTarget.value =
                          formatNumberWithCommas(parsedValue);
                      }
                    }}
                  />
                </div>
                <div className="flex justify-between">
                  <div className="space-y-2 flex flex-col">
                    <label>Утилизировать</label>
                    <Checkbox
                      checked={watch(`parts.${index}.in_sklad`)}
                      onCheckedChange={(checked) =>
                        setValue(`parts.${index}.in_sklad`, checked as boolean)
                      }
                    />
                  </div>
                  <div className="space-y-2 flex flex-col">
                    <label>Удалить</label>
                    <Checkbox
                      checked={!watch(`parts.${index}.in_sklad`)}
                      onCheckedChange={(checked) =>
                        setValue(`parts.${index}.in_sklad`, !checked as boolean)
                      }
                    />
                  </div>
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
            <div className="flex gap-2 w-full justify-end mt-9">
              <Button
                type="button"
                className="bg-[#4880FF] text-white hover:bg-blue-600 w-[250px] rounded-md"
                onClick={() => {
                  append({
                    name: "",
                    id_detail: "",
                    price_uzs: "",
                    in_sklad: false,
                  });
                }}
                disabled={!isLastFieldValid()} // Disable based on last field validation
              >
                Добавить новую запчасть
              </Button>
              <Button
                type="submit"
                className="bg-[#4880FF] text-white hover:bg-blue-600 w-[200px] rounded-md"
              >
                Сохранять
              </Button>
            </div>
          </form>
        </FormProvider>
      </CardContent>
    </Card>
  );
}
