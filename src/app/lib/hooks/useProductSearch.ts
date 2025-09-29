import { useState, useCallback, useEffect } from 'react';

/**
 * Custom hook for managing product search functionality with debouncing
 * @param initialQuery - Initial search query
 * @param debounceMs - Debounce delay in milliseconds (default: 300)
 * @returns Object with search query, setter, and debounced query
 */
export function useProductSearch(initialQuery: string = '', debounceMs: number = 300) {
    const [searchQuery, setSearchQuery] = useState(initialQuery);
    const [debouncedQuery, setDebouncedQuery] = useState(initialQuery);

    // Debounce the search query
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            setDebouncedQuery(searchQuery);
        }, debounceMs);

        return () => clearTimeout(timeoutId);
    }, [searchQuery, debounceMs]);

    const updateSearchQuery = useCallback((query: string) => {
        setSearchQuery(query);
    }, []);

    const clearSearch = useCallback(() => {
        setSearchQuery('');
        setDebouncedQuery('');
    }, []);

    return {
        searchQuery,
        debouncedQuery,
        setSearchQuery: updateSearchQuery,
        clearSearch,
    };
}