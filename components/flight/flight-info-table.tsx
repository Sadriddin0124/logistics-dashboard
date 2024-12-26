// "use client";

// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// interface Expense {
//   administrator: string;
//   amount: number;
//   date: string;
//   info: string;
// }

// const expenses: Expense[] = [
//   {
//     administrator: "Sunnatilla Sh.N.",
//     amount: 52300,
//     date: "12.12.2024",
//     info: "Shafyor uchun",
//   },
// ];

// export default function ExpenseHistory() {
//   return (
//     <Card className="w-full container mx-auto min-h-[50vh]">
//       <CardHeader>
//         <CardTitle>История расходов</CardTitle>
//       </CardHeader>
//       <CardContent>
//         <Table>
//           <TableHeader>
//             <TableRow className="border-b border-b-gray-200">
//               <TableHead>Администратор</TableHead>
//               <TableHead>Сумма</TableHead>
//               <TableHead>Дата</TableHead>
//               <TableHead></TableHead>
//             </TableRow>
//           </TableHeader>
//           <TableBody>
//             {expenses.map((expense, index) => (
//               <TableRow className="border-b border-b-gray-200" key={index}>
//                 <TableCell>{expense.administrator}</TableCell>
//                 <TableCell>{expense.amount}</TableCell>
//                 <TableCell>{expense.date}</TableCell>
//                 <TableCell>{expense.info}</TableCell>
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//       </CardContent>
//     </Card>
//   );
// }
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
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { fetchFlightExpense } from "@/lib/actions/flight.action";
import { useQuery } from "@tanstack/react-query";
import { queryClient } from "../ui-items/ReactQueryProvider";
import { useRouter } from "next/router";
import { IFinanceResponse } from "@/lib/types/finance.types";

export default function FlightTable() {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const { id } = useRouter()?.query
  const { data: flights } = useQuery<IFinanceResponse>({
    queryKey: ["flights-expenses", id, currentPage],
    queryFn: () => fetchFlightExpense(id as string, currentPage),
  });
  useEffect(() => {
    queryClient.prefetchQuery({
      queryKey: ["flights-expenses", id, currentPage + 1],
      queryFn: () => fetchFlightExpense(id as string, currentPage + 1),
    });
  }, [id, currentPage]);

  const itemsPerPage = 10;
  const indexOfLastOrder = currentPage * itemsPerPage;
  const indexOfFirstOrder = (currentPage - 1) * itemsPerPage;

  const totalPages = Math.ceil((flights?.count as number) / itemsPerPage);

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
      case 'PAY_SALARY':
        return 'Оплата'
      case 'FIX_CAR':
        return 'Ремонт автомобиля'
      case 'FLIGHT':
        return 'Рейс'
      case 'OTHER':
        return 'Общий'
      default:
    }}
  return (
    <div className="w-full container mx-auto bg-white rounded-2xl min-h-screen p-8">
      <h2 className="mb-4 text-2xl font-medium">История расходов</h2>

      <Table>
        <TableHeader className="font-bold">
          <TableRow className="border-b border-gray-200">
            <TableHead className="font-bold">Расход и Приход</TableHead>
            <TableHead className="font-bold p-5">Тип расхода</TableHead>
            <TableHead className="font-bold">Использованная сумма</TableHead>
            <TableHead className="font-bold">Груз</TableHead>
            <TableHead className="font-bold w-[50px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {flights?.results?.map((finance, index) => (
            <TableRow key={index} className="border-b border-gray-200">
              <TableCell className="px-5">{finance.action?.toLowerCase() === "outcome" ? "Расход" : "Приход"}</TableCell>
              <TableCell className="px-5">{handleChange(finance?.kind as string)}</TableCell>
              <TableCell className="px-5">{finance.amount_uzs} сум</TableCell>
              <TableCell className="px-5">
                <span className="line-clamp-1 overflow-hidden">
                  {finance.comment}
                </span>
              </TableCell>
              <TableCell className="px-5 flex gap-1 items-center">
                {/* Место для кнопок */}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="mt-4 flex justify-between items-center">
        <div>
          Итого: {flights?.count || 0} с {indexOfFirstOrder + 1} до{" "}
          {Math.min(indexOfLastOrder, flights?.count as number) || 0}
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
            <span className="sr-only">Next page</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
