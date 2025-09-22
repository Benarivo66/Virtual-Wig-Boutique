'use client';

import React from 'react';
import './CategoryFilter.css';

interface CategoryFilterProps {
    categories: string[];
    selectedCategory: string | null;
    onCategoryChange: (category: string | null) => void;
    loading?: boolean;
    error?: string | null;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({
    categories,
    selectedCategory,
    onCategoryChange,
    loading = false,
    error = null
}) => {
    // Show loading state
    if (loading) {
        return (
            <div className="category-filter">
                <div className="category-filter-container">
                    {[...Array(6)].map((_, index) => (
                        <div
                            key={index}
                            className="category-button-skeleton"
                        />
                    ))}
                </div>
            </div>
        );
    }

    // Show error state
    if (error) {
        return (
            <div className="category-filter">
                <div className="category-filter-error">
                    <p className="error-message">Failed to load categories: {error}</p>
                    <button
                        className="retry-button"
                        onClick={() => window.location.reload()}
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    // Show empty state
    if (!categories || categories.length === 0) {
        return (
            <div className="category-filter">
                <div className="category-filter-empty">
                    <p>No categories available</p>
                </div>
            </div>
        );
    }

    return (
        <div className="category-filter" role="navigation" aria-label="Product categories">
            <div className="category-filter-container">
                <button
                    className={`category-button ${selectedCategory === null ? 'active' : ''}`}
                    onClick={() => onCategoryChange(null)}
                    aria-pressed={selectedCategory === null}
                    aria-label="Show all products"
                >
                    All Products
                </button>
                {categories.map((category) => (
                    <button
                        key={category}
                        className={`category-button ${selectedCategory === category ? 'active' : ''}`}
                        onClick={() => onCategoryChange(category)}
                        aria-pressed={selectedCategory === category}
                        aria-label={`Filter by ${category} category`}
                    >
                        {category}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default CategoryFilter;