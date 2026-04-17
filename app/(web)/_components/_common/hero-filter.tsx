"use client";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectValue,
} from "@/components/ui/select";
import {
  CAR_BRAND_OPTIONS,
  CAR_CONDITION_OPTIONS,
  CAR_FUELTYPE_OPTIONS,
  CAR_MODEL_OPTIONS,
  CAR_PRICE_RANGE_OPTIONS,
} from "@/constants/car-options";
import { SelectTrigger } from "@radix-ui/react-select";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { use, useState } from "react";

interface FilterOption {
  label: string;
  value: string;
}

interface FilterSelectProps {
  label: string;
  options: FilterOption[];
  placeholder: string;
  onChange: (value: string) => void;
  className?: string;
}

const HeroFilter = () => {
  const router = useRouter();

  const [selectedFilters, setSelectedFilters] = useState<{
    brand?: string;
    condition?: string;
    model?: string;
    fuelType?: string;
    price?: string;
  }>({});

  const filterOptions: Record<string, FilterOption[]> = {
    brands: CAR_BRAND_OPTIONS,
    conditions: CAR_CONDITION_OPTIONS,
    models: CAR_MODEL_OPTIONS,
    fuelTypes: CAR_FUELTYPE_OPTIONS,
    priceRange: CAR_PRICE_RANGE_OPTIONS.filter(
      (item) => item.value !== "custom",
    ),
  };

  const handleFilterChange = (
    key: keyof typeof selectedFilters,
    value: string,
  ) => {
    setSelectedFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSearch = () => {
    const params = new URLSearchParams();
    Object.entries(selectedFilters).forEach(([key, value]) => {
      if (value) {
        params.append(key, value);
      }
    });
    console.log(params);
    router.push(`/search?${params.toString()}`);
  };

  return (
    <div className="w-full flex flex-col gap-6 pt-6">
      <div className="w-full flex flex-wrap items-center justify-center gap-4">
        <FilterSelect
          label="Brand"
          options={filterOptions.brands}
          placeholder="Marque"
          onChange={(value) => handleFilterChange("brand", value)}
        />

        <FilterSelect
          label="Model"
          options={filterOptions.models}
          placeholder="Modèle"
          onChange={(value) => handleFilterChange("model", value)}
        />

        <FilterSelect
          label="Condition"
          options={filterOptions.conditions}
          placeholder="Condition"
          onChange={(value) => handleFilterChange("condition", value)}
        />

        <FilterSelect
          label="Fuel"
          options={filterOptions.fuelTypes}
          placeholder="Carburant"
          onChange={(value) => handleFilterChange("fuelType", value)}
        />

        <FilterSelect
          label="Price"
          options={filterOptions.priceRange}
          placeholder="Prix"
          onChange={(value) => handleFilterChange("price", value)}
        />
      </div>

      <Button onClick={handleSearch}>
        Rechercher
        <ChevronRight />
      </Button>

      <p className="text-muted-foreground text-sm text-center">
        Vous souhaitez affiner votre recherche?{" "}
        <Link href="/search" className="text-primary underline font-bold mt-2">
          Recherche avancée
        </Link>
      </p>
    </div>
  );
};
const FilterSelect: React.FC<FilterSelectProps> = ({
  label,
  options,
  placeholder,
  onChange,
  className,
}) => {
  return (
    <div className={`w-full lg:w-[28%] ${className ? ` ${className}` : ""}`}>
      <Select onValueChange={onChange}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>{label}</SelectLabel>
            {options?.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
};

export default HeroFilter;
