"use client";

import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import React from "react";

interface FilterOption {
  label: string;
  value: string;
  key?: string;
}

interface FilterAccordionItemProps {
  title: string;
  value: string;
  filterType: "checkbox" | "radio";
  options: FilterOption[];
  selectedValues: (string | number)[];
  onValuesChange: (values: (string | number)[]) => void;
  renderOption?: (option: FilterOption) => React.ReactNode;
}

const FilterAccordionItem: React.FC<FilterAccordionItemProps> = ({
  title,
  value,
  filterType,
  options,
  selectedValues,
  onValuesChange,
  renderOption,
}) => {
  const handleChange = (optionValue: string | number, checked: boolean) => {
    if (filterType === "checkbox") {
      if (checked) {
        onValuesChange([...selectedValues, optionValue]);
      } else {
        onValuesChange(selectedValues.filter((v) => v !== optionValue));
      }
    } else {
      // Radio behavior - only one selection
      if (checked) {
        onValuesChange([optionValue]);
      } else {
        onValuesChange([]);
      }
    }
  };

  return (
    <AccordionItem
      value={value}
      className="border-b border-border/40 py-1 px-0"
    >
      <AccordionTrigger className="py-3 px-0 hover:no-underline hover:text-foreground/80 transition-colors text-sm font-semibold text-foreground">
        {title}
      </AccordionTrigger>
      <AccordionContent className="pb-4 px-0 space-y-2.5">
        {options.map((option) => {
          const isChecked = selectedValues.includes(option.value);

          return (
            <div key={option.value} className="flex items-center gap-3">
              <Checkbox
                id={`filter-${value}-${option.value}`}
                checked={isChecked}
                onCheckedChange={(checked) =>
                  handleChange(option.value, checked as boolean)
                }
                className="rounded-sm"
              />
              <Label
                htmlFor={`filter-${value}-${option.value}`}
                className="text-sm text-muted-foreground hover:text-foreground cursor-pointer transition-colors flex-1 flex items-center"
              >
                {renderOption ? renderOption(option) : option.label}
              </Label>
            </div>
          );
        })}
      </AccordionContent>
    </AccordionItem>
  );
};

export default FilterAccordionItem;
