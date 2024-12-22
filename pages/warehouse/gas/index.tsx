import { Button } from "@/components/ui/button";
import GasTable from "@/components/warehouse/gas/gas-table";
import Link from "next/link";
import React from "react";

const Gas = () => {
  return (
    <div className=" container mx-auto">
      <div className="flex w-full justify-between gap-8">
        <Link
          href={"/warehouse/gas/gas-sold"}
          className="flex justify-end my-4"
        >
          <Button className="bg-[#4880FF] text-white hover:bg-blue-600 w-[300px] rounded-md">
          Подавать газ
          </Button>
        </Link>
        <div className="flex gap-8 items-center">
        <Link
          href={"/warehouse/gas/gas-other"}
          className="flex justify-end my-4"
        >
          <Button className="bg-[#4880FF] text-white hover:bg-blue-600 w-[300px] rounded-md">
            Из других заправк
          </Button>
        </Link>
        <Link
          href={"/warehouse/gas/gas-create"}
          className="flex justify-end my-4"
        >
          <Button className="bg-[#4880FF] text-white hover:bg-blue-600 w-[300px] rounded-md">
            Добавить заправку
          </Button>
        </Link>
        </div>
      </div>
      <GasTable />
    </div>
  );
};

export default Gas;
