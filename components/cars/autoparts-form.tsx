"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { X } from "lucide-react";
import { AutoPart } from "@/lib/types/cars.types";

export function AutoPartsForm() {
  const [part, setPart] = useState<AutoPart>({ name: "", id: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log("Submitted:", part);
    setPart({ name: "", id: "" });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Запчасти для автомобиля</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="flex flex-col">
          <div className="flex items-end gap-4">
            <div className="flex-1">
              <label className="text-sm mb-2 block">Название запчасти</label>
              <Input
                value={part.name}
                onChange={(e) => setPart({ ...part, name: e.target.value })}
                placeholder="Введите название запчасти..."
              />
            </div>
            <div className="flex-1 relative">
              <label className="text-sm mb-2 block">ID запчасти</label>
              <Input
                value={part.id}
                onChange={(e) => setPart({ ...part, id: e.target.value })}
                placeholder="Введите ID запчасти..."
              />
            </div>
            <Button variant="ghost" onClick={()=>setPart({id: "", name: ""})}><X/></Button>
          </div>
          <div className="flex gap-2 w-full justify-end mt-9">
            <Button
              type="button"
              className="bg-[#4880FF] text-white hover:bg-blue-600 w-[250px] rounded-md"
            >
              Добавить новую запчасть
            </Button>
            <Button
              type="submit"
              className="bg-[#4880FF] text-white hover:bg-blue-600 w-[200px] rounded-md"
            >
              Добавить
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
