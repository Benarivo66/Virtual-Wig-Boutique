# Product Filtering Hooks

This directory contains custom React hooks for managing product filtering and search functionality in the Virtual Wig Boutique application.

## Hooks Overview

### `useProductFiltering`
Core filtering logic that filters products by category and search query.

**Usage:**
```typescript
const filteredProducts = useProductFiltering(products, searchQuery, selectedCategory);
```

### `useProductSearch`
Manages search state with debouncing to prevent excessive API calls.

**Usage:**
```typescript
const { searchQuery, debouncedQuery, setSearchQuery, clearSearch } = useProductSearch();
```

### `useCategoryFilter`
Manages category selection state.

**Usage:**
```typescript
const { selectedCategory, setSelectedCategory, clearCategory } = useCategoryFilter();
```

### `useProductFilters` (Recommended)
Combined hook that manages all filtering functionality in one place.

**Usage:**
```typescript
const {
  filteredProducts,
  searchQuery,
  debouncedQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  clearAllFilters,
  hasActiveFilters,
  totalResults,
  isSearching,
  isFiltering,
} = useProductFilters(products);
```

## Features

- **Debounced Search**: Search queries are debounced by 300ms to prevent excessive filtering
- **Category Filtering**: Filter products by category with case-insensitive matching
- **Combined Filtering**: Search and category filters work together
- **State Management**: Centralized state management for all filter controls
- **Performance Optimized**: Uses `useMemo` to prevent unnecessary re-computations

## Integration

The hooks are integrated with:
- **Homepage** (`src/app/page.tsx`): Main product listing and filtering
- **TopBar** (`src/app/ui/TopBar/TopBar.tsx`): Search input with global event dispatch
- **CategoryFilter** (`src/app/ui/CategoryFilter/CategoryFilter.tsx`): Category selection
- **ProductGrid** and **ProductCarousel**: Display filtered results

## Search Functionality

Search works across multiple product fields:
- Product name
- Product description  
- Product category

## Event System

The TopBar component dispatches custom `search-update` events that the homepage listens for, enabling global search functionality across the application.