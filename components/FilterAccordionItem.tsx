"use client";

import React from "react";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";
import { Input } from "./ui/input";
import { ScrollArea, ScrollBar } from "./ui/scroll-area";
import { cn } from "@/lib/utils";
import { Checkbox } from "./ui/checkbox";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Button } from "./ui/button";

interface PropsType {
  title: string;
  value: string;
  filterType: "checkbox" | "radio";
  disabled?: boolean;
  options?: { label: string; value: string }[];
  selectedValues?: string[] | string | undefined;
  onValuesChange?: (values: string[] | string | undefined) => void;
  hasSearch?: boolean;
  hasClearButton?: boolean;
  children?: React.ReactNode;
  renderCustom?: JSX.Element;
  onClear?: () => void;
}

const FilterAccordionItemComponent = ({
  title,
  value,
  filterType,
  options = [],
  selectedValues,
  onValuesChange,
  hasSearch = false,
  hasClearButton = false,
  disabled = false,
  children,
  renderCustom,
  onClear,
}: PropsType) => {
  const [searchItem, setSearchItem] = React.useState("");
  const [filteredOptions, setFilteredOptions] = React.useState(options);
  const [isCustomSelected, setIsCustomSelected] = React.useState(false);

  React.useEffect(() => {
    if (hasSearch && searchItem) {
      const filtered = options.filter((option) =>
        option?.label?.toLowerCase()?.includes(searchItem.toLowerCase()),
      );
      setFilteredOptions(filtered);
    } else {
      setFilteredOptions(options);
    }
  }, [searchItem, options, hasSearch]);
  const handleRadioChange = (value: string) => {
    if (value === "custom") {
      setIsCustomSelected(true);
    } else {
      setIsCustomSelected(false);
      onValuesChange?.(value);
    }
  };

  const handleClear = () => {
    onClear?.();
  };

  return (
    <AccordionItem
      className="w-full mb-3 rounded-[4px] min-h-14 bg-white px-4 border-0"
      value={value}
    >
      <AccordionTrigger className="!no-underline text-sm font-semibold flex justify-between items-center">
        {title}
      </AccordionTrigger>
      <AccordionContent className="!pt-0">
        {hasSearch && (
          <div className="mb-2">
            <Input
              disabled={disabled}
              type="text"
              placeholder="Rechercher..."
              value={searchItem}
              onChange={(e) => setSearchItem(e.target.value)}
              className="w-full text-sm focus:!ring-0 focus:!shadow-none border"
            />
          </div>
        )}
        {filterType === "checkbox" && (
          <ScrollArea className="max-h-[280px] mb-2">
            <div className="space-y-2">
              {filteredOptions.map((option) => (
                <label
                  key={option.value}
                  className={cn(
                    `flex items-center !cursor-pointer`,
                    disabled &&
                      "pointer-events-none text-muted-foreground opacity-75",
                  )}
                >
                  <Checkbox
                    className="mr-2"
                    disabled={disabled}
                    checked={selectedValues?.includes(option.value)}
                    onCheckedChange={(checked) => {
                      if (onValuesChange) {
                        const currentValues = Array.isArray(selectedValues)
                          ? [...selectedValues]
                          : [];
                        if (checked) {
                          onValuesChange([...currentValues, option.value]);
                        } else {
                          onValuesChange(
                            currentValues.filter((val) => val !== option.value),
                          );
                        }
                      }
                    }}
                  />
                  <span className="text-sm"> {option.label}</span>
                </label>
              ))}
            </div>
            <ScrollBar orientation="vertical" />
          </ScrollArea>
        )}

        {filterType === "radio" && (
          <RadioGroup
            className={cn(
              "",
              disabled &&
                "pointer-events-none text-muted-foreground opacity-75",
            )}
            disabled={disabled}
            value={selectedValues as string}
            onValueChange={handleRadioChange}
          >
            <div className="space-y-2 mb-2">
              {filteredOptions.map((option) => {
                return (
                  <label
                    key={option.value}
                    htmlFor={`radio-item-${option.value}`}
                    className="flex items-center gap-2 text-sm font-none cursor-pointer"
                  >
                    <RadioGroupItem
                      value={option.value}
                      id={`radio-item-${option.value}`}
                      checked={
                        option.value ===
                        (isCustomSelected ? "custom" : selectedValues)
                      }
                      className="text-primary"
                    />

                    <span className="flex-1 text-sm"> {option.label} </span>
                  </label>
                );
              })}

              {isCustomSelected && renderCustom}
            </div>
          </RadioGroup>
        )}

        {hasClearButton && (
          <div className="mt-2">
            <Button
              variant="ghost"
              onClick={handleClear}
              className="!text-muted-foreground !bg-transparent !font-medium !text-[13px] uppercase !p-0 !w-auto !h-auto"
            >
              Clear
            </Button>
          </div>
        )}
      </AccordionContent>
    </AccordionItem>
  );
};

const FilterAccordionItem = React.memo(FilterAccordionItemComponent);

export default FilterAccordionItem;
