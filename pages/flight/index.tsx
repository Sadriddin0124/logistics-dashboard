"use client";

import FlightTable from "@/components/flight/flight-table";
import OrderedFlightTable from "@/components/flight/order-flight-table";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Link from "next/link";
import React, { useState } from "react";

const Flight = () => {
  const [active, setActive] = useState("flight");
  const [status, setStatus] = useState("");
  const [flightType, setFlightType] = useState("");

  const handleSelect = (value: string, type: string) => {
    if (type === "status") {
      setStatus(value);
    }
    if (type === "type") {
      setFlightType(value);
    }
    if (value === ".") {
      setFlightType("");
      setStatus("");
    }
  };
  return (
    <div className=" container mx-auto p-8 mt-8 bg-white rounded-2xl">
      <div className="flex gap-4 w-full items-end">
        {active === "flight" && (
          <div className="flex justify-start gap-4 w-full">
            <div className="space-y-2 w-[30%]">
              <label className="text-sm font-medium">Статус</label>
              <Select onValueChange={(value) => handleSelect(value, "status")}>
                <SelectTrigger>
                  <SelectValue placeholder="Выберите..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value=".">Все</SelectItem>
                  <SelectItem value={"ACTIVE"}>Активный</SelectItem>
                  <SelectItem value={"INACTIVE"}>Завершенный</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2 w-[30%]">
              <label className="text-sm font-medium">Где это</label>
              <Select onValueChange={(value) => handleSelect(value, "type")}>
                <SelectTrigger>
                  <SelectValue placeholder="Выберите..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value=".">Все</SelectItem>
                  <SelectItem value="OUT">За территории Узбекистана</SelectItem>
                  <SelectItem value="IN_UZB">
                    На территории Узбекистана
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )}
      </div>
      <div className="flex w-full justify-end gap-8">
        <Link href={"/flight/archived"} className="flex justify-end my-4">
          <Button className="bg-[#4880FF] text-white hover:bg-blue-600 w-[300px] rounded-md">
            Архив
          </Button>
        </Link>
        <Link href={"/flight/flight-order"} className="flex justify-end my-4">
          <Button className="bg-[#4880FF] text-white hover:bg-blue-600 w-[300px] rounded-md">
            Добавить рейс на заказ
          </Button>
        </Link>
        <Link href={"/flight/flight-create"} className="flex justify-end my-4">
          <Button className="bg-[#4880FF] text-white hover:bg-blue-600 w-[300px] rounded-md">
            Добавить рейс
          </Button>
        </Link>
      </div>
      {active === "flight" ? (
        <FlightTable
          isArchived={false}
          flightType={flightType}
          status={status}
          active={active}
          setActive={setActive}
        />
      ) : (
        <OrderedFlightTable
          active={active}
          setActive={setActive}
          isArchived={false}
        />
      )}
    </div>
  );
};

export default Flight;
