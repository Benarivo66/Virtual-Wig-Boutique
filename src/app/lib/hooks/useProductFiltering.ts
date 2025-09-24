import { useMemo } from 'react';
import { ProductField } from '../definitions';
import { searchProducts, filterProductsByCategory } from '../utils';

/**
 * Custom hook for filtering products by category and search query
 * @param products - Array of products to filter
 * @param searchQuery - Search query to filter by name and description
 * @param selectedCategory - Selected category to filter by
 * @returns Filtered products array
 */
export function useProductFiltering(
    products: ProductField[],
    searchQuery: string,
    selectedCategory: string | null
) {
    return useMemo(() => {
        let filtered = products;

        // Filter by category first
        filtered = filterProductsByCategory(filtered, selectedCategory);

        // Then filter by search query
        filtered = searchProducts(filtered, searchQuery);

        return filtered;
    }, [products, searchQuery, selectedCategory]);
}