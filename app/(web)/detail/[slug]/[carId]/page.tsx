"use client";

import { ListingType } from "@/@types/api.type";
import NavBreadCrumb from "@/components/NavBreadCrumb";
import { getSingleListingQueryFn } from "@/lib/fetcher";
import { slugToCarName } from "@/lib/helper";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import CarHeader from "../../_components/car-header";
import CarCarousel from "../../_components/car-carousel";
import CarDetails from "../../_components/car-details";
import ShopInfo from "../../_components/shop-info";

const CarDetail = ({
  params,
}: {
  params: {
    slug: string;
    carId: string;
  };
}) => {
  const { slug, carId } = params;
  const carName = slugToCarName(slug);

  const { data, isPending, isError } = useQuery({
    queryKey: ["listing", carId],
    queryFn: () => getSingleListingQueryFn(carId),
  });

  const listing = data?.listing as ListingType;

  const breadcrumbItems = [
    { label: "Auto Hunt", href: "/" },
    { label: "Cars", href: "/search" },
    { label: carName },
  ];

  return (
    <main className="container mx-auto px-4 pt-3 pb-8">
      <div className="max-w-7xl mx-auto">
        <div className="space-y-3">
          <NavBreadCrumb {...{ breadcrumbItems }} />

          <CarHeader
            displayTitle={listing?.displayTitle}
            condition={listing?.condition}
            fuelType={listing?.fuelType}
            transmission={listing?.transmission}
            mileage={listing?.mileage || "0"}
            isPending={isPending || isError}
          />

          <div className="grid grid-cols-1 md:grid-cols-[1fr_340px] gap-2">
            <div className="pt-1">
              <CarCarousel
                imageUrls={listing?.imageUrls}
                isPending={isPending || isError}
              />

              <CarDetails listing={listing} isPending={isPending || isError} />
            </div>
            <div>
              <ShopInfo
                price={listing?.price}
                shopOwnerUserId={
                  listing?.shop?.userId || listing?.ownerId || ""
                }
                ownerName={listing?.ownerName || ""}
                ownerEmail={listing?.ownerEmail || ""}
                vehicleId={carId}
                vehicleTitle={listing?.displayTitle || ""}
                vehicleSlug={slug}
                type={listing?.type}
                isPending={isPending || isError}
              />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default CarDetail;
