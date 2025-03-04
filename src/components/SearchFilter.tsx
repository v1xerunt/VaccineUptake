"use client";

import type React from "react";

import { useEffect, useMemo, useState } from "react";
import { ChevronDown, ChevronUp, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

import { IForm, useAppStore } from "@/store/app";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import Cascader from "./cascader";

export function FilterPanel() {
  const updateMap = useAppStore((s) => s.updateMap);
  useEffect(() => {
    updateMap();
  }, [updateMap]);

  const formValues = useAppStore((s) => s.form);
  console.log("formValues", formValues);
  const resetForm = useAppStore((s) => s.updateForm);
  const updateForm = useAppStore((s) => s.updateSingleFormItem);
  const countryOptions = useAppStore((s) => s.countryOptions);
  const subFilterKeyOptions = useAppStore((s) => s.subFilterKeyOptions);

  const dealedCountryOptions = useMemo(
    () =>
      countryOptions.map((option) => ({
        label: option.label,
        value: option.value,
        children: option.cities,
      })),
    [countryOptions]
  );

  const upateSingleFormItem =
    (key: keyof IForm) => (value: string | string[] | string[][]) => {
      updateForm(key, value);
    };

  // State for collapsible sections
  const [primaryOpen, setPrimaryOpen] = useState(true);
  const [secondaryOpen, setSecondaryOpen] = useState(true);

  const [filterValueOptions, setFilterValueOptions] = useState<
    Array<{ label: string; value: string }>
  >([]);

  useEffect(() => {
    const selectedKey = subFilterKeyOptions.find(
      (option) => option.value === formValues.subFilterKey
    );
    setFilterValueOptions(selectedKey?.options ?? []);
    updateForm("subFilterValue", selectedKey?.options[0].value ?? "total");
  }, [formValues.subFilterKey, subFilterKeyOptions, updateForm]);

  // Handle reset
  const handleReset = () => {
    resetForm({
      countries: countryOptions.reduce<Array<[string, string]>>((acc, curr) => {
        return acc.concat(curr.cities.map((city) => [curr.value, city.value]));
      }, []),
      subFilterKey: "total",
      subFilterValue: "total",
    });
  };

  return (
    <div className="h-full w-[300px] border-r bg-card flex flex-col">
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Filters</h2>
        </div>

        <Collapsible
          open={primaryOpen}
          onOpenChange={setPrimaryOpen}
          className="border rounded-md bg-card"
        >
          <CollapsibleTrigger className="flex w-full items-center justify-between p-4 font-medium">
            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-muted-foreground" />
              Primary Filters
            </div>
            {primaryOpen ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </CollapsibleTrigger>
          <CollapsibleContent className="px-4 pb-4 space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Countries</label>
              <Cascader
                options={dealedCountryOptions}
                placeholder="Select Countries"
                value={formValues.countries}
                onChange={upateSingleFormItem("countries")}
              />
            </div>
          </CollapsibleContent>
        </Collapsible>

        <Collapsible
          open={secondaryOpen}
          onOpenChange={setSecondaryOpen}
          className="border rounded-md bg-card"
        >
          <CollapsibleTrigger className="flex w-full items-center justify-between p-4 font-medium">
            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-muted-foreground" />
              Secondary Filters
            </div>
            {secondaryOpen ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </CollapsibleTrigger>
          <CollapsibleContent className="px-4 pb-4 space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">filter key</label>
              <Select
                onValueChange={upateSingleFormItem("subFilterKey")}
                value={formValues.subFilterKey}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a filter key" />
                </SelectTrigger>
                <SelectContent>
                  {subFilterKeyOptions.map(({ value, label }) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">filter value</label>
              <Select
                onValueChange={upateSingleFormItem("subFilterValue")}
                value={formValues.subFilterValue}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a filter value" />
                </SelectTrigger>
                <SelectContent>
                  {filterValueOptions.map(({ value, label }) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>

      <div className="border-t p-4 flex justify-between gap-2 bg-background sticky bottom-0">
        <Button variant="outline" className="flex-1" onClick={handleReset}>
          Reset
        </Button>
      </div>
    </div>
  );
}
