import { ChangeEvent, useEffect, useRef, useState } from "react";
import { debounce } from "lodash";

interface SearchProps {
  setSearch: (v: string) => void,
  search: string,
}

export default function Search(props: SearchProps) {
  const [search, setSearch] = useState(props.search);

  const debouncedSearch = useRef(
    debounce((search) => {
      props.setSearch(search);
    }, 300)
  ).current;

  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  useEffect(() => {
    setSearch(props.search);
  }, [props.search]);

  const handleChange = async (e: ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    debouncedSearch(e.target.value);
  };

  return (
    <input
      value={search}
      type="text"
      onChange={handleChange}
      className="border border-gray-300 rounded-md px-4 py-2 text-gray-500"
      placeholder="Search"
    />
  );
}
