import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { CAR_CONDITION_OPTIONS } from "@/constants/car-options";
import { CogIcon, FuelIcon, GaugeIcon, Tag } from "lucide-react";
import React from "react";

type CarHeaderProps = {
  displayTitle: string;
  condition: string;
  fuelType: string;
  transmission: string;
  mileage: string;
  isPending: boolean;
};

const CarHeader = ({
  displayTitle,
  condition,
  fuelType,
  transmission,
  mileage,
  isPending,
}: CarHeaderProps) => {
  const conditionLabel = CAR_CONDITION_OPTIONS.find(
    (opt) => opt.value === condition
  )?.label;

  return (
    <div>
      <div className="mb-3">
        <h1 className="text-[32px] capitalize font-bold">
          {isPending ? <Skeleton className="h-8 w-1/2" /> : displayTitle}
        </h1>
      </div>
      {isPending ? (
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <Skeleton className="h-4 w-14" />
          <Skeleton className="h-4 w-14" />
          <Skeleton className="h-4 w-14" />
        </div>
      ) : (
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <Badge
            variant="outline"
            className="border-primary gap-1.5 text-[11px] capitalize !font-medium py-[3px] px-2"
          >
            <FuelIcon className="size-3" />
            {fuelType?.toLowerCase()}
          </Badge>

          <Badge
            variant="outline"
            className="border-primary gap-1.5 text-[11px] capitalize !font-medium py-[3px] px-2"
          >
            <GaugeIcon className="size-3" />
            {mileage} mpg
          </Badge>

          <Badge
            variant="outline"
            className="border-primary gap-1.5 text-[11px] capitalize !font-medium py-[3px] px-2"
          >
            <Tag className="size-3" />
            {conditionLabel}
          </Badge>

          <Badge
            variant="outline"
            className="border-primary gap-1.5 text-[11px] capitalize !font-medium py-[3px] px-2"
          >
            <CogIcon className="size-3" />
            {transmission?.toLowerCase()}
          </Badge>
        </div>
      )}
    </div>
  );
};

export default CarHeader;
