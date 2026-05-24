import { useEffect, useState } from "react";

export default function useDebounce<T>(value: T, delay: number) {
    const [debouncedValue, setDeboundedValue] = useState<T>(value);

    useEffect(() => {
        const timer = setTimeout(() => setDeboundedValue(value), delay);
        return () => clearTimeout(timer)
    }, [value, delay]);
    
    return debouncedValue;
}