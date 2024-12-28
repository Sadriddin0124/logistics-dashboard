"use client";

import {
  fetchFinanceStats,
} from "@/lib/actions/stats.ction";
import { StatCard } from "./stat-card";
import {
  PlaneIcon,
  TrendingUpIcon,
  TrendingDownIcon,
  AwardIcon,
  PlaneTakeoff,
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

type Props = {
  start: string,
  end: string
  setStart: Dispatch<SetStateAction<string>>
  setEnd: Dispatch<SetStateAction<string>>
}

export function ExpenseStats({start, end, setStart, setEnd}: Props) {

  const { data: stats } = useQuery<StatsPaginated>({
    queryKey: ["stats", 1, start, end],
    queryFn: () => fetchFinanceStats(1, start, end, "PAY_SALARY"),
  });
  const { data: stations } = useQuery<IGasStation[]>({
    queryKey: ["all_stations"],
    queryFn: fetchAllGasStation,
  });
  const { data: oil } = useQuery<IOilType[]>({
    queryKey: ["all_oil"],
    queryFn: fetchWholeOils,
  });
  const { data: diesel } = useQuery<IDieselPaginated>({
    queryKey: ["diesel"],
    queryFn: () => fetchDiesel(1),
  });

  const data = stats?.results[0];
  const gasVolume = stations?.reduce((total, station) => {
    return total + (station.remaining_gas ?? 0);
  }, 0);
  const oilVolume = oil?.reduce((total, oil) => {
    return total + (oil.oil_volume ?? 0);
  }, 0);
  const diesel_volume = diesel?.results?.[0]?.remaining_volume?.volume;
  console.log(diesel_volume);

  return (
    <div>
      <div className="flex items-center gap-2 p-4 bg-white rounded-2xl mb-4">
        <div className="space-y-1">
          <label className="text-sm">Дата начала</label>
          <Input type="date" className="w-[300px]" onChange={(e)=>setStart(e.target.value)}/>
        </div>
        <div className="space-y-1">
          <label className="text-sm">Дата окончания</label>
          <Input type="date" className="w-[300px]" onChange={(e)=>setEnd(e.target.value)}/>
        </div>
      </div>
      <div className="flex flex-col gap-4">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <StatCard
            title="Рейсы"
            value={data?.flight_count || 0}
            icon={PlaneIcon}
            url="/flight/info/"
          />
          <StatCard
            title="Активные рейсы"
            value={data?.active_flight_count || 0}
            icon={PlaneTakeoff}
            url="/flight/info/"
          />
          <StatCard
            title="Сумма дохода"
            value={data?.income_sum?.toFixed(2) || 0}
            icon={TrendingUpIcon}
            url="/finance/export-logs/?action=INCOME"
          />
          <StatCard
            title="Сумма расхода"
            value={data?.outcome_sum?.toFixed(2) || 0}
            icon={TrendingDownIcon}
            url="/flight/info/?action=OUTCOME"
          />
          <StatCard
            title="Лизинговый баланс"
            value={data?.leasing_balance?.toFixed(2) || 0}
            icon={TrendingDownIcon}
            url="/flight/info/?action=OUTCOME"
          />
          <StatCard
            title={"Сумма лизинга выплачена"}
            value={data?.total_leasing_paid?.toFixed(2) || 0}
            icon={AwardIcon}
          />
        </div>
        <div className="grid grid-cols-3 gap-4">
          <StatCard
            status={true}
            title="Газ"
            value={`${gasVolume?.toFixed(2) || 0} м3`}
            icon={AwardIcon}
            url="/gas/gaz-info/?type=purchase"
            url2="/gas/gaz-info/?type=sale"
          />
          <StatCard
            status={true}
            title="Масло"
            value={`${oilVolume?.toFixed(2) || 0} л`}
            icon={AwardIcon}
            url="/oil/oil-info/?type=purchase"
            url2="/oil/oil-info/?type=recycle"
          />
          <StatCard
            status={true}
            title="Дизель"
            value={`${diesel_volume?.toFixed(2) || 0} л`}
            icon={AwardIcon}
            url="/oil/oil-info/?type=purchase"
            url2="/oil/oil-info/?type=recycle"
          />
        </div>
      </div>
    </div>
  );
}
