"use client";

import NavBreadCrumb from "@/components/NavBreadCrumb";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import React, { useState } from "react";
import Filters from "./filters";
import AllListings from "./all-listing";
import { useQuery } from "@tanstack/react-query";
import useFilter from "@/hooks/use-filter";
import { getAllCarListingQueryFn } from "@/lib/fetcher";

const SearchContent = () => {
  const { filters } = useFilter();

  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  const { data, isPending } = useQuery({
    queryKey: [
      "all-cars",
      filters.brand,
      filters.model,
      filters.color,
      filters.price,
      filters.yearMin,
      filters.yearMax,
      filters.fuelType,
      filters.condition,
      filters.keyword,
    ],

    queryFn: () =>
      getAllCarListingQueryFn({
        brand: filters.brand,
        model: filters.model,
        color: filters.color,
        condition: filters.condition,
        keyword: filters.keyword,
        price: filters.price,
        year_min: filters.yearMin,
        year_max: filters.yearMax,
        fuelType: filters.fuelType,
      }),
  });

  const listings = data?.listings || [];

  const breadcrumbItems = [
    {
      label: "Auto Hunt",
      href: "/",
    },
    { label: `${listings?.length || 0} résultats trouvés` },
  ];

  const onFilterOpen = () => {
    setIsFiltersOpen(true);
  };

  return (
    <div className="space-y-3">
      <NavBreadCrumb breadcrumbItems={breadcrumbItems} />

      <div className="grid grid-cols-1 lg:grid-cols-4  gap-6 m">
        <div className="lg:hidden">
          <Sheet open={isFiltersOpen} onOpenChange={setIsFiltersOpen}>
            <SheetContent
              side="left"
              className="w-[300px] !p-0 sm:w-[400px] overflow-y-auto"
            >
              <Filters />
            </SheetContent>
          </Sheet>
        </div>

        <div className="hidden lg:block col-span-1">
          <Filters />
        </div>

        <div className="col-span-1 lg:col-span-3">
          <AllListings
            listings={listings}
            isPending={isPending}
            onFilterOpen={onFilterOpen}
          />
        </div>
      </div>
    </div>
  );
};

export default SearchContent;
