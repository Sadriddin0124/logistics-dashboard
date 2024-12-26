"use client";

import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Salary from "@/components/expenses/salary";
import RepairingForm from "@/components/expenses/repairing";
import { useRouter } from "next/router";
import FlightForm from "@/components/expenses/flight";
import OtherExpenseForm from "@/components/expenses/other";
import { OldPartsForm } from "@/components/expenses/add-old-part";
import LeasingForm from "@/components/expenses/leasing";

const Repairing = () => {
  const router = useRouter();
  const { pathname, push } = router;
  const id = router?.query?.id;
  const handleSelect = (value: string) => {
    push(`/${pathname}?id=${value}`);
  };
  const components = [
    {
      id: "PAY_SALARY",
      component: <Salary />,
    },
    {
      id: "FIX_CAR",
      component: <RepairingForm />,
    },
    {
      id: "FLIGHT",
      component: <FlightForm />,
    },
    {
      id: "OTHER",
      component: <OtherExpenseForm />,
    },
    {
      id: "LEASING",
      component: <LeasingForm />,
    },
  ];
  return (
    <div className="container mx-auto">
      <div className="bg-white rounded-2xl p-8 flex flex-col gap-4">
        <div className="w-[50%]">
          <Select onValueChange={handleSelect} value={id as string}>
            <SelectTrigger>
              <SelectValue placeholder="Выберите тип расходов..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="PAY_SALARY">Оплата</SelectItem>
              <SelectItem value="FIX_CAR">Ремонт автомобиля.</SelectItem>
              <SelectItem value="FLIGHT">Рейс</SelectItem>
              <SelectItem value="OTHER">Общий</SelectItem>
              <SelectItem value="LEASING">Лизинг</SelectItem>
            </SelectContent>
          </Select>
        </div>
        {components
          ?.filter((component) => component?.id === (id as string))
          ?.map((component, index) => {
            return <div key={index}>{component?.component}</div>;
          })}
      </div>
      <div className="mt-8">
        {id === "FIX_CAR" && <OldPartsForm />}
      </div>
    </div>
  );
};

export default Repairing;
