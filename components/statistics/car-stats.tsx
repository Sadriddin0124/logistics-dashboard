import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { type LucideIcon } from "lucide-react";
import { Button } from "../ui/button";
import { downloadExcelFile } from "@/lib/functions";
import { ICars } from "@/lib/types/cars.types";

interface StatCardProps {
  icon: LucideIcon;
  url?: string;
  url2?: string;
  item: ICars
}

export function CarCard({
  icon: Icon,
  item,
}: StatCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row finances-center justify-between space-y-0 pb-2">
        <CardTitle className="font-medium">{`${item?.name} ${item?.models?.name}`}</CardTitle>
          <Button
            variant={"ghost"}
            size={"sm"}
            onClick={() => downloadExcelFile(`/cars/car-infos/${item?.id}`, "информация об автомобиле")}
          >
            <Icon />
          </Button>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between w-full">
          <div className="text-md font-medium">{item?.number}</div>
            <div>
            {/* <Button
              variant={"ghost"}
              size={"sm"}
              onClick={() => downloadExcelFile(`/gas/gaz-info/?type=another&car_id=${item?.id}`)}
            >
              {item?.fuel_type === "GAS" ? "Газ" : "Солярка"} Translation: "Download" = "Загрузить"
            </Button> */}
            <Button
              variant={"ghost"}
              size={"sm"}
              onClick={() => downloadExcelFile(`/gas/gaz-info/?type=another&car_id=${item?.id}`, "информация о добыче газа")}
            >
              {item?.fuel_type === "GAS" ? "Газ" : "Солярка"} {/* Translation: "Download" = "Загрузить" */}
            </Button>
            </div>
        </div>
        <div className="flex justify-between w-full">
          <div className="text-md font-medium">Баланс лизинга</div> {/* Translation: "Leasing Balance" */}
          <div>{(item?.price_uzs as number).toFixed(2) || 0} $</div>
        </div>
        <div className="flex justify-between w-full">
          <div className="text-md font-medium">Оплаченный лизинг</div> {/* Translation: "Paid leasing" */}
          <div>{(item?.leasing_payed_amount as number).toFixed(2) || 0} $</div>
        </div>
        <div className="flex justify-between w-full">
          <div className="text-md font-medium">Пробег</div> {/* Translation: "Paid leasing" */}
          <div>{item?.distance_travelled || 0} км</div>
        </div>
      </CardContent>
    </Card>
  );
}
