import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { IDieselTypeForPagination } from "@/lib/types/diesel.types";
const PurchasedDiesel = ({ data }: { data: IDieselTypeForPagination[] }) => {
  return (
    <div>
      
          <Table>
            <TableHeader className="font-bold">
              <TableRow className="border-b border-b-gray-300">
                <TableHead className="font-bold">Машина</TableHead>
                <TableHead className="font-bold">Количество</TableHead>
                <TableHead className="font-bold">Цена</TableHead>
                <TableHead className="font-bold">Date</TableHead>
                <TableHead className="font-bold"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.length > 0 ? (
                data.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">
                      {item?.car?.name}
                    </TableCell>
                    <TableCell>{item?.volume}</TableCell>
                    <TableCell>
                      {item?.price_uzs} сум
                    </TableCell>
                    <TableCell>
                      {item?.created_at?.slice(0,10)} 
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="secondary"
                        className="bg-green-100 hover:bg-green-200 text-green-600"
                      >
                        Куплено
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center">
                    Нет данных
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
    </div>
  );
};

export default PurchasedDiesel;
