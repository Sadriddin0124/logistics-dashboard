import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { type LucideIcon } from "lucide-react";
import { Button } from "../ui/button";
import { downloadExcelFile } from "@/lib/functions";
import { splitToHundreds } from "@/lib/utils";
import { ICars } from "@/lib/types/cars.types";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  url?: string;
  url2?: string;
  title2?: string;
  title3?: string;
  distance?: number;
  item: ICars
}

export function CarCard({
  title,
  value,
  icon: Icon,
  url,
  title2,
  distance,
  item
}: StatCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row finances-center justify-between space-y-0 pb-2">
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
          <div>{splitToHundreds(item?.price_uzs as number) || 0} сум</div>
        </div>
        <div className="flex justify-between w-full">
          <div className="text-md font-medium">Оплаченный лизинг</div> {/* Translation: "Paid leasing" */}
          <div>{splitToHundreds(item?.leasing_payed_amount) || 0} сум</div>
        </div>
        <div className="flex justify-between w-full">
          <div className="text-md font-medium">Пробег</div> {/* Translation: "Paid leasing" */}
          <div>{distance || 0} км</div>
        </div>
      </CardContent>
    </Card>
  );
}
