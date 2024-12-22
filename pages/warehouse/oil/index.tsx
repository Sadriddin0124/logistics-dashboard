import { Button } from "@/components/ui/button";
import OilTable from "@/components/warehouse/oil/oil-table";
import Link from "next/link";
import React from "react";

const Fuel = () => {
  return (
    <div className=" container mx-auto">
      <div className="flex w-full justify-between gap-8">
        <Link
          href={"/warehouse/oil/oil-exchange"}
          className="flex justify-end my-4"
        >
          <Button className="bg-[#4880FF] text-white hover:bg-blue-600 w-[300px] rounded-md">
          Замена масла
          </Button>
        </Link>
        <div className="flex gap-8 items-center">
        <Link
          href={"/warehouse/oil/oil-recycled"}
          className="flex justify-end my-4"
        >
          <Button className="bg-[#4880FF] text-white hover:bg-blue-600 w-[300px] rounded-md">
          Переработанное масло
          </Button>
        </Link>
        <Link
          href={"/warehouse/oil/oil-create"}
          className="flex justify-end my-4"
        >
          <Button className="bg-[#4880FF] text-white hover:bg-blue-600 w-[300px] rounded-md">
          Добавить Масло
          </Button>
        </Link>
        </div>
      </div>
      <OilTable />
    </div>
  );
};

export default Fuel;
