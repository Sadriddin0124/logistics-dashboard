import { useForm, FormProvider } from "react-hook-form";
import { Textarea } from "@/components/ui/textarea";
import { useMutation } from "@tanstack/react-query";
import { createFinance } from "@/lib/actions/finance.action";
import { toast } from "react-toastify";
import { removeCommas } from "@/lib/utils";
import { queryClient } from "@/components/ui-items/ReactQueryProvider";
import { CurrencyInputs } from "@/components/ui-items/currency-inputs";
import { Button } from "@/components/ui/button";
import { Input } from "../ui/input";
import { useRouter } from "next/router";

interface PartsFormData {
  action: string;
  amount_uzs: string;
  amount_usd: string;
  kind: string;
  flight: string;
  driver: string;
  car: string;
  balance: string;
  comment: string;
  reason: string;
}

export default function OtherExpenseForm() {
  const methods = useForm<PartsFormData>();
  const {
    register,
    formState: { errors },
  } = methods;
  const { id } = useRouter()?.query;
  const { mutate: createMutation } = useMutation({
    mutationFn: createFinance,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["finance"] });
      toast.success(" muvaffaqiyatli qo'shildi!");
    },
    onError: () => {
      toast.error("ni qo'shishda xatolik!");
    },
  });

  const onSubmit = (data: PartsFormData) => {
    const formData = {
      ...data,
      action: "OUTCOME",
      amount_uzs: Number(removeCommas(data?.amount_uzs)),
      // amount_usd: Number(removeCommas(data?.amount_usd)),
      car: "",
      kind: id as string,
      flight: "",
      employee: "",
    };
    createMutation(formData);
  };

  return (
    <div className="bg-white">
      <FormProvider {...methods}>
        <form
          onSubmit={methods.handleSubmit(onSubmit)}
          className="flex flex-col"
        >
          <h2 className="text-2xl font-semibold">Прочие расходы</h2>
          <div className="grid grid-cols-1 gap-4 mt-4">
            <div className=" grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Причина*</label>
                <Input
                  {...register("reason", { required: true })}
                  placeholder="Введите причину..."
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Введите сумму расхода.*
                </label>
                <CurrencyInputs name="amount" />
              </div>
              {errors?.amount_usd && (
                <p className="text-red-500">{errors?.amount_usd?.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">
                Комментарий о ремонте
              </label>
              <Textarea
                placeholder="Напишите комментарий..."
                className="min-h-[120px] resize-none"
                {...register("comment")}
              />
              {errors?.comment && (
                <p className="text-red-500">{errors?.comment?.message}</p>
              )}
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
