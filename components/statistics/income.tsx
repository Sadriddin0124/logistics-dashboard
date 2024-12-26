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

export default function IncomeOutcomeGraph() {
  // Generate a list of months for the current year
  const getCurrentYearMonths = () => {
    const now = new Date();
    const months = [];
    for (let month = 0; month < 12; month++) {
      months.push(
        new Date(now.getFullYear(), month, 1).toISOString().slice(0, 7) // Format as YYYY-MM
      );
    }
    return months;
  };

  const monthsInYear = useMemo(() => getCurrentYearMonths(), []);

  // Query for financial data for the full year
  const { data: finance_info } = useQuery<ResponseData>({
    queryKey: ["finance_info"],
    queryFn: () =>
      fetchFinanceInfo(
        `${monthsInYear[0]}-01`, // Start of the year
        `${monthsInYear[11]}-31` // End of the year (ensuring we capture December)
      ),
  });

  // Map finance data to all months of the year
  const chartData = monthsInYear.map((month) => {
    const dataForMonth = finance_info?.results.chart_data.find(
      (entry) => entry.period.slice(0, 7) === month
    );
    return {
      period: month,
      Приход: dataForMonth?.income || 0, // Default to 0 if no income
      Расход: dataForMonth?.outcome || 0, // Default to 0 if no outcome
    };
  });

    return (
    <Card className="w-full mt-4">
      <CardHeader>
        <CardTitle>Доход против Расхода</CardTitle>
        <CardDescription>
          Ежемесячный обзор финансов за год (в тысячах сум)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
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
          className="h-[500px]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="period"
                tickFormatter={(date) =>
                  new Date(date).toLocaleDateString("ru-RU", {
                    month: "short",
                    year: "numeric",
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
  );
}
