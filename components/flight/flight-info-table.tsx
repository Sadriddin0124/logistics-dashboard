"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Expense {
  administrator: string;
  amount: number;
  date: string;
  info: string;
}

const expenses: Expense[] = [
  {
    administrator: "Sunnatilla Sh.N.",
    amount: 52300,
    date: "12.12.2024",
    info: "Shafyor uchun",
  },
];

export default function ExpenseHistory() {
  return (
    <Card className="w-full container mx-auto min-h-[50vh]">
      <CardHeader>
        <CardTitle>История расходов</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow className="border-b border-b-gray-200">
              <TableHead>Администратор</TableHead>
              <TableHead>Сумма</TableHead>
              <TableHead>Дата</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {expenses.map((expense, index) => (
              <TableRow className="border-b border-b-gray-200" key={index}>
                <TableCell>{expense.administrator}</TableCell>
                <TableCell>{expense.amount}</TableCell>
                <TableCell>{expense.date}</TableCell>
                <TableCell>{expense.info}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
