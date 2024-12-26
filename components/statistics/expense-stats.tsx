"use client";

import {
  fetchFinanceStats,
  fetchFlightsStats,
  fetchFlightsStatsAll,
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
import { FlightPaginatedResponse } from "@/lib/types/flight.types";
import { IGasStation } from "@/lib/types/gas_station.types";
import { fetchAllGasStation } from "@/lib/actions/gas.action";
import { IOilType } from "@/lib/types/oil.types";
import { fetchWholeOils } from "@/lib/actions/oil.action";
import { IDieselPaginated } from "@/lib/types/diesel.types";
import { fetchDiesel } from "@/lib/actions/diesel.action";
import { Input } from "../ui/input";

export function ExpenseStats() {
  const { data: stats } = useQuery<StatsPaginated>({
    queryKey: ["stats", 1],
    queryFn: () => fetchFinanceStats(1, "", "", ""),
  });
  const { data: flights } = useQuery<FlightPaginatedResponse>({
    queryKey: ["flight-stats", 1],
    queryFn: () => fetchFlightsStats(1, "ACTIVE"),
  });
  const { data: flights_all } = useQuery<FlightPaginatedResponse>({
    queryKey: ["flight-stats-all"],
    queryFn: () => fetchFlightsStatsAll(),
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
        <div>
          <label>Дата начала</label>
          <Input type="date" className="w-[300px]" />
        </div>
        <div>
          <label>Дата окончания</label>
          <Input type="date" className="w-[300px]" />
        </div>
      </div>
      <div className="flex flex-col gap-4">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          <StatCard
            title="Рейсы"
            value={(flights_all?.count?.toFixed(2)) || 0}
            icon={PlaneIcon}
            url="/flight/info/"
          />
          <StatCard
            title="Активные рейсы"
            value={(flights?.count?.toFixed(2)) || 0}
            icon={PlaneTakeoff}
            url="/flight/info/"
          />
          <StatCard
            title="Сумма дохода"
            value={(data?.income_sum?.toFixed(2)) || 0}
            icon={TrendingUpIcon}
            url="/finance/export-logs/?action=INCOME"
          />
          <StatCard
            title="Сумма расхода"
            value={(data?.outcome_sum?.toFixed(2)) || 0}
            icon={TrendingDownIcon}
            url="/flight/info/?action=OUTCOME"
          />
          <StatCard
            title={(data?.win as number) > 0 ? "Прибыль" : "Долг"}
            value={(data?.win?.toFixed(2)) || 0}
            icon={AwardIcon}
          />
        </div>
        <div className="grid grid-cols-3 gap-4">
          <StatCard
            title="Газ"
            value={`${(gasVolume?.toFixed(2)) || 0} м3`}
            icon={AwardIcon}
            url="/gas/gaz-info/?type=purchase"
            url2="/gas/gaz-info/?type=sale"
          />
          <StatCard
            title="Масло"
            value={`${(oilVolume?.toFixed(2)) || 0} л`}
            icon={AwardIcon}
            url="/oil/oil-info/?type=purchase"
            url2="/oil/oil-info/?type=recycle"
          />
          <StatCard
            title="Дизель"
            value={`${(diesel_volume?.toFixed(2)) || 0} л`}
            icon={AwardIcon}
            url="/oil/oil-info/?type=purchase"
            url2="/oil/oil-info/?type=recycle"
          />
        </div>
        
      </div>
    </div>
  );
}
