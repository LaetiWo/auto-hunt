"use client";

import FilterAccordionItem from "@/components/FilterAccordionItem";
import { Accordion } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  CAR_BRAND_OPTIONS,
  CAR_COLOR_OPTIONS,
  CAR_CONDITION_OPTIONS,
  CAR_FUELTYPE_OPTIONS,
  CAR_MODEL_OPTIONS,
  CAR_TRANSMISSION_OPTIONS,
} from "@/constants/car-options";
import useFilter from "@/hooks/use-filter";
import React, { useMemo } from "react";
import { Separator } from "@/components/ui/separator";
import { Combobox } from "@/components/ui/combobox";
import { Label } from "@/components/ui/label";

const Filters = () => {
  const { filters, updateFilter, clearFilters } = useFilter();

  // Handle Brand Change
  const handleBrandChange = (value: string) => {
    updateFilter("brand", value ? [value] : []);
    // Clear model when brand changes to avoid invalid combinations
    updateFilter("model", []);
  };

  // Filter models based on selected brand
  const filteredModelOptions = useMemo(() => {
    if (!filters.brand || filters.brand.length === 0) {
      return CAR_MODEL_OPTIONS;
    }
    return CAR_MODEL_OPTIONS.filter((model) =>
      filters.brand.includes(model.key),
    );
  }, [filters.brand]);

  // Handle Price Change
  const priceRange = useMemo(() => {
    if (!filters.price) return { min: "", max: "" };
    const [min, max] = filters.price.split("-");
    return { min: min || "", max: max || "" };
  }, [filters.price]);

  const updatePrice = (min: string, max: string) => {
    updateFilter("price", `${min}-${max}`);
  };

  const handleClearAll = () => {
    clearFilters();
  };

  // Color mapping for visual representation
  const colorMap: { [key: string]: string } = {
    white: "#FFFFFF",
    black: "#000000",
    gray: "#6B7280",
    silver: "#C0C0C0",
    red: "#EF4444",
    blue: "#3B82F6",
    green: "#10B981",
    yellow: "#FCD34D",
    orange: "#F97316",
    brown: "#92400E",
    beige: "#F5DEB3",
    gold: "#FFD700",
    pink: "#EC4899",
    purple: "#A855F7",
  };

  return (
    <div className="bg-background border border-border/50 rounded-lg shadow-sm overflow-hidden">
      {/* Header */}
      <div className="p-5 border-b border-border/50 bg-muted/30 flex items-center justify-between">
        <h2 className="font-semibold text-base text-foreground">Filtres</h2>
        <Button
          variant="ghost"
          size="sm"
          className="text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-accent/50 h-8 px-3"
          onClick={handleClearAll}
        >
          Réinitialiser
        </Button>
      </div>

      <div className="p-5 space-y-6">
        {/* Brand Select */}
        <div className="space-y-2.5">
          <Label className="text-sm font-semibold text-foreground">
            Marque
          </Label>
          <Combobox
            options={CAR_BRAND_OPTIONS}
            value={filters.brand?.[0] || ""}
            onValueChange={handleBrandChange}
            placeholder="Rechercher une marque..."
          />
        </div>

        {/* Model Select */}
        <div className="space-y-2.5">
          <Label className="text-sm font-semibold text-foreground">
            Modèle
          </Label>
          <Combobox
            options={filteredModelOptions}
            value={filters.model?.[0] || ""}
            onValueChange={(value) =>
              updateFilter("model", value ? [value] : [])
            }
            placeholder={
              filters.brand?.length
                ? "Choisir un modèle..."
                : "Sélectionnez d'abord une marque"
            }
            className={
              !filters.brand?.length ? "opacity-50 cursor-not-allowed" : ""
            }
          />
        </div>

        {/* Price Range */}
        <div className="space-y-2.5">
          <Label className="text-sm font-semibold text-foreground">
            Budget (Ar)
          </Label>
          <div className="flex items-center gap-3">
            <Input
              type="number"
              placeholder="Min"
              value={priceRange.min}
              onChange={(e) => updatePrice(e.target.value, priceRange.max)}
              className="h-9 text-sm bg-muted/50 border-border/50"
            />
            <span className="text-muted-foreground text-sm font-medium flex-shrink-0">
              —
            </span>
            <Input
              type="number"
              placeholder="Max"
              value={priceRange.max}
              onChange={(e) => updatePrice(priceRange.min, e.target.value)}
              className="h-9 text-sm bg-muted/50 border-border/50"
            />
          </div>
        </div>

        {/* Year Range */}
        <div className="space-y-2.5">
          <Label className="text-sm font-semibold text-foreground">Année</Label>
          <div className="flex items-center gap-3">
            <Input
              type="number"
              placeholder="Min"
              value={filters.yearMin || ""}
              onChange={(e) =>
                updateFilter(
                  "year_min",
                  e.target.value ? parseInt(e.target.value) : null,
                )
              }
              className="h-9 text-sm bg-muted/50 border-border/50"
            />
            <span className="text-muted-foreground text-sm font-medium flex-shrink-0">
              —
            </span>
            <Input
              type="number"
              placeholder="Max"
              value={filters.yearMax || ""}
              onChange={(e) =>
                updateFilter(
                  "year_max",
                  e.target.value ? parseInt(e.target.value) : null,
                )
              }
              className="h-9 text-sm bg-muted/50 border-border/50"
            />
          </div>
        </div>

        <Separator className="opacity-40" />

        <Accordion
          type="multiple"
          defaultValue={["fuel-type", "transmission", "condition", "color"]}
          className="w-full space-y-2"
        >
          <FilterAccordionItem
            title="Type de carburant"
            value="fuel-type"
            filterType="checkbox"
            options={CAR_FUELTYPE_OPTIONS}
            selectedValues={filters.fuelType || []}
            onValuesChange={(values: any) => updateFilter("fuelType", values)}
          />

          <FilterAccordionItem
            title="Boîte de vitesse"
            value="transmission"
            filterType="checkbox"
            options={CAR_TRANSMISSION_OPTIONS}
            selectedValues={filters.transmission || []}
            onValuesChange={(values: any) =>
              updateFilter("transmission", values)
            }
          />

          <FilterAccordionItem
            title="Condition"
            value="condition"
            filterType="checkbox"
            options={CAR_CONDITION_OPTIONS}
            selectedValues={filters.condition || []}
            onValuesChange={(values: any) => updateFilter("condition", values)}
          />

          <FilterAccordionItem
            title="Couleur"
            value="color"
            filterType="checkbox"
            options={CAR_COLOR_OPTIONS}
            selectedValues={filters.color || []}
            onValuesChange={(values: any) => updateFilter("color", values)}
            renderOption={(option: any) => (
              <div className="flex items-center gap-3 flex-1">
                <div
                  className="w-5 h-5 rounded-full border-2 border-border/50 flex-shrink-0 transition-transform hover:scale-110"
                  style={{
                    backgroundColor:
                      colorMap[option.label.toLowerCase()] ||
                      colorMap[option.value.toLowerCase()] ||
                      "#6B7280",
                    ...(["white", "beige", "yellow", "gold"].includes(
                      option.label.toLowerCase(),
                    ) && {
                      border: "2px solid #D1D5DB",
                    }),
                  }}
                  title={option.label}
                />
                <span className="text-sm">{option.label}</span>
              </div>
            )}
          />
        </Accordion>
      </div>
    </div>
  );
};

export default Filters;
