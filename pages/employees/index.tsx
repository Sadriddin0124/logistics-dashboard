import EmployeesTable from "@/components/employees/employees-table";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";

const Employees = () => {
  return (
    <div>
      <div className=" container mx-auto flex w-full justify-end gap-8">
        <Link href={"/employees/employees-create"} className="flex justify-end my-4">
          <Button className="bg-[#4880FF] text-white hover:bg-blue-600 w-[300px] rounded-md">
            Добавить сотрудника
          </Button>
        </Link>
      </div>
      <EmployeesTable />
    </div>
  );
};

export default Employees;
