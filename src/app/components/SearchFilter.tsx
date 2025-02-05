import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import SearchForm from "./SearchForm";
import { useCallback, useState } from "react";

const SearchFilter = () => {
  const [showContent, setShowContent] = useState(false);

  const closePopover = useCallback(() => {
    setShowContent(false);
  }, [setShowContent]);

  return (
    <Popover open={showContent} onOpenChange={setShowContent}>
      <PopoverTrigger asChild>
        <Button>filter</Button>
      </PopoverTrigger>
      <PopoverContent className="w-[600px]">
        <SearchForm onSubmit={closePopover} />
      </PopoverContent>
    </Popover>
  );
};

export default SearchFilter;
