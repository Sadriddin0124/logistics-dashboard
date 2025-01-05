"use client";

import { useEffect, useState } from "react";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ChevronLeftIcon, ChevronRightIcon, Download } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { queryClient } from "@/components/ui-items/ReactQueryProvider";
import { fetchFinances } from "@/lib/actions/finance.action";
import { IFinanceResponse } from "@/lib/types/finance.types";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { downloadExcelFile } from "@/lib/functions";

export default function Expenses() {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [expenseType, setExpenseType] = useState<string>("");
  const [action, setAction] = useState("")
  const { data: financeList } = useQuery<IFinanceResponse>({
    queryKey: ["finances", currentPage, startDate, endDate, expenseType, action],
    queryFn: () => fetchFinances(currentPage, startDate, endDate, expenseType, action),
  });

  useEffect(() => {
    queryClient.prefetchQuery({
      queryKey: ["finances", currentPage + 1, startDate, endDate, expenseType, action],
      queryFn: () =>
        fetchFinances(currentPage + 1, startDate, endDate, expenseType, action),
    });
  }, [currentPage, startDate, endDate, expenseType, action]);

  const itemsPerPage = 30;
  const indexOfLastOrder = currentPage * itemsPerPage;
  const indexOfFirstOrder = (currentPage - 1) * itemsPerPage;

  const totalPages = Math.ceil((financeList?.count as number) / itemsPerPage);

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
  const handleChange = (value: string) => {
    switch (value) {
      case "PAY_SALARY":
        return "Оплата";
      case "FIX_CAR":
        return "Ремонт автомобиля";
      case "FLIGHT":
        return "Рейс";
      case "OTHER":
        return "Общий";
      case "LEASING":
        return "Лизинг";
      case "SALARKA":
        return "Солярка";
      default:
    }
  };
  const handleSelect = (value: string) => {
    if (value === ".") {
      setExpenseType("");
    } else {
      setExpenseType(value);
    }
  };

  const downloadFile = async () => {
    downloadExcelFile(`/finance/export-logs/?action=${action}`, "финансовая информация")
    // try {
    //   const response = await fetch(`http://16.171.242.109`, {
    //     method: "GET",
    //     headers: {
    //       "Content-Type":
    //         "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    //     },
    //   });

    //   if (!response.ok) {
    //     throw new Error("Не удалось загрузить Excel файл");
    //   }

    //   const blob = await response.blob();
    //   const url = window.URL.createObjectURL(blob);

    //   const a = document.createElement("a");
    //   a.href = url;
    //   a.download = "filename.xlsx"; // Установите ваше имя файла здесь
    //   document.body.appendChild(a);
    //   a.click();
    //   a.remove();

    //   window.URL.revokeObjectURL(url);
    // } catch (err) {
    //   console.error("Ошибка при скачивании файла:", err);
    // }
  };

  return (
    <div className="w-full container mx-auto bg-white p-8 rounded-2xl min-h-screen">
      <div className="text-2xl font-medium mb-3">
        <h2>Расходы и Приходы</h2>
      </div>
      <div className="grid grid-cols-5 items-end gap-4 my-4">
        <div className="space-y-2">
          <label>Дата начала</label>
          <Input
            type="date"
            onChange={(e) => setStartDate(e.target.value)}
            className="max-w-[500px]"
          />
        </div>
        <div className="space-y-2">
          <label>Дата окончания</label>
          <Input
            type="date"
            onChange={(e) => setEndDate(e.target.value)}
            className="max-w-[500px]"
          />
        </div>
        <div className="space-y-2">
          <label>Тип расхода</label>
          <Select onValueChange={handleSelect} defaultValue=".">
            <SelectTrigger>
              <SelectValue placeholder="Выберите тип расходов..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value=".">Все</SelectItem>
              <SelectItem value="PAY_SALARY">Оплата</SelectItem>
              <SelectItem value="FIX_CAR">Ремонт автомобиля</SelectItem>
              <SelectItem value="FLIGHT">Рейс</SelectItem>
              <SelectItem value="OTHER">Общий</SelectItem>
              <SelectItem value="LEASING">Лизинг</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <label>Расход или Приход</label>
          <Select onValueChange={(value)=>setAction(value === "." ? "" : value)}>
            <SelectTrigger>
              <SelectValue placeholder="Расход или Приход" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="OUTCOME">Расход</SelectItem>
              <SelectItem value="INCOME"> Приход</SelectItem>
              <SelectItem value="."> Расход или Приход</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button onClick={downloadFile} className="bg-[#4880FF] text-white ml-3 hover:bg-blue-600">
          <Download className="mr-2 h-4 w-4" />
          Скачать Excel
        </Button>
      </div>
      <Table>
        <TableHeader className="font-bold">
          <TableRow className="border-b border-gray-200">
            <TableHead className="font-bold">Расход и Приход</TableHead>
            <TableHead className="font-bold p-5">Тип расхода</TableHead>
            <TableHead className="font-bold">Использованная сумма</TableHead>
            <TableHead className="font-bold">Комментарий</TableHead>
            <TableHead className="font-bold w-[50px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {financeList?.results?.map((finance, index) => (
            <TableRow key={index} className="border-b border-gray-200">
              <TableCell className="px-5">
                {finance.action?.toLowerCase() === "outcome"
                  ? "Расход"
                  : "Приход"} 
              </TableCell>
              <TableCell className="px-5">
                {handleChange(finance?.kind as string) || "-"}
              </TableCell>
              <TableCell className="px-5">{(finance.amount_uzs as number)?.toFixed(2) || "0"} $</TableCell>
              <TableCell className="px-5">
                  {finance.comment}
              </TableCell>
              <TableCell className="px-5 flex gap-1 items-center"></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="mt-4 flex justify-between items-center">
        <div>
          Итого: {financeList?.count} с {indexOfFirstOrder + 1} до{" "}
          {Math.min(indexOfLastOrder, financeList?.count as number) || 0}
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
                  button === currentPage ? "bg-[#4880FF] text-white" : "border"
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
    </div>
  );
}
