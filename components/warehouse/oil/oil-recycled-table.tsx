"use client";

import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
// import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
// import { queryClient } from "@/components/ui-items/ReactQueryProvider";
import { useRouter } from "next/router";
import { IOilExchangedList } from "@/lib/types/oil.types";
import { fetchOilExchange } from "@/lib/actions/oil.action";

export default function RecycledOilTable() {
  // const [currentPage, setCurrentPage] = useState<number>(1);
  const id = useRouter()?.query.id;
  const { data: exchanged } = useQuery<IOilExchangedList>({
    queryKey: ["exchanged"],
    queryFn: () => fetchOilExchange(id as string,),
    enabled: !!id,
  });
  // useEffect(() => {
  //   queryClient.prefetchQuery({
  //     queryKey: ["exchanged", id, currentPage + 1],
  //     queryFn: () => fetchOilExchange(id as string, currentPage + 1),
  //   });
  // }, [currentPage, id]);

  // const itemsPerPage = 10;
  // const indexOfLastOrder = currentPage * itemsPerPage;
  // const indexOfFirstOrder = (currentPage - 1) * itemsPerPage;

  // const totalPages = Math.ceil((exchanged?.count as number) / itemsPerPage);

  // const handlePageChange = (page: number) => {
  //   if (page >= 1 && page <= totalPages) {
  //     setCurrentPage(page);
  //   }
  // };

  // const getPaginationButtons = () => {
  //   const buttons: (number | string)[] = [];
  //   if (totalPages <= 1) return buttons;
  //   buttons.push(1);
  //   if (currentPage > 3) {
  //     buttons.push("...");
  //   }
  //   for (
  //     let i = Math.max(2, currentPage - 1);
  //     i <= Math.min(totalPages - 1, currentPage + 1);
  //     i++
  //   ) {
  //     buttons.push(i);
  //   }
  //   if (currentPage < totalPages - 2) {
  //     buttons.push("...");
  //   }
  //   buttons.push(totalPages);
  //   return buttons;
  // };
  // const buttons = getPaginationButtons();

  return (
    <div className="w-full mx-auto bg-white py-8 rounded-2xl min-h-[50vh]">
      <Table>
        <TableHeader className="font-bold">
          <TableRow className="border-b border-gray-200">
            <TableHead className="font-bold">T/R</TableHead>
            <TableHead className="font-bold">Машина</TableHead>
                <TableHead className="font-bold">Количество</TableHead>
                <TableHead className="font-bold">
                  Последний дата заменa
                </TableHead>
                {/* <TableHead className="font-bold">
                  Следующая дата замены
                </TableHead> */}
                <TableHead className="font-bold"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {exchanged?.recycles?.map((exchanged, index) => (
            <TableRow key={exchanged.id} className="border-b border-gray-200">
              <TableCell>{index + 1}</TableCell>
              <TableCell>
                {exchanged.car}
              </TableCell>
              <TableCell>{exchanged?.remaining_oil}</TableCell>
              <TableCell>
                {exchanged?.updated_at?.slice(0,10)}
              </TableCell>
              {/* <TableCell>
                {exchanged?.remaining_oil}
              </TableCell> */}
              <TableCell>
                <Button
                  variant="secondary"
                  className="bg-red-100 hover:bg-red-200 text-red-600"
                >
                  Заменён
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {/* <div className="mt-4 flex justify-between items-center">
        <div>
          {exchanged?.count} ta Zapravkalardan {indexOfFirstOrder + 1} dan{" "}
          {Math.min(indexOfLastOrder, exchanged?.count as number)}
        </div>
        <div className="flex space-x-2 items-center">
          <Button
            variant="outline"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="w-10 h-10 p-0"
          >
            <ChevronLeftIcon className="w-4 h-4" />
            <span className="sr-only">Previous page</span>
          </Button>
          {buttons.map((button, index) =>
            button === "..." ? (
              <span key={index} style={{ margin: "0 5px" }}>
                ...
              </span>
            ) : (
              <Button
                key={index}
                onClick={() => handlePageChange(button as number)}
                disabled={button === currentPage}
                className={
                  button === currentPage ? "bg-[#4880FF] text-white" : "border"
                }
                variant={button === currentPage ? "default" : "ghost"}
              >
                {button || ""}
              </Button>
            )
          )}
          <Button
            variant="outline"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="w-10 h-10 p-0"
          >
            <ChevronRightIcon className="w-4 h-4" />
            <span className="sr-only">Next page</span>
          </Button>
        </div>
      </div> */}
    </div>
  );
}
