import { useEffect, useState } from 'react';

export default function useError() {
    const [error, setError] = useState<string | null>(null);
    
    useEffect(() =>{
        if (error) {
            const timer = setTimeout(() => setError(null), 3000);
            return () => clearTimeout(timer);
        }
    }, [error, setError]);

    return { error, setError }
}