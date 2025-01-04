"use client";

import {
  fetchFinanceStats,
  fetchOtherExpenses,
  fetchSalaries,
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
import { StatsPaginated } from "@/lib/types/stats.types";
import { IGasStation } from "@/lib/types/gas_station.types";
import { fetchAllGasStation } from "@/lib/actions/gas.action";
import { IOilType } from "@/lib/types/oil.types";
import { fetchWholeOils } from "@/lib/actions/oil.action";
import { IDieselPaginated } from "@/lib/types/diesel.types";
import { fetchDiesel } from "@/lib/actions/diesel.action";
import { Input } from "../ui/input";
import { Dispatch, SetStateAction } from "react";
import {
  fetchFlightStats,
  fetchOrderedFlights,
} from "@/lib/actions/flight.action";

type Props = {
  start: string;
  end: string;
  setStart: Dispatch<SetStateAction<string>>;
  setEnd: Dispatch<SetStateAction<string>>;
};

export function ExpenseStats({ start, end, setStart, setEnd }: Props) {
  const { data: stats } = useQuery<StatsPaginated>({
    queryKey: ["stats", 1, start, end],
    queryFn: () => fetchFinanceStats(1, start, end, ""),
    refetchOnWindowFocus: true,
  });
  const { data: salaries } = useQuery<StatsPaginated>({
    queryKey: ["salaries", 1, start, end],
    queryFn: () => fetchSalaries(1, start, end, "PAY_SALARY"),
    refetchOnWindowFocus: true,
  });
  const { data: other_expenses } = useQuery<StatsPaginated>({
    queryKey: ["other_expenses", 1, start, end],
    queryFn: () => fetchOtherExpenses(1, start, end, "OTHER"),
    refetchOnWindowFocus: true,
  });
  const { data: stations } = useQuery<IGasStation[]>({
    queryKey: ["all_stations"],
    queryFn: fetchAllGasStation,
    refetchOnWindowFocus: true,
  });
  const { data: oil } = useQuery<IOilType[]>({
    queryKey: ["all_oil"],
    queryFn: fetchWholeOils,
    refetchOnWindowFocus: true,
  });
  const { data: diesel } = useQuery<IDieselPaginated>({
    queryKey: ["diesel"],
    queryFn: () => fetchDiesel(1),
    refetchOnWindowFocus: true,
  });
  const { data: flights_in_uzb } = useQuery<IDieselPaginated>({
    queryKey: ["flights_in_uzb"],
    queryFn: () => fetchFlightStats(1, "IN_UZB"),
    refetchOnWindowFocus: true,
  });
  const { data: flights_out } = useQuery<IDieselPaginated>({
    queryKey: ["flights_out"],
    queryFn: () => fetchFlightStats(1, "OUT"),
    refetchOnWindowFocus: true,
  });
  const { data: ordered_flights } = useQuery<IDieselPaginated>({
    queryKey: ["ordered_flights"],
    queryFn: () => fetchOrderedFlights(1),
    refetchOnWindowFocus: true,
  });

  const data = stats?.results[0];
  const gasVolume = stations?.reduce((total, station) => {
    return total + (station.remaining_gas ?? 0);
  }, 0);
  const oilVolume = oil?.reduce((total, oil) => {
    return total + (oil.oil_volume ?? 0);
  }, 0);
  const diesel_volume = diesel?.results?.[0]?.remaining_volume?.volume;

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
            value={data?.flight_count || 0}
            icon={PlaneIcon}
            url="/flight/info/"
            name="Информация о Рейсе"
          />
          <StatCard
            title="Активные рейсы"
            value={data?.active_flight_count || 0}
            icon={PlaneTakeoff}
            url="/flight/info/"
            name="Информация о Рейсе"
          />
          <StatCard
            title="Рейсы в Узбекистане"
            value={flights_in_uzb?.count || 0}
            icon={PlaneIcon}
            url="/flight/info/?action=OUTCOME"
            name="Информация о Рейсе"
          />
          <StatCard
            title="Рейсы за пределы Узбекистана"
            value={flights_out?.count || 0}
            icon={PlaneTakeoffIcon}
            url="/flight/info/?action=OUTCOME"
            name="Информация о Рейсе"
          />
          <StatCard
            title="Рейс на заказ"
            value={ordered_flights?.count || 0}
            icon={PlaneTakeoffIcon}
            url="/flight/info/?action=OUTCOME"
            name="Информация о Рейсе"
          />
          <StatCard
            title="Сумма дохода"
            value={data?.income_sum?.toFixed(2) || 0}
            icon={TrendingUpIcon}
            url="/finance/export-logs/?action=INCOME"
            name="финансовая информация"
          />
          <StatCard
            title="Сумма расхода"
            value={data?.outcome_sum?.toFixed(2) || 0}
            icon={TrendingDownIcon}
            url="/flight/info/?action=OUTCOME"
            name="финансовая информация"
          />
          <StatCard
            title="Расходы на сотрудников"
            value={salaries?.results[0]?.outcome_sum?.toFixed(2) || 0}
            icon={TrendingDownIcon}
            url="/flight/info/?action=OUTCOME&kind=PAY_SALARY"
            name="финансовая информация"
          />
          <StatCard
            title="Проче расходы"
            value={other_expenses?.results[0]?.outcome_sum?.toFixed(2) || 0}
            icon={TrendingDownIcon}
            url="/flight/info/?action=OUTCOME&kind=OTHER"
            name="финансовая информация"
          />
          <StatCard
            title="Лизинговый баланс"
            value={data?.leasing_balance?.toFixed(2) || 0}
            icon={TrendingDownIcon}
            // url="/flight/info/?action=OUTCOME"
            name="финансовая информация"
          />
          <StatCard
            title={"Сумма лизинга выплачена"}
            value={data?.total_leasing_paid?.toFixed(2) || 0}
            icon={AwardIcon}
          />
          <StatCard
            status={true}
            title="Газ"
            value={`${gasVolume?.toFixed(2) || 0} м3`}
            icon={AwardIcon}
            title1="Покупка газа"
            title2="Продажа газа"
            url="/gas/gaz-info/?type=purchase"
            url2="/gas/gaz-info/?type=sale"
            name="информация о добыче газа"
          />
          <StatCard
            status={true}
            title="Масло"
            value={`${oilVolume?.toFixed(2) || 0} л`}
            icon={AwardIcon}
            title1="Покупка масло"
            title2="Продажа масло"
            url="/oil/oil-info/?type=purchase"
            url2="/oil/oil-info/?type=recycle"
            name="о производстве масла"
          />
          <StatCard
            status={true}
            title="Солярка"
            value={`${diesel_volume?.toFixed(2) || 0} л`}
            icon={AwardIcon}
            title1="Покупка солярка"
            title2="Продажа солярка"
            url="/oil/oil-info/?type=purchase"
            url2="/oil/oil-info/?type=recycle"
            name="о производстве саларки"
          />
        </div>
      </div>
    </div>
  );
}
