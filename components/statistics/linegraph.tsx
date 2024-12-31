// "use client"

// import { Line, LineChart, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer } from "recharts"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
// import { fetchFinanceInfo } from "@/lib/actions/stats.ction"
// import { useQuery } from "@tanstack/react-query"
// import { ResponseData } from "@/lib/types/stats.types"

// // Sample data for income and outcome (in thousands of dollars)
// const financialData = [
//   { month: "Jan", income: 50, outcome: 30 },
//   { month: "Feb", income: 55, outcome: 35 },
//   { month: "Mar", income: 60, outcome: 38 },
//   { month: "Apr", income: 58, outcome: 36 },
//   { month: "May", income: 62, outcome: 40 },
//   { month: "Jun", income: 65, outcome: 42 },
//   { month: "Jul", income: 68, outcome: 45 },
//   { month: "Aug", income: 70, outcome: 47 },
//   { month: "Sep", income: 72, outcome: 48 },
//   { month: "Oct", income: 75, outcome: 50 },
//   { month: "Nov", income: 78, outcome: 52 },
//   { month: "Dec", income: 80, outcome: 55 },
// ]

// export default function IncomeOutcomeGraph() {
//   const getCurrentMonthDates = () => {
//     const now = new Date();
//     const startDate = new Date(now.getFullYear(), now.getMonth(), 1); // First day of the month
//     const endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0); // Last day of the month
//     return { startDate, endDate };
//   };
//   const { startDate, endDate } = getCurrentMonthDates();
//   const { data: finance_info } = useQuery<ResponseData>({
//     queryKey: ["finance_info", ],
//     queryFn: () => fetchFinanceInfo(startDate.toISOString(), endDate.toISOString()),
//   });

//   console.log(finance_info?.results);

//   // Example usage
//   console.log("Start Date:", startDate.toISOString());
//   console.log("End Date:", endDate.toISOString());
//   return (
//     <Card className="w-full max-w-3xl mt-4">
//       <CardHeader>
//         <CardTitle>Income vs Outcome</CardTitle>
//         <CardDescription>Monthly financial overview (in thousands of dollars)</CardDescription>
//       </CardHeader>
//       <CardContent>
//         <ChartContainer
//           config={{
//             income: {
//               label: "Income",
//               color: "hsl(var(--chart-1))",
//             },
//             outcome: {
//               label: "Outcome",
//               color: "hsl(var(--chart-2))",
//             },
//           }}
//           className="h-[400px]"
//         >
//           <ResponsiveContainer width="100%" height="100%">
//             <LineChart data={financialData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
//               <CartesianGrid strokeDasharray="3 3" />
//               <XAxis dataKey="month" />
//               <YAxis />
//               <ChartTooltip content={<ChartTooltipContent />} />
//               <Legend />
//               <Line
//                 type="monotone"
//                 dataKey="income"
//                 stroke="var(--color-income)"
//                 strokeWidth={2}
//                 dot={{ r: 4 }}
//                 activeDot={{ r: 6 }}
//               />
//               <Line
//                 type="monotone"
//                 dataKey="outcome"
//                 stroke="var(--color-outcome)"
//                 strokeWidth={2}
//                 dot={{ r: 4 }}
//                 activeDot={{ r: 6 }}
//               />
//             </LineChart>
//           </ResponsiveContainer>
//         </ChartContainer>
//       </CardContent>
//     </Card>
//   )
// }
"use client";

import { useMemo } from "react";
import {
  Line,
  LineChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { fetchFinanceInfo } from "@/lib/actions/stats.ction";
import { useQuery } from "@tanstack/react-query";
import { ResponseData } from "@/lib/types/stats.types";
import YearGraph from "./income";
type Props = {
  start: string;
  end: string;
};
export default function IncomeOutcomeGraph({ start, end }: Props) {
  const getCurrentMonthDays = () => {
    const now = new Date();
    const daysInMonth = new Date(
      now.getFullYear(),
      now.getMonth() + 1,
      0
    ).getDate();
    const dates = [];
    for (let day = 1; day <= daysInMonth; day++) {
      dates.push(
        new Date(now.getFullYear(), now.getMonth(), day)
          .toISOString()
          .slice(0, 10)
      ); // Format as YYYY-MM-DD
    }
    return dates;
  };

  const getCurrentYearMonths = () => {
    const year = new Date().getFullYear(); // Get the current year
    const months = [];
    for (let month = 0; month < 12; month++) {
      if (month === 0) {
        months.push(
          new Date(year + 1, month, 1).toISOString().slice(0, 7) // Format: YYYY-MM
        );
      }
      months.push(
        new Date(year, month, 1).toISOString().slice(0, 7) // Format: YYYY-MM
      );
    }
    months.splice(1, 1);
    return months;
  };

  const monthsInYear = useMemo(() => getCurrentYearMonths(), []);

  const daysInMonth = useMemo(() => getCurrentMonthDays(), []);
  console.log(monthsInYear);
  
  const { data: finance_info } = useQuery<ResponseData>({
    queryKey: ["finance_info", start, end],
    queryFn: () =>
      fetchFinanceInfo(
        start || `${monthsInYear[1]}-01`,
        end || `${monthsInYear[0]}-31`
      ),
  });

  // Map finance data to all days of the month
  const chartData = daysInMonth.map((day) => {
    const dataForDay = finance_info?.results.chart_data.find(
      (entry) => entry.period.slice(0, 10) === day
    );
    return {
      period: day,
      Приход: dataForDay?.income || 0, // Default to 0 if no income
      Расход: dataForDay?.outcome || 0, // Default to 0 if no outcome
    };
  });

  return (
    <div className="flex flex-col items-center justify-center">
      <Card className="w-full mt-4">
        <CardHeader>
          <CardTitle>Доход против Расхода</CardTitle>
          <CardDescription>
            Ежедневный обзор финансов за месяц (в тысячах сум)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
          className="w-auto"
            config={{
              income: {
                label: "Приход",
                color: "hsl(var(--chart-1))",
              },
              outcome: {
                label: "Расход",
                color: "hsl(var(--chart-2))",
              },
            }}
            // className="h-[500px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={chartData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="period"
                  tickFormatter={(date) =>
                    new Date(date).toLocaleDateString("ru-RU", {
                      day: "2-digit",
                      month: "short",
                    })
                  }
                />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="Приход"
                  stroke="var(--color-income)"
                  strokeWidth={2}
                  dot={false} // Remove dots
                  activeDot={{ r: 6 }}
                />
                <Line
                  type="monotone"
                  dataKey="Расход"
                  stroke="var(--color-outcome)"
                  strokeWidth={2}
                  dot={false} // Remove dots
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
      <YearGraph />
    </div>
  );
}
