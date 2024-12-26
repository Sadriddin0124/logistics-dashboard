import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { type LucideIcon } from "lucide-react";
import { Button } from "../ui/button";
import { downloadExcelFile } from "@/lib/functions";
import { useQuery } from "@tanstack/react-query";
import { IFinanceResponse } from "@/lib/types/finance.types";
import { fetchCarLeasing } from "@/lib/actions/stats.ction";
import { splitToHundreds } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  url?: string;
  url2?: string;
  title2?: string;
  title3?: string;
}

export function CarCard({
  title,
  value,
  icon: Icon,
  url,
  title2,
}: StatCardProps) {
  const { data: car_leasing } = useQuery<IFinanceResponse>({
    queryKey: ["car_leasing"],
    queryFn: fetchCarLeasing,
  });
  const item = car_leasing?.results[0];
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="font-medium">{title}</CardTitle>
        {url && (
          <Button
            variant={"ghost"}
            size={"sm"}
            onClick={() => downloadExcelFile(url as string)}
          >
            <Icon />
          </Button>
        )}
      </CardHeader>
      <CardContent>
        <div className="flex justify-between w-full">
          <div className="text-md font-medium">{value}</div>
          {url && (
            <Button
              variant={"ghost"}
              size={"sm"}
              onClick={() => downloadExcelFile(url as string)}
            >
              {title2} {/* Translation: "Download" = "Загрузить" */}
            </Button>
          )}
        </div>
        <div className="flex justify-between w-full">
          <div className="text-md font-medium">Баланс лизинга</div> {/* Translation: "Leasing Balance" */}
          <div>{splitToHundreds(item?.amount_uzs) || 0} сум</div>
        </div>
        <div className="flex justify-between w-full">
          <div className="text-md font-medium">Оплаченный лизинг</div> {/* Translation: "Paid leasing" */}
          <div>{splitToHundreds(item?.total_leasing_paid) || 0} сум</div>
        </div>
      </CardContent>
    </Card>
  );
}
