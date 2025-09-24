import { useState, useCallback } from 'react';

/**
 * Custom hook for managing category filtering state
 * @param initialCategory - Initial selected category
 * @returns Object with selected category, setter, and clear function
 */
export function useCategoryFilter(initialCategory: string | null = null) {
    const [selectedCategory, setSelectedCategory] = useState<string | null>(initialCategory);

    const updateCategory = useCallback((category: string | null) => {
        setSelectedCategory(category);
    }, []);

    const clearCategory = useCallback(() => {
        setSelectedCategory(null);
    }, []);

    return {
        selectedCategory,
        setSelectedCategory: updateCategory,
        clearCategory,
    };
}