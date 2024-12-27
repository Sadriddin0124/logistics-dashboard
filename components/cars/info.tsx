import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { formatDate } from "@/lib/functions";
import { ICars } from "@/lib/types/cars.types";
import { Car, Calendar, CreditCard } from "lucide-react";

export default function VehicleInfoCard({ car }: { car: ICars }) {
  return (
    <Card className="w-full container mx-auto rounded-2xl">
      <CardHeader>
        <CardTitle className="text-xl font-medium text-center">
          Информация о транспорте
        </CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-6 items-start">
        <div className="flex items-center space-x-4">
          <Car className="h-6 w-6 text-primary" />
          <div>
            <p className="text-sm font-medium">Пробег машины</p>
            <p className="text-xl font-medium">{car?.distance_travelled} км</p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <Car className="h-6 w-6 text-primary" />
          <div>
            <p className="text-sm font-medium">
              Следующий пробег для замены масла
            </p>
            <p className="text-xl font-medium">{car?.next_oil_recycle_distance} км</p>
          </div>
        </div>
        <Separator className="col-span-2" />
        <div className="flex items-center space-x-4">
          <Car className="h-6 w-6 text-primary" />
          <div>
            <p className="text-sm font-medium">Марка машины</p>
            <p className="text-xl font-medium">{car?.models?.name}</p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <Car className="h-6 w-6 text-primary" />
          <div>
            <p className="text-sm font-medium">Тип топлива машины</p>
            <p className="text-xl font-medium">{car?.fuel_type === "GAS" ? "Газ" : "Дизель"}</p>
          </div>
        </div>
        <Separator className="col-span-2" />

        <div className="flex items-center space-x-4">
          <Calendar className="h-6 w-6 text-primary" />
          <div>
            <p className="text-sm font-medium">Дата следующего обслуживания</p>
            <p className="text-xl font-medium">
              {formatDate(car?.updated_at as string, "/")}
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <CreditCard className="h-6 w-6 text-primary" />
            <p className="text-lg font-semibold">Информация о покупки</p>
          </div>
          <div className="pl-8 space-y-1">
            <p>
              <span className="font-medium">Тип оплаты:</span>{" "}
              {car?.type_of_payment === "CASH" ? "NALICHNIY" : "LIZING"}
            </p>
            {car?.type_of_payment !== "CASH" && <p>
              <span className="font-medium">Срок лизинга:</span>{" "}
              {car?.leasing_period} месяцев
            </p>}
            {car?.type_of_payment !== "CASH" && <p>
              <span className="font-medium">Ежемесячный платеж:</span>{" "}
              {car?.monthly_payment}
            </p>}
            {car?.type_of_payment !== "CASH" && <p>
              <span className="font-medium">Сумма оплаченных денег:</span>{" "}
              {car?.leasing_payed_amount}
            </p>}
          
            
            <p>
              <span className="font-medium">Оставшаяся сумма:</span>{" "}
              {(Number(car?.price_uzs) || 0) - (Number(car?.leasing_payed_amount) || 0)} сум
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
