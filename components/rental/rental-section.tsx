"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { getAllRentalsQueryFn } from "@/lib/fetcher";
import { Loader } from "lucide-react";
import RentalCard from "./rental-card";

const RentalSection = () => {
  const { data: rentals, isPending } = useQuery({
    queryKey: ["rentals"],
    queryFn: getAllRentalsQueryFn,
  });

  if (isPending) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!rentals || rentals.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">
          Aucun véhicule disponible pour le moment
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-gray-600">
          {rentals.length} véhicule{rentals.length > 1 ? "s" : ""} disponible
          {rentals.length > 1 ? "s" : ""}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {rentals.map((rental: any) => (
          <RentalCard key={rental.$id} rental={rental} />
        ))}
      </div>
    </div>
  );
};

export default RentalSection;
