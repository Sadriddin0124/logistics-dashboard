import { AutoPartsDelete } from "@/components/auto-parts/auto-parts-delete";
import AutoPartsTable from "@/components/auto-parts/autoparts-table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import React, { useState } from "react";

const AutoParts = () => {
  const [selectedParts, setSelectedParts] = React.useState<string[]>([]);
  const [status, setStatus] = useState("");
  const handleSelect = (value: string) => {
    if (value === ".") {
      setStatus("");
    } else {
      setStatus(value);
    }
  };
  return (
    <div className="p-8 rounded-2xl mt-8 bg-white mx-auto container min-h-screen">
      <div className="mb-4 flex items-center w-full justify-end gap-8">
        <div className="max-w-[300px] w-full">
          <Select onValueChange={handleSelect} defaultValue=".">
            <SelectTrigger>
              <SelectValue placeholder="Выберите тип расходов..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value=".">Все</SelectItem>
              <SelectItem value="true">В Склате</SelectItem>
              <SelectItem value="false">Не в машине</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <AutoPartsDelete id={selectedParts} />
      </div>
      <AutoPartsTable
        setSelectedParts={setSelectedParts}
        selectedParts={selectedParts}
        status={status}
      />
    </div>
  );
};

export default AutoParts;
