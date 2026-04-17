"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import { Fuel, Gauge, Users, Settings } from "lucide-react";

interface RentalCardProps {
  rental: any;
}

const RentalCard = ({ rental }: RentalCardProps) => {
  const router = useRouter();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("fr-MG").format(price);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "available":
        return <Badge className="bg-green-500">Disponible</Badge>;
      case "rented":
        return <Badge className="bg-orange-500">Loué</Badge>;
      case "maintenance":
        return <Badge className="bg-gray-500">En maintenance</Badge>;
      default:
        return null;
    }
  };

  return (
    <Card
      className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
      onClick={() => router.push(`/rentals/${rental.$id}`)}
    >
      <div className="relative h-48 bg-gray-200">
        {rental.imageUrls && rental.imageUrls.length > 0 ? (
          <img
            src={rental.imageUrls[0]}
            alt={rental.displayTitle}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            No image
          </div>
        )}
        <div className="absolute top-2 right-2">
          {getStatusBadge(rental.rentalStatus)}
        </div>
      </div>

      <CardContent className="p-4">
        <h3 className="font-semibold text-lg mb-2 line-clamp-1">
          {rental.displayTitle}
        </h3>

        <div className="flex items-baseline gap-1 mb-3">
          <span className="text-2xl font-bold text-primary">
            {formatPrice(rental.dailyRentalPrice)} Ar
          </span>
          <span className="text-sm text-gray-500">/ jour</span>
        </div>

        <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <Fuel className="w-4 h-4" />
            <span className="capitalize">{rental.fuelType}</span>
          </div>
          <div className="flex items-center gap-1">
            <Settings className="w-4 h-4" />
            <span className="capitalize">{rental.transmission}</span>
          </div>
          <div className="flex items-center gap-1">
            <Gauge className="w-4 h-4" />
            <span>{formatPrice(rental.currentMileage || 0)} km</span>
          </div>
          {rental.seatingCapacity && (
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              <span>{rental.seatingCapacity} places</span>
            </div>
          )}
        </div>

        {rental.minimumRentalDays && (
          <div className="mt-3 pt-3 border-t text-xs text-gray-500">
            Location minimale : {rental.minimumRentalDays} jour
            {rental.minimumRentalDays > 1 ? "s" : ""}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RentalCard;
