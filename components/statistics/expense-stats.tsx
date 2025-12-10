"use client";

import {
  fetchFinanceStats,
  fetchFlightStats,
} from "@/lib/actions/stats.ction";
import { StatCard } from "./stat-card";
import {
  PlaneIcon,
  TrendingUpIcon,
  TrendingDownIcon,
  AwardIcon,
  PlaneTakeoff,
  PlaneTakeoffIcon,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Input } from "../ui/input";
import { Dispatch, SetStateAction } from "react";

type Props = {
  start: string;
  end: string;
  setStart: Dispatch<SetStateAction<string>>;
  setEnd: Dispatch<SetStateAction<string>>;
};

interface WarehouseStatsType {
  gas_purchase_volume: number;
  gas_sale_volume: number;
  gas_total_volume: number;
  leasing_balance: number;
  leasing_paid: number;
  oil_purchase_volume: number;
  oil_sale_volume: number;
  oil_total_volume: number;
  salarka_purchase_volume: number;
  salarka_sale_volume: number;
  salarka_total_volume: number;
}

interface FinanceStatsType {
  active_flights: number;
  employee_expense: number;
  in_uzb_flights: number;
  leasing_balance: number;
  leasing_paid: number;
  order_flight: number;
  other_expense: number;
  out_uzb_flights: number;
  total_expense: number;
  total_flights: number;
  total_for_all_cars: number;
  total_income: number;
  total_orders: number;
}

export function ExpenseStats({ start, end, setStart, setEnd }: Props) {
  const { data: warehouse_stats } = useQuery<WarehouseStatsType>({
    queryKey: ["warehouse_stats"],
    queryFn: () => fetchFlightStats(start, end),
    refetchOnWindowFocus: true,
  });

  const { data: finance_stats } = useQuery<FinanceStatsType>({
    queryKey: ["finance_stats"],
    queryFn: () => fetchFinanceStats(start, end),
    refetchOnWindowFocus: true,
  });

  return (
    <div>
      <div className="flex sm:items-center flex-col sm:flex-row gap-2 p-4 bg-white rounded-2xl mb-4">
        <div className="space-y-1">
          <label className="text-sm">Дата начала</label>
          <Input
            type="date"
            className="w-[250px] sm:w-[300px]"
            onChange={(e) => setStart(e.target.value)}
          />
        </div>
        <div className="space-y-1">
          <label className="text-sm">Дата окончания</label>
          <Input
            type="date"
            className="w-[250px] sm:w-[300px]"
            onChange={(e) => setEnd(e.target.value)}
          />
        </div>
      </div>
      <div className="flex flex-col gap-4">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <StatCard
            title="Рейсы"
            value={finance_stats?.total_flights || 0}
            icon={PlaneIcon}
            url="/flight/info/"
            name="Рейсы"
          />
          <StatCard
            title="Активные рейсы"
            value={finance_stats?.active_flights || 0}
            icon={PlaneTakeoff}
            url="/flight/info/?status=ACTIVE"
            name="Активные рейсы"
          />
          <StatCard
            title="Рейсы в Узбекистане"
            value={finance_stats?.in_uzb_flights || 0}
            icon={PlaneIcon}
            url="/flight/info/?flight_type=IN_UZB"
            name="Рейсы в Узбекистане"
          />
          <StatCard
            title="Рейсы за пределы Узбекистана"
            value={finance_stats?.out_uzb_flights || 0}
            icon={PlaneTakeoffIcon}
            url="/flight/info/?flight_type=OUT"
            name="Рейсы за пределы Узбекистана"
          />
          <StatCard
            title="Рейс на заказ"
            value={finance_stats?.order_flight || 0}
            icon={PlaneTakeoffIcon}
            url="/flight/info/?type=ordered"
            name="Рейс на заказ"
          />
          <StatCard
            title="Сумма дохода"
            value={finance_stats?.total_income || 0}
            icon={TrendingUpIcon}
            url="/finance/export-logs/?action=INCOME"
            name="Сумма дохода"
            // sum
          />
          <StatCard
            title="Сумма расхода"
            value={finance_stats?.total_expense || 0}
            icon={TrendingDownIcon}
            url="/finance/export-logs/?action=OUTCOME"
            name="Сумма расхода"
            // sum
          />
          <StatCard
            title="Расходы на сотрудников"
            value={finance_stats?.employee_expense || 0}
            icon={TrendingDownIcon}
            url="/finance/export-logs/?action=OUTCOME&kind=PAY_SALARY"
            name="Расходы на сотрудников"
            // sum
          />
          <StatCard
            title="Проче расходы"
            value={finance_stats?.other_expense || 0}
            icon={TrendingDownIcon}
            url="/finance/export-logs/?action=OUTCOME&kind=OTHER"
            name="Проче расходы"
            // sum
          />
          <StatCard
            title="Итого по всем автомобилям"
            value={finance_stats?.total_for_all_cars || 0}
            icon={TrendingDownIcon}
            // url="/flight/info/?action=OUTCOME"
            name="Итого по всем автомобилям"
            // sum
          />
          <StatCard
            title="Лизинговый баланс"
            value={warehouse_stats?.leasing_paid?.toFixed(2) || 0}
            icon={TrendingDownIcon}
            // url="/flight/info/?action=OUTCOME"
            name="Лизинговый баланс"
            // sum
          />
          <StatCard
            title={"Сумма лизинга выплачена"}
            value={warehouse_stats?.leasing_paid?.toFixed(2) || 0}
            icon={AwardIcon}
            // sum
          />
          <StatCard
            status={true}
            title="Газ"
            value={`${warehouse_stats?.gas_total_volume?.toFixed(2) || 0} м3`}
            icon={AwardIcon}
            title1="Покупка газа"
            title2="Продажа газа"
            name="Покупка газа"
            name2="Продажа газа"
            url="/gas/gaz-info/?type=purchase"
            url2="/gas/gaz-info/?type=sale"
          />
          <StatCard
            status={true}
            title="Масло"
            value={`${warehouse_stats?.oil_total_volume?.toFixed(2) || 0} л`}
            icon={AwardIcon}
            title1="Покупка масло"
            title2="Продажа масло"
            name2="Продажа масло"
            name="Покупка масло"
            url="/oil/oil-info/?type=purchase"
            url2="/oil/oil-info/?type=recycle"
          />
          <StatCard
            status={true}
            title="Солярка"
            value={`${
              warehouse_stats?.salarka_total_volume?.toFixed(2) || 0
            } л`}
            icon={AwardIcon}
            title1="Покупка солярка"
            title2="Продажа солярка"
            name="Покупка солярка"
            name2="Продажа солярка"
            url="/oil/oil-info/?type=purchase"
            url2="/oil/oil-info/?type=recycle"
          />
        </div>
      </div>
    </div>
  );
}
