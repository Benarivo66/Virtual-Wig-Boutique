import { useCallback } from 'react';
import { ProductField } from '../definitions';
import { useProductSearch } from './useProductSearch';
import { useCategoryFilter } from './useCategoryFilter';
import { useProductFiltering } from './useProductFiltering';

/**
 * Combined hook for managing all product filtering functionality
 * @param products - Array of products to filter
 * @param initialSearchQuery - Initial search query
 * @param initialCategory - Initial selected category
 * @returns Object with filtered products and filter controls
 */
export function useProductFilters(
    products: ProductField[],
    initialSearchQuery: string = '',
    initialCategory: string | null = null
) {
    const {
        searchQuery,
        debouncedQuery,
        setSearchQuery,
        clearSearch,
    } = useProductSearch(initialSearchQuery);

    const {
        selectedCategory,
        setSelectedCategory,
        clearCategory,
    } = useCategoryFilter(initialCategory);

    const filteredProducts = useProductFiltering(products, debouncedQuery, selectedCategory);

    const clearAllFilters = useCallback(() => {
        clearSearch();
        clearCategory();
    }, [clearSearch, clearCategory]);

    const hasActiveFilters = Boolean(debouncedQuery || selectedCategory);

    return {
        // Filtered data
        filteredProducts,

        // Search state and controls
        searchQuery,
        debouncedQuery,
        setSearchQuery,
        clearSearch,

        // Category state and controls
        selectedCategory,
        setSelectedCategory,
        clearCategory,

        // Combined controls
        clearAllFilters,
        hasActiveFilters,

        // Filter info
        totalResults: filteredProducts.length,
        isSearching: Boolean(debouncedQuery),
        isFiltering: Boolean(selectedCategory),
    };
}