"use client";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  CAR_BRAND_OPTIONS,
  CAR_CONDITION_OPTIONS,
  CAR_FUELTYPE_OPTIONS,
  CAR_MODEL_OPTIONS,
  CAR_PRICE_RANGE_OPTIONS,
} from "@/constants/car-options";
import { Search, Car, Fuel, DollarSign, Settings2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

interface FilterOption {
  label: string;
  value: string;
}

interface FilterSelectProps {
  label: string;
  options: FilterOption[];
  placeholder: string;
  onChange: (value: string) => void;
  icon?: React.ReactNode;
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
    router.push(`/search?${params.toString()}`);
  };

  return (
    <div className="w-full flex flex-col gap-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <FilterSelect
          label="Marque"
          options={filterOptions.brands}
          placeholder="Sélectionner une marque"
          onChange={(value) => handleFilterChange("brand", value)}
          icon={<Car className="size-4 text-muted-foreground" />}
        />

        <FilterSelect
          label="Modèle"
          options={filterOptions.models}
          placeholder="Sélectionner un modèle"
          onChange={(value) => handleFilterChange("model", value)}
          icon={<Settings2 className="size-4 text-muted-foreground" />}
        />

        <FilterSelect
          label="État"
          options={filterOptions.conditions}
          placeholder="Neuf ou occasion"
          onChange={(value) => handleFilterChange("condition", value)}
          icon={<Settings2 className="size-4 text-muted-foreground" />}
        />

        <FilterSelect
          label="Carburant"
          options={filterOptions.fuelTypes}
          placeholder="Type de carburant"
          onChange={(value) => handleFilterChange("fuelType", value)}
          icon={<Fuel className="size-4 text-muted-foreground" />}
        />

        <FilterSelect
          label="Budget"
          options={filterOptions.priceRange}
          placeholder="Fourchette de prix"
          onChange={(value) => handleFilterChange("price", value)}
          icon={<DollarSign className="size-4 text-muted-foreground" />}
        />
      </div>

      <Button
        onClick={handleSearch}
        size="lg"
        className="w-full h-12 text-base font-semibold gap-2 shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300"
      >
        <Search className="size-5" />
        Rechercher
      </Button>

      <p className="text-muted-foreground text-sm text-center">
        Besoin de filtres plus précis ?{" "}
        <Link
          href="/search"
          className="text-primary hover:text-primary/80 underline underline-offset-4 font-medium transition-colors"
        >
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
  icon,
}) => {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
        {label}
      </label>
      <Select onValueChange={onChange}>
        <SelectTrigger className="w-full h-11 bg-secondary/50 border-border/50 hover:bg-secondary hover:border-primary/20 transition-all duration-200">
          <div className="flex items-center gap-2 overflow-hidden">
            <span className="shrink-0">{icon}</span>
            <SelectValue
              placeholder={placeholder}
              className="truncate text-left"
            />
          </div>
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel className="text-xs uppercase tracking-wide text-muted-foreground">
              {label}
            </SelectLabel>
            {options?.map((option) => (
              <SelectItem
                key={option.value}
                value={option.value}
                className="cursor-pointer"
              >
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
