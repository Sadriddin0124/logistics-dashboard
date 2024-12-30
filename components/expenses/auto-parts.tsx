import { useFieldArray, useFormContext } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "../ui/input";
import { Checkbox } from "../ui/checkbox";
import CurrencyInputWithSelect from "../ui-items/currencySelect";

export function AutoPartsExpense() {
  const { control, register, setValue, watch } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "parts",
  });

  const watchedFields = watch("parts");

  const isLastFieldValid = () => {
    const lastField = watchedFields?.[watchedFields.length - 1];
    return (
      lastField?.name?.trim() &&
      lastField?.id_detail?.trim()
    );
  };
  console.log(fields.length);

  return (
    <div className="mt-6 space-y-6">
      <h2 className="text-2xl font-semibold">Запчасти для автомобиля</h2>

      {fields.map((item, index) => (
        <div key={item.id} className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label>Название запчасти</label>
            <Input
              {...register(`parts.${index}.name`, { required: true })}
              placeholder="Введите название запчасти"
            />
          </div>
          <div className="space-y-2">
            <label>ID запчасти</label>
            <Input
              {...register(`parts.${index}.id_detail`, { required: false })}
              placeholder="Введите ID запчасти"
            />
          </div>
          <div className="space-y-2">
            <label>Цена</label>
            <CurrencyInputWithSelect name="price"
            />
          </div>
          <div className="flex justify-between w-full">
            <div className="space-y-2 flex flex-col">
              <label>Подтвердить</label>
              <Checkbox
                checked={watch(`parts.${index}.in_sklad`)}
                onCheckedChange={(checked) =>
                  setValue(`parts.${index}.in_sklad`, checked)
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
        disabled={!isLastFieldValid()}
      >
        Добавить запчасть
      </Button>
    </div>
  );
}
