import { Input } from "@/components/ui/input";
import { SearchIcon } from "lucide-react";
import { useEffect, useState } from "react";

// Custom debounce hook
const useDebounce = (value: string, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
};

const BookmarkSearch = ({
  onSearch,
  searchQuery,
}: {
  onSearch: (query: string) => void;
  searchQuery: string;
}) => {
  const [searchInput, setSearchInput] = useState(searchQuery);
  const debouncedSearchQuery = useDebounce(searchInput, 500);

  useEffect(() => {
    onSearch(debouncedSearchQuery);
  }, [debouncedSearchQuery, onSearch]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
  };

  return (
    <div className="w-full flex justify-center items-center mt-5 max-sm: m-0">
      <div className="w-[60%] flex items-center justify-center max-sm:w-full">
        <div className="relative w-full">
          <SearchIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-6 w-6" />
          <Input
            type="text"
            placeholder="Search Bookmarks..."
            value={searchInput}
            onChange={handleSearch}
            className="w-full rounded-full pl-12 h-12"
          />
          <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center justify-center text-gray-400  h-8 w-8 rounded-full bg-primary">
            {" "}
            <SearchIcon className="h-6 w-6 text-white" />
          </div>
        </div>
      </div>
    </div>
  );
};
export default BookmarkSearch;
