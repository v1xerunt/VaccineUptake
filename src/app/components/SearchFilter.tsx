import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import SearchForm from "./SearchForm";

const SearchFilter = () => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button>filter</Button>
      </PopoverTrigger>
      <PopoverContent className="w-[600px]">
        <SearchForm />
      </PopoverContent>
    </Popover>
  );
};

export default SearchFilter;
