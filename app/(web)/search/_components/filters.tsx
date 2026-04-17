"use client";

import FilterAccordionItem from "@/components/FilterAccordionItem";
import { Accordion } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  CAR_BRAND_OPTIONS,
  CAR_COLOR_OPTIONS,
  CAR_CONDITION_OPTIONS,
  CAR_FUELTYPE_OPTIONS,
  CAR_MODEL_OPTIONS,
  CAR_PRICE_RANGE_OPTIONS,
} from "@/constants/car-options";
import useFilter from "@/hooks/use-filter";
import { calculatePriceRange, formatPriceRange } from "@/lib/helper";
import React, { useState, useRef, useEffect } from "react";
import debounce from "lodash.debounce";
import { Separator } from "@/components/ui/separator";

const Filters = () => {
  const { filters, updateFilter, clearFilter, clearFilters } = useFilter();

  const { minPrice, maxPrice } = calculatePriceRange();

  const [sliderValues, setSliderValues] = useState<number[]>([
    minPrice,
    maxPrice,
  ]);

  const [isCustomSelected, setIsCustomSelected] = useState(false);

  const debouncedUpdatePriceRef = useRef<any>(null);

  useEffect(() => {
    if (!debouncedUpdatePriceRef.current) {
      debouncedUpdatePriceRef.current = debounce((values: number[]) => {
        updateFilter("price", values.join("-"));
      }, 500);
    }
  }, []);

  useEffect(() => {
    if (isCustomSelected && debouncedUpdatePriceRef.current) {
      debouncedUpdatePriceRef.current(sliderValues);
    }
  }, [sliderValues, isCustomSelected]);

  const handlePriceChange = (values: string | string[] | undefined) => {
    if (isCustomSelected) {
      setIsCustomSelected(false);
      setSliderValues([minPrice, maxPrice]);
    }
    if (values) updateFilter("price", values);
  };

  const handlePriceCustomRange = (values: number[]) => {
    const [min, max] =
      Array.isArray(values) && values.length >= 2
        ? values[0] <= values[1]
          ? [values[0], values[1]]
          : [values[1], values[0]]
        : [0, 0];

    setSliderValues([min, max]);
    if (!isCustomSelected) setIsCustomSelected(true);
  };

  const handleClearAll = () => {
    clearFilters();
    clearFilter("price");
    setSliderValues([minPrice, maxPrice]);
  };

  return (
    <div className="space-y-4">
      <div className="mb-3">
        <div className="flex items-center justify-between   p-[8px_16px]">
          <h2 className="font-bold text-base"> Filtres </h2>
          <Button
            className="!h-auto  font-light !py-0"
            variant="link"
            onClick={handleClearAll}
          >
            Tout réinitialiser
          </Button>
        </div>
        <Separator orientation="horizontal" className="w-full" />

        <Accordion type="single" collapsible defaultValue="brands">
          <FilterAccordionItem
            title="Marques"
            value="brands"
            filterType="checkbox"
            options={CAR_BRAND_OPTIONS}
            selectedValues={filters.brand || []}
            onValuesChange={(values: any) => {
              updateFilter("brand", values);
            }}
            hasSearch
          />
        </Accordion>
      </div>

      <Accordion
        type="multiple"
        defaultValue={[
          "price-range",
          "fuel-type",
          "condition",
          "model",
          "transmission",
          "color",
        ]}
      >
        <FilterAccordionItem
          title="Prix"
          value="price-range"
          filterType="radio"
          options={CAR_PRICE_RANGE_OPTIONS}
          selectedValues={filters.price}
          onValuesChange={handlePriceChange}
          renderCustom={
            <div className="py-1">
              <div className="flex items-center justify-between mb-[5px]">
                {/* <h5 className="font-medium text-sm">Price</h5> */}
                <span className="text-sm">
                  {formatPriceRange(sliderValues[0], sliderValues[1])}
                  {""}
                </span>
              </div>

              <Slider
                min={minPrice}
                max={maxPrice}
                className="!cursor-pointer"
                defaultValue={[minPrice, maxPrice]}
                value={sliderValues}
                onValueChange={handlePriceCustomRange}
              />
            </div>
          }
        />

        <FilterAccordionItem
          title="Type de carburant"
          value="fuel-type"
          filterType="checkbox"
          options={CAR_FUELTYPE_OPTIONS}
          selectedValues={filters.fuelType || []}
          onValuesChange={(values: any) => {
            updateFilter("fuelType", values);
          }}
        />

        <FilterAccordionItem
          title="Modèles"
          value="model"
          filterType="checkbox"
          disabled={false}
          options={CAR_MODEL_OPTIONS}
          hasSearch={true}
          selectedValues={filters.model || []}
          onValuesChange={(values: any) => {
            updateFilter("model", values);
          }}
        />

        <FilterAccordionItem
          title="Condition"
          value="condition"
          filterType="checkbox"
          options={CAR_CONDITION_OPTIONS}
          selectedValues={filters.condition || []}
          onValuesChange={(values: any) => {
            updateFilter("condition", values);
          }}
        />

        <FilterAccordionItem
          title="Couleur"
          value="color"
          filterType="checkbox"
          options={CAR_COLOR_OPTIONS}
          selectedValues={filters.color || []}
          onValuesChange={(values: any) => {
            updateFilter("color", values);
          }}
        />
      </Accordion>
    </div>
  );
};

export default Filters;
