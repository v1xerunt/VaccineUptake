"use client";

import type React from "react";

import { useEffect, useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  Map,
  CalendarDays,
  Filter,
} from "lucide-react";
import { Button } from "@/components/ui/button";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

import { IForm, useAppStore } from "@/store/app";
import { MultiSelectDropdown } from "./multi-select";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Switch } from "./ui/switch";

export function FilterPanel() {
  const updateMap = useAppStore((s) => s.updateMap);
  useEffect(() => {
    updateMap();
  }, [updateMap]);

  const formValues = useAppStore((s) => s.form);
  const resetForm = useAppStore((s) => s.updateForm);
  const updateForm = useAppStore((s) => s.updateSingleFormItem);
  const countryOptions = useAppStore((s) => s.countryOptions);
  const populationOptions = useAppStore((s) => s.popluationOptions);
  const studyOptions = useAppStore((s) => s.studyOptions);
  const healthOptions = useAppStore((s) => s.healthOptions);
  const settingOptions = useAppStore((s) => s.settingOptions);
  const subFilterKeyOptions = useAppStore((s) => s.subFilterKeyOptions);

  const upateSingleFormItem =
    (key: keyof IForm) => (value: string | string[] | boolean) => {
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
      countries: countryOptions.map((option) => option.value),
      showCities: false,
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
              <MultiSelectDropdown
                options={countryOptions}
                selected={formValues.countries}
                setSelected={upateSingleFormItem("countries")}
                placeholder="Select Countries"
                icon={<Map className="h-4 w-4 text-muted-foreground" />}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Overall age</label>
              <MultiSelectDropdown
                options={populationOptions}
                selected={formValues.populations ?? []}
                setSelected={upateSingleFormItem("populations")}
                placeholder="Select overall age"
                icon={
                  <CalendarDays className="h-4 w-4 text-muted-foreground" />
                }
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Studies</label>
              <MultiSelectDropdown
                options={studyOptions}
                selected={formValues.studies ?? []}
                setSelected={upateSingleFormItem("studies")}
                placeholder="Select studies"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Health Status</label>
              <MultiSelectDropdown
                options={healthOptions}
                selected={formValues.health ?? []}
                setSelected={upateSingleFormItem("health")}
                placeholder="Select health status"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Settings</label>
              <MultiSelectDropdown
                options={settingOptions}
                selected={formValues.settings ?? []}
                setSelected={upateSingleFormItem("settings")}
                placeholder="Select settings"
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
        <div className="border rounded-md p-4 space-y-4 bg-card">
          <h3 className="font-medium">Display Options</h3>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <label className="text-sm font-medium">Show Cities</label>
              <p className="text-xs text-muted-foreground">
                Display cities data
              </p>
            </div>
            <Switch
              checked={formValues.showCities}
              onCheckedChange={upateSingleFormItem("showCities")}
            />
          </div>
        </div>
      </div>

      <div className="border-t p-4 flex justify-between gap-2 bg-background sticky bottom-0">
        <Button variant="outline" className="flex-1" onClick={handleReset}>
          Reset
        </Button>
      </div>
    </div>
  );
}
