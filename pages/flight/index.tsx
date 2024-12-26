"use client";

import FlightTable from "@/components/flight/flight-table";
import OrderedFlightTable from "@/components/flight/order-flight-table";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import React, { useState } from "react";

const Flight = () => {
  const [active, setActive] = useState("flight");
  return (
    <div className=" container mx-auto p-8 mt-8 bg-white rounded-2xl">
      <div className="flex w-full justify-end gap-8">
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
      {active === "flight" ? <FlightTable active={active} setActive={setActive}/> : <OrderedFlightTable  active={active} setActive={setActive}/>}
    </div>
  );
};

export default Flight;
