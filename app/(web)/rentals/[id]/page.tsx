"use client";

import React from "react";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { getSingleRentalQueryFn } from "@/lib/fetcher";
import { Loader } from "lucide-react";
import RentalBookingSection from "@/components/rental/rental-booking-section";
import RentalDetailsSection from "@/components/rental/rental-details-section";

const RentalDetailPage = () => {
  const params = useParams();
  const rentalId = params.id as string;

  const { data: rental, isPending } = useQuery({
    queryKey: ["rental", rentalId],
    queryFn: () => getSingleRentalQueryFn(rentalId),
  });

  if (isPending) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!rental) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Vehicle not found
          </h1>
          <p className="text-gray-600">
            This vehicle is no longer available or does not exist.
          </p>
        </div>
      </div>
    );
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-8">
          {/* Détails du véhicule */}
          <div>
            <RentalDetailsSection rental={rental} />
          </div>

          {/* Section de réservation */}
          <div className="lg:sticky lg:top-20 h-fit">
            <RentalBookingSection rental={rental} />
          </div>
        </div>
      </div>
    </main>
  );
};

export default RentalDetailPage;
