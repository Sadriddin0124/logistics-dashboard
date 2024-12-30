import { useForm, useFieldArray, FormProvider } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronLeftIcon, ChevronRightIcon, X } from "lucide-react";
import { useRouter } from "next/router";
import {
  createAutoDetail,
  deleteAutoDetail,
  fetchAutoDetails,
} from "@/lib/actions/cars.action";
import { queryClient } from "../ui-items/ReactQueryProvider";
import { toast } from "react-toastify";
import { useMutation, useQuery } from "@tanstack/react-query";
import { PaginatedCarDetail } from "@/lib/types/cars.types";
import { useEffect, useState } from "react";
import { Input } from "../ui/input";
import { removeCommas } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Skeleton } from "../ui/skeleton";
import CurrencyInputWithSelect from "../ui-items/currencySelect";
interface FormValues {
  id?: string;
  name: string;
  id_detail: string;
  in_sklad: boolean;
  price_uzs: number;
  price?: string;
}

export function AutoPartsForm() {
  const methods = useForm<{ parts: FormValues[] }>({
    defaultValues: {
      parts: [],
    },
  });

  const {
    control,
    handleSubmit,
    register,
    watch, // Watch for dynamic field changes
    formState: { errors },
  } = methods;

  const [deletePrice, setDeletePrice] = useState<string>("");
  const [deleteId, setDeleteId] = useState<string>("");
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [index, setIndex] = useState<number>(10);
  const [skeletonStatus, setSkeletonStatus] = useState(false)
  const router = useRouter();
  const { id } = router.query;
  const { data: carDetails } = useQuery<PaginatedCarDetail>({
    queryKey: ["car_details", currentPage, id],
    queryFn: () => fetchAutoDetails(currentPage, id as string),
  });
  useEffect(() => {
    queryClient.prefetchQuery({
      queryKey: ["car_details", currentPage + 1, id],
      queryFn: () => fetchAutoDetails(currentPage + 1, id as string),
    });
  }, [currentPage, id]);

  const { fields, append, remove, prepend } = useFieldArray({
    control,
    name: "parts",
    keyName: "_key",
  });

  useEffect(() => {
    if (carDetails?.results?.length) {
      const existingIds = methods.getValues("parts").map((part) => part.id);
      carDetails.results.forEach((detail) => {
        if (!existingIds.includes(detail.id)) {
          prepend({
            id: detail.id,
            name: detail.name,
            in_sklad: detail?.in_sklad,
            id_detail: detail.id_detail,
            price_uzs: detail.price_uzs,
            price: String(detail.price),
          });
        }
      });
    }
  }, [carDetails, prepend, methods]);

  const { mutate: createMutation } = useMutation({
    mutationFn: createAutoDetail,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["car_details"] });
      methods.reset();
      setTimeout(() => {
        setSkeletonStatus(false)
      }, 1000);
    },
    onError: () => {
      toast.error("Ошибка при сохранении!");
    },
  });

  const onSubmit = (data: { parts: FormValues[] }) => {
    const formData = data.parts.map((item) => ({
      ...item,
      price: Number(removeCommas(item?.price as string)),
      car: id as string,
    }));
    createMutation(formData);
    setSkeletonStatus(true)
  };

  const watchedFields = watch("parts");

  const isLastFieldValid = () => {
    const lastField = watchedFields?.[watchedFields.length - 1];
    return (
      lastField?.id_detail?.trim() &&
      lastField?.name?.trim() &&
      lastField?.price?.trim()
    );
  };
  const handleDelete = (item: FormValues, index: number) => {
    if (item?.id) {
      setDeleteOpen(true);
      setDeleteId(item?.id);
      setIndex(index);
    } else {
      remove(index);
    }
  };
  console.log(fields);
  const { mutate: deleteMutation } = useMutation({
    mutationFn: deleteAutoDetail,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["car_details", currentPage] });
      remove(index);
      toast.success("Утилизация завершена успешно!");
      setDeleteOpen(false);
    },
    onError: () => {
      toast.error("Ошибка при утилизации!");
    },
  });

  const onDelete = () => {
    const payload = {
      id: [deleteId],
      sell_price: Number(deletePrice),
    };
    deleteMutation(payload);
  };
  const itemsPerPage = 10;
  const indexOfLastOrder = currentPage * itemsPerPage;
  const indexOfFirstOrder = (currentPage - 1) * itemsPerPage;

  const totalPages = Math.ceil((carDetails?.count as number) / itemsPerPage);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const getPaginationButtons = () => {
    const buttons: (number | string)[] = [];
    if (totalPages <= 1) return buttons;
    buttons.push(1);
    if (currentPage > 3) {
      buttons.push("...");
    }
    for (
      let i = Math.max(2, currentPage - 1);
      i <= Math.min(totalPages - 1, currentPage + 1);
      i++
    ) {
      buttons.push(i);
    }
    if (currentPage < totalPages - 2) {
      buttons.push("...");
    }
    buttons.push(totalPages);
    return buttons;
  };
  const buttons = getPaginationButtons();

  return (
    <Card className="rounded-2xl">
      <CardHeader>
        <CardTitle>Запчасти для автомобиля</CardTitle>
      </CardHeader>
      <CardContent>
        {skeletonStatus ? (
          <div className="flex flex-col gap-[50px]">
            <div className="space-y-2">
              {Array((carDetails?.results?.length ?? 0) + 1)
                .fill(null) // Ensures each index has a value to avoid undefined elements
                .map((item, index) => {
                  return (
                    <div
                      key={index}
                      className="grid items-end grid-cols-10 gap-4 mb-4"
                    >
                      <div className=" col-span-3 space-y-2">
                        <Skeleton className="h-4 w-20" />
                        <Skeleton className="h-8 w-full" />
                      </div>
                      <div className=" col-span-3 space-y-2">
                        <Skeleton className="h-4 w-20" />
                        <Skeleton className="h-8 w-full" />
                      </div>
                      <div className=" col-span-3 space-y-2">
                        <Skeleton className="h-4 w-20" />
                        <Skeleton className="h-8 w-full" />
                      </div>
                      <div className=" col-span-1 space-y-2">
                        <Skeleton className="h-8 w-full" />
                      </div>
                    </div>
                  );
                })}
            </div>
            <div className="flex justify-end w-full gap-3">
              <Skeleton className="h-8 w-[250px]" />
              <Skeleton className="h-8 w-[200px]" />
            </div>
          </div>
        ) : (
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">
              {fields.map((item, index) => (
                <div key={item.id} className="flex items-start gap-4 mb-4">
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
                    <CurrencyInputWithSelect name={`parts.${index}.price`}/>
                    {/* <Input
                      {...register(`parts.${index}.price_uzs`)}
                      placeholder="Цена..."
                      onInput={(e) => {
                        const rawValue = e.currentTarget.value.replace(
                          /,/g,
                          ""
                        );

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
                    /> */}
                  </div>

                  <div className=" self-end">
                    <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
                      <Button
                        variant="ghost"
                        type="button"
                        onClick={() => handleDelete(item, index)}
                      >
                        <X />
                      </Button>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>
                            Введите цену, чтобы отключить машину
                          </DialogTitle>
                        </DialogHeader>
                        <div className="flex flex-col gap-4">
                          <div className="space-y-2">
                            <label
                              htmlFor="amount"
                              className="block text-sm font-medium"
                            >
                              Сумма
                            </label>
                            <Input
                              value={deletePrice}
                              onChange={(e) => setDeletePrice(e.target.value)}
                            />
                          </div>
                        </div>
                        <DialogFooter>
                          <DialogTrigger>
                            <Button variant={"outline"}>Назад</Button>
                          </DialogTrigger>
                          <Button
                            onClick={onDelete}
                            className="bg-blue-500 text-white hover:bg-blue-600 rounded-md"
                          >
                            Утилизировать
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
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
                      price_uzs: 0,
                      in_sklad: false,
                    });
                  }}
                >
                  Добавить новую запчасть
                </Button>
                <Button
                  type="submit"
                  className="bg-[#4880FF] text-white hover:bg-blue-600 w-[200px] rounded-md"
                  disabled={!isLastFieldValid()}
                >
                  Сохранять
                </Button>
              </div>
            </form>
          </FormProvider>
        )}
        <div className="mt-4 flex justify-between items-center">
          <div>
            Итого: {carDetails?.count || 0} с {indexOfFirstOrder + 1} до{" "}
            {Math.min(indexOfLastOrder, carDetails?.count as number) || 0}
          </div>
          <div className="flex space-x-2 items-center">
            <Button
              variant="outline"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="w-10 h-10 p-0"
            >
              <ChevronLeftIcon className="w-4 h-4" />
              <span className="sr-only">Предыдущая страница</span>
            </Button>
            {buttons.map((button, index) =>
              button === "..." ? (
                <span key={index} style={{ margin: "0 5px" }}>
                  ...
                </span>
              ) : (
                <Button
                  key={index}
                  onClick={() => handlePageChange(button as number)}
                  disabled={button === currentPage}
                  className={
                    button === currentPage
                      ? "bg-[#4880FF] text-white"
                      : "border"
                  }
                  variant={button === currentPage ? "default" : "ghost"}
                >
                  {button || ""}
                </Button>
              )
            )}
            <Button
              variant="outline"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="w-10 h-10 p-0"
            >
              <ChevronRightIcon className="w-4 h-4" />
              <span className="sr-only">Следующая страница</span>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
