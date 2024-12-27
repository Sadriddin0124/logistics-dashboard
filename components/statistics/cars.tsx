import { fetchCarInfo } from "@/lib/actions/stats.ction";
import { ICars } from "@/lib/types/cars.types";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import { Download } from "lucide-react";
import { CarCard } from "./car-stats";

const Cars = () => {
  const { data: car_info } = useQuery<ICars[]>({
    queryKey: ["car_info"],
    queryFn: fetchCarInfo,
  });
  return (
    <div className="mt-4">
      <div className="grid grid-cols-1 gap-4">
        {car_info?.map((item, index) => {
          return (
            <CarCard
              key={index}
              icon={Download}
              url={`/cars/car-infos/${item?.id}`}
              url2="/gas/gaz-info/?type=sale"
              item={item}
            />
          );
        })}
      </div>
    </div>
  );
};

export default Cars;
