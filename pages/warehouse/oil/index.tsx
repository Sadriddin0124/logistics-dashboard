import { Button } from "@/components/ui/button";
import OilTable from "@/components/warehouse/oil/oil-table";
import Link from "next/link";
import React from "react";

const Fuel = () => {
  return (
    <div className=" container mx-auto">
      <div className="flex w-full justify-end gap-8">
        <Link
          href={"/warehouse/oil/oil-recycled"}
          className="flex justify-end my-4"
        >
          <Button className="bg-[#4880FF] text-white hover:bg-blue-600 w-[300px] rounded-md">
          Переработанное масло
          </Button>
        </Link>
        <Link
          href={"/warehouse/oil/oil-info"}
          className="flex justify-end my-4"
        >
          <Button className="bg-[#4880FF] text-white hover:bg-blue-600 w-[300px] rounded-md">
          Добавить Масло
          </Button>
        </Link>
      </div>
      <OilTable />
    </div>
  );
};

export default Fuel;
