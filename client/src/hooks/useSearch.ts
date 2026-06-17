import { useState } from "react"
import useDebounce from "./useDebounce";

export default function useSearch() {
    const [search, setSearch] = useState<string>("");
    
    const debouncedSearch = useDebounce<string>(search, 500);
    
    return { debouncedSearch, search, setSearch }
}