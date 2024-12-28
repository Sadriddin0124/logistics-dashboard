"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { useRouter } from "next/router";
import { FormProvider, useForm } from "react-hook-form";
import { Option } from "../diesel";
import { useMutation, useQuery } from "@tanstack/react-query";
import { fetchCarNoPage } from "@/lib/actions/cars.action";
import Select, { SingleValue } from "react-select";
import { ICars } from "@/lib/types/cars.types";
import { queryClient } from "@/components/ui-items/ReactQueryProvider";
import { toast } from "react-toastify";
import {
  createAnotherStation,
  fetchAnotherStation,
} from "@/lib/actions/gas.action";
import {
  AnotherStation,
  AnotherStationListResponse,
} from "@/lib/types/gas_station.types";
import { removeCommas } from "@/lib/utils";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { formatDate } from "@/lib/functions";
import CurrencyInputWithSelect from "@/components/ui-items/currencySelect";

export default function GasManagementForm() {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const methods = useForm<AnotherStation>();
  const { register, handleSubmit, setValue, reset } = methods;
  const { data: carsList } = useQuery<ICars[]>({
    queryKey: ["cars_no_page"],
    queryFn: fetchCarNoPage,
  });
  const { data: stationList } = useQuery<AnotherStationListResponse>({
    queryKey: ["another-stations", currentPage],
    queryFn: () => fetchAnotherStation(currentPage),
  });
  const [carOptions, setCarOptions] = useState<Option[]>([]);
  const [selectedCar, setSelectedCar] = useState<Option | null>(null);
  useEffect(() => {
    queryClient.prefetchQuery({
      queryKey: ["another-stations", currentPage],
      queryFn: () => fetchAnotherStation(currentPage + 1),
    });
  }, [currentPage]);

  const itemsPerPage = 10;
  const indexOfLastOrder = currentPage * itemsPerPage;
  const indexOfFirstOrder = (currentPage - 1) * itemsPerPage;

  const totalPages = Math.ceil((stationList?.count as number) / itemsPerPage);

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

  useEffect(() => {
    const carOptions = carsList
      ?.filter((car) => car?.fuel_type === "GAS")
      ?.map((car) => {
        return {
          label: `${car?.name} ${car?.number}`,
          value: car?.id as string,
        };
      }) as Option[];
    setCarOptions(carOptions);
  }, [carsList]);
  const { id } = useRouter().query;
  const { mutate: createMutation } = useMutation({
    mutationFn: createAnotherStation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["another-stations", currentPage] });
      toast.success(" Сохранено успешно!");
      reset()
      setSelectedCar(null)
    },
    onError: () => {
      toast.error("Ошибка сохранения!");
    },
  });
  const onSubmit = (data: AnotherStation) => {
    createMutation({
      ...data,
      payed_price_uzs: Number(removeCommas(data?.payed_price_uzs?.toString())),
      payed_price: Number(removeCommas(data?.payed_price?.toString())),
    });
    console.log(data);
  };
  const handleSelectCar = (newVale: SingleValue<Option>) => {
    setSelectedCar(newVale);
    setValue("car", newVale?.value as string);
  };
  return (
    <div className="w-full container mx-auto mt-8 space-y-8">
      {/* Top Form Section */}
      <Card>
        <CardContent className="p-6 space-y-6">
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 ">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2 col">
                  <label className="text-sm">Название заправки</label>
                  <Input
                    disabled={id ? true : false}
                    {...register("name", {
                      required: "Это значение является обязательным",
                    })}
                    placeholder="0"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm">Выберите автомобиль</label>
                  <Select
                  {...register("car", {required: "Это значение является обязательным"})}
                    options={carOptions}
                    value={selectedCar}
                    onChange={handleSelectCar}
                    placeholder={"Isuzu 01A111AA"}
                    noOptionsMessage={() => "Не найдено"}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm">Цена на газ (м3)</label>
                  <CurrencyInputWithSelect name="payed_price" />
                </div>
                <div className="space-y-2 col">
                  <label className="text-sm">
                    Количество купленного газа (м3)
                  </label>
                  <Input
                    disabled={id ? true : false}
                    {...register("purchased_volume", {
                      valueAsNumber: true,
                      required: "Это значение является обязательным",
                    })}
                    placeholder="0"
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <Button className="bg-[#4880FF] text-white hover:bg-blue-600 w-[250px] rounded">
                  Добавить
                </Button>
              </div>
            </form>
          </FormProvider>
        </CardContent>
      </Card>

      {/* Middle Table Section */}
      <Card>
        <CardContent className="p-6">
          <Table>
            <TableHeader className="font-bold">
              <TableRow className="border-b border-b-gray-300">
                <TableHead className="font-bold">Машина</TableHead>
                <TableHead className="font-bold">Количество</TableHead>
                <TableHead className="font-bold">Цена</TableHead>
                <TableHead className="font-bold">Дата</TableHead>
                <TableHead className="font-bold"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {stationList?.results?.map((entry, index) => (
                <TableRow key={index} className="border-b border-b-gray-300">
                  <TableCell>{entry?.car?.name}</TableCell>
                  <TableCell>{entry?.purchased_volume}</TableCell>
                  <TableCell>{entry?.payed_price_uzs}</TableCell>
                  <TableCell>{formatDate(entry?.created_at as string, "/")}</TableCell>
                  <TableCell>
                    <Button
                      variant="secondary"
                      className="bg-red-100 hover:bg-red-200 text-red-600"
                    >
                      Наличи
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="mt-4 flex justify-between items-center">
            <div>
              Итого: {stationList?.count} с {indexOfFirstOrder + 1} до
              {Math.min(indexOfLastOrder, stationList?.count as number) || ""}
            </div>
            <div className="flex space-x-2 items-center">
              <Button
                variant="outline"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="w-10 h-10 p-0"
              >
                <ChevronLeftIcon className="w-4 h-4" />
                <span className="sr-only">Previous page</span>
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
                <span className="sr-only">Next page</span>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
