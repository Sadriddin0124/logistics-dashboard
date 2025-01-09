"use client";

import FlightTable from "@/components/flight/flight-table";
import OrderedFlightTable from "@/components/flight/order-flight-table";
import React, { useState } from "react";

const Flight = () => {
  const [active, setActive] = useState("flight");

  return (
    <div className=" container mx-auto p-8 mt-8 bg-white rounded-2xl">
      
      {active === "flight" ? (
        <FlightTable
        isArchived={true}
          flightType={""}
          status={""}
          active={active}
          setActive={setActive}
        />
      ) : (
        <OrderedFlightTable active={active} setActive={setActive} isArchived={true}/>
      )}
    </div>
  );
};

export default Flight;
