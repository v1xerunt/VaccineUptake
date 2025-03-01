"use client";

import type React from "react";

import { useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  Check,
  X,
  BarChart3,
  Map,
  CalendarDays,
  Users,
  Filter,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

// Define option types for multi-select
interface Option {
  value: string;
  label: string;
}

// Mock data for filters
const regions: Option[] = [
  { value: "northeast", label: "Northeast" },
  { value: "midwest", label: "Midwest" },
  { value: "south", label: "South" },
  { value: "west", label: "West" },
  { value: "pacific", label: "Pacific" },
  { value: "mountain", label: "Mountain" },
  { value: "southern", label: "Southern" },
  { value: "central", label: "Central" },
];

const populationRanges: Option[] = [
  { value: "xsmall", label: "< 10,000" },
  { value: "small", label: "10,000 - 50,000" },
  { value: "medium", label: "50,000 - 500,000" },
  { value: "large", label: "500,000 - 1,000,000" },
  { value: "xlarge", label: "> 1,000,000" },
];

const years: Option[] = [
  { value: "2021", label: "2021" },
  { value: "2022", label: "2022" },
  { value: "2023", label: "2023" },
  { value: "2024", label: "2024" },
];

const coverageRanges: Option[] = [
  { value: "very-low", label: "Very Low (0-20%)" },
  { value: "low", label: "Low (20-40%)" },
  { value: "medium", label: "Medium (40-60%)" },
  { value: "high", label: "High (60-80%)" },
  { value: "very-high", label: "Very High (80-100%)" },
];

const vaccineTypes: Option[] = [
  { value: "nirsevimab", label: "Nirsevimab" },
  { value: "older-adults", label: "Older Adults" },
  { value: "maternal", label: "Maternal" },
];

export function FilterPanel() {
  // State for collapsible sections
  const [primaryOpen, setPrimaryOpen] = useState(true);
  const [secondaryOpen, setSecondaryOpen] = useState(false);

  // State for selected values
  const [selectedRegions, setSelectedRegions] = useState<string[]>([]);
  const [selectedPopulations, setSelectedPopulations] = useState<string[]>([]);
  const [selectedYears, setSelectedYears] = useState<string[]>(["2024"]);
  const [selectedCoverages, setSelectedCoverages] = useState<string[]>([]);
  const [selectedVaccineTypes, setSelectedVaccineTypes] = useState<string[]>([
    "nirsevimab",
  ]);

  // Toggle states
  const [showTotal, setShowTotal] = useState(true);
  const [showTrends, setShowTrends] = useState(false);
  const [showLabels, setShowLabels] = useState(true);
  const [showOutliers, setShowOutliers] = useState(false);

  // Handle reset
  const handleReset = () => {
    setSelectedRegions([]);
    setSelectedPopulations([]);
    setSelectedYears(["2024"]);
    setSelectedCoverages([]);
    setSelectedVaccineTypes(["nirsevimab"]);
    setShowTotal(true);
    setShowTrends(false);
    setShowLabels(true);
    setShowOutliers(false);
  };

  // Helper function to render multi-select dropdown
  const MultiSelectDropdown = ({
    options,
    selected,
    setSelected,
    placeholder,
    icon,
  }: {
    options: Option[];
    selected: string[];
    setSelected: (value: string[]) => void;
    placeholder: string;
    icon?: React.ReactNode;
  }) => {
    return (
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="w-full justify-between h-auto py-3"
          >
            <div className="flex items-center gap-2 truncate">
              {icon}
              {selected.length === 0 ? (
                <span className="text-muted-foreground">{placeholder}</span>
              ) : (
                <div className="flex flex-wrap gap-1">
                  {selected.length === 1 ? (
                    <span>
                      {
                        options.find((option) => option.value === selected[0])
                          ?.label
                      }
                    </span>
                  ) : (
                    <span>{selected.length} selected</span>
                  )}
                </div>
              )}
            </div>
            <ChevronDown className="h-4 w-4 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[300px] p-0" align="start">
          <Command>
            <CommandInput
              placeholder={`Search ${placeholder.toLowerCase()}...`}
            />
            <CommandList>
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandGroup>
                {options.map((option) => {
                  const isSelected = selected.includes(option.value);
                  return (
                    <CommandItem
                      key={option.value}
                      onSelect={() => {
                        setSelected(
                          isSelected
                            ? selected.filter((value) => value !== option.value)
                            : [...selected, option.value]
                        );
                      }}
                    >
                      <div
                        className={cn(
                          "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border",
                          isSelected
                            ? "bg-primary border-primary text-primary-foreground"
                            : "opacity-50"
                        )}
                      >
                        {isSelected && <Check className="h-3 w-3" />}
                      </div>
                      {option.label}
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            </CommandList>
            {selected.length > 0 && (
              <div className="flex items-center justify-between p-2 border-t">
                <div className="flex flex-wrap gap-1 max-w-[220px]">
                  {selected.map((value) => (
                    <Badge
                      key={value}
                      variant="secondary"
                      className="flex items-center gap-1"
                    >
                      {options.find((option) => option.value === value)?.label}
                      <X
                        className="h-3 w-3 cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelected(selected.filter((v) => v !== value));
                        }}
                      />
                    </Badge>
                  ))}
                </div>
                <Button
                  variant="ghost"
                  className="h-8 px-2 text-xs"
                  onClick={() => setSelected([])}
                >
                  Clear
                </Button>
              </div>
            )}
          </Command>
        </PopoverContent>
      </Popover>
    );
  };

  return (
    <div className="h-full w-[300px] border-r bg-card flex flex-col">
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Filters</h2>
          <Badge variant="outline" className="text-xs">
            {selectedRegions.length +
              selectedPopulations.length +
              (selectedYears.length > 0 ? selectedYears.length : 0) +
              selectedCoverages.length +
              selectedVaccineTypes.length}{" "}
            active
          </Badge>
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
              <label className="text-sm font-medium">Vaccine Types</label>
              <MultiSelectDropdown
                options={vaccineTypes}
                selected={selectedVaccineTypes}
                setSelected={setSelectedVaccineTypes}
                placeholder="Select vaccine types"
                icon={<BarChart3 className="h-4 w-4 text-muted-foreground" />}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Regions</label>
              <MultiSelectDropdown
                options={regions}
                selected={selectedRegions}
                setSelected={setSelectedRegions}
                placeholder="Select regions"
                icon={<Map className="h-4 w-4 text-muted-foreground" />}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Time Periods</label>
              <MultiSelectDropdown
                options={years}
                selected={selectedYears}
                setSelected={setSelectedYears}
                placeholder="Select years"
                icon={
                  <CalendarDays className="h-4 w-4 text-muted-foreground" />
                }
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
              <label className="text-sm font-medium">Coverage Ranges</label>
              <MultiSelectDropdown
                options={coverageRanges}
                selected={selectedCoverages}
                setSelected={setSelectedCoverages}
                placeholder="Select coverage ranges"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Population Size</label>
              <MultiSelectDropdown
                options={populationRanges}
                selected={selectedPopulations}
                setSelected={setSelectedPopulations}
                placeholder="Select population sizes"
                icon={<Users className="h-4 w-4 text-muted-foreground" />}
              />
            </div>
          </CollapsibleContent>
        </Collapsible>

        <div className="border rounded-md p-4 space-y-4 bg-card">
          <h3 className="font-medium">Display Options</h3>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <label className="text-sm font-medium">Show Totals</label>
              <p className="text-xs text-muted-foreground">
                Display aggregate data
              </p>
            </div>
            <Switch checked={showTotal} onCheckedChange={setShowTotal} />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <label className="text-sm font-medium">Show Trends</label>
              <p className="text-xs text-muted-foreground">
                Display historical patterns
              </p>
            </div>
            <Switch checked={showTrends} onCheckedChange={setShowTrends} />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <label className="text-sm font-medium">Show Labels</label>
              <p className="text-xs text-muted-foreground">
                Display city names
              </p>
            </div>
            <Switch checked={showLabels} onCheckedChange={setShowLabels} />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <label className="text-sm font-medium">Show Outliers</label>
              <p className="text-xs text-muted-foreground">
                Highlight unusual data
              </p>
            </div>
            <Switch checked={showOutliers} onCheckedChange={setShowOutliers} />
          </div>
        </div>
      </div>

      <div className="border-t p-4 flex justify-between gap-2 bg-background sticky bottom-0">
        <Button variant="outline" className="flex-1" onClick={handleReset}>
          Reset
        </Button>
        <Button className="flex-1">Apply</Button>
      </div>
    </div>
  );
}
