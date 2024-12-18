import { Button } from "@/components/ui/button";
import GasTable from "@/components/warehouse/gas/gas-table";
import Link from "next/link";
import React from "react";

const Gas = () => {
  return (
    <div className=" container mx-auto">
      <div className="flex w-full justify-end gap-8">
        <Link
          href={"/warehouse/gas/gas-other"}
          className="flex justify-end my-4"
        >
          <Button className="bg-[#4880FF] text-white hover:bg-blue-600 w-[300px] rounded-md">
            Из других заправк
          </Button>
        </Link>
        <Link
          href={"/warehouse/gas/gas-info"}
          className="flex justify-end my-4"
        >
          <Button className="bg-[#4880FF] text-white hover:bg-blue-600 w-[300px] rounded-md">
            Добавить заправку
          </Button>
        </Link>
      </div>
      <GasTable />
    </div>
  );
};

export default Gas;
