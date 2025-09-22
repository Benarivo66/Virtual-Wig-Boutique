'use client';

import React from 'react';
import './CategoryFilter.css';

interface CategoryFilterProps {
    categories: string[];
    selectedCategory: string | null;
    onCategoryChange: (category: string | null) => void;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({
    categories,
    selectedCategory,
    onCategoryChange,
}) => {
    return (
        <div className="category-filter">
            <div className="category-filter-container">
                <button
                    className={`category-button ${selectedCategory === null ? 'active' : ''}`}
                    onClick={() => onCategoryChange(null)}
                >
                    All Products
                </button>
                {categories.map((category) => (
                    <button
                        key={category}
                        className={`category-button ${selectedCategory === category ? 'active' : ''}`}
                        onClick={() => onCategoryChange(category)}
                    >
                        {category}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default CategoryFilter;