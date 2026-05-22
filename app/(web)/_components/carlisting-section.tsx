"use client";

import { ListingType } from "@/@types/api.type";
import CarCard from "@/components/CarCard";
import EmptyState from "@/components/EmptyState";
import CarListingSkeleton from "@/components/skeleton-loader/carlisting-skeleton";
import { CAR_BRAND_OPTIONS } from "@/constants/car-options";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getAllCarListingQueryFn } from "@/lib/fetcher";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, Car, Sparkles } from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";

const BRANDS = [
  { value: "all", label: "Toutes" },
  ...CAR_BRAND_OPTIONS.slice(0, 8),
];

const CarListing = () => {
  const [active, setActive] = useState(BRANDS[0]?.value);

  const { data, isPending } = useQuery({
    queryKey: ["group-by-brand", active],
    queryFn: () =>
      getAllCarListingQueryFn({
        brand: active !== "all" ? [active] : [],
      }),
    staleTime: 0,
  });

  const listings: ListingType[] = data?.listings || [];

  return (
    <section className="w-full py-12 lg:py-20 bg-background">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
          <div className="space-y-2">
            <Badge
              variant="secondary"
              className="px-3 py-1 text-xs font-medium bg-primary/10 text-primary border-0"
            >
              <Car className="size-3 mr-1.5" />
              Catalogue
            </Badge>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground text-balance">
              Nos vehicules <span className="text-primary">disponibles</span>
            </h2>
            <p className="text-muted-foreground max-w-md text-pretty">
              Decouvrez notre selection de vehicules soigneusement choisis pour
              vous.
            </p>
          </div>
          <Link href="/search" className="hidden sm:block">
            <Button variant="outline" className="gap-2 group">
              Voir tout le catalogue
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>

        {/* Brand Filter Tabs */}
        <div className="relative mb-8">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0">
            {BRANDS.map((item, index) => (
              <button
                disabled={isPending}
                key={index}
                className={cn(
                  "relative px-4 py-2.5 text-sm font-medium rounded-full transition-all duration-200 whitespace-nowrap",
                  "hover:bg-secondary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
                  item.value === active
                    ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                    : "bg-secondary/50 text-muted-foreground hover:text-foreground",
                  isPending && "pointer-events-none opacity-50",
                )}
                onClick={() => setActive(item.value)}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* Car Grid */}
        {isPending ? (
          <CarListingSkeleton
            className="grid grid-cols-1 min-[500px]:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6"
            layout="grid"
          />
        ) : listings?.length === 0 ? (
          <EmptyState message="Aucun vehicule disponible." />
        ) : (
          <div className="grid grid-cols-1 min-[500px]:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {listings?.map((listing) => (
              <CarCard key={listing.$id} listing={listing} layout="grid" />
            ))}
          </div>
        )}

        {/* View More Button */}
        <div className="flex justify-center mt-10">
          <Link href="/search">
            <Button
              size="lg"
              className="h-12 px-8 text-base font-semibold gap-2 shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300"
            >
              <Sparkles className="size-4" />
              Explorer tous les vehicules
              <ArrowRight className="size-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CarListing;
