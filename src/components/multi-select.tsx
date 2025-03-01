import { Check, ChevronDown, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
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
import { Button } from "./ui/button";

interface Option {
  value: string;
  label: string;
}

export const MultiSelectDropdown = ({
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
