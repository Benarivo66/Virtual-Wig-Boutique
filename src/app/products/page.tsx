"use client"

import { useState, useEffect, useMemo } from "react"
import CategoryFilter from "../ui/CategoryFilter/CategoryFilter"
import ProductGrid from "../ui/ProductGrid"
import { ProductField } from "../lib/definitions"
import { products as placeholderProducts } from "../lib/placeholder-data"
import { getUniqueCategories } from "../lib/utils"
import { useProductFilters } from "../lib/hooks"
import "../page.css"

export default function ProductsPage() {
  const [products, setProducts] = useState<ProductField[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [categories, setCategories] = useState<string[]>([])
  const [categoriesLoading, setCategoriesLoading] = useState(true)
  const [categoriesError, setCategoriesError] = useState<string | null>(null)

  const {
    filteredProducts,
    debouncedQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    clearAllFilters,
    hasActiveFilters,
    totalResults,
  } = useProductFilters(products)

  // Handle URL parameters
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const categoryParam = params.get("category")
    if (categoryParam) {
      setSelectedCategory(categoryParam)
    }
  }, [setSelectedCategory])

  useEffect(() => {
    async function loadProducts() {
      try {
        setLoading(true)
        setError(null)
        let fetchedProducts: ProductField[]
        try {
          const response = await fetch("/api/products")
          if (!response.ok)
            throw new Error(`HTTP error! status: ${response.status}`)
          fetchedProducts = await response.json()
        } catch (apiError) {
          fetchedProducts = placeholderProducts as ProductField[]
        }
        setProducts(fetchedProducts)
        setCategoriesLoading(true)
        setCategoriesError(null)
        try {
          const uniqueCategories = getUniqueCategories(fetchedProducts)
          setCategories(["New Arrivals", ...uniqueCategories])
        } catch {
          setCategories([
            "New Arrivals",
            ...getUniqueCategories(placeholderProducts as ProductField[]),
          ])
        } finally {
          setCategoriesLoading(false)
        }
      } catch (err) {
        setError("Failed to load products. Please try again later.")
        setCategoriesLoading(true)
        setCategoriesError("Failed to load categories from API")
        setCategories([
          "New Arrivals",
          ...getUniqueCategories(placeholderProducts as ProductField[]),
        ])
        setCategoriesLoading(false)
      } finally {
        setLoading(false)
      }
    }
    loadProducts()
  }, [])

  // Sidebar filter/sort
  const handleCategoryChange = (category: string | null) => {
    setSelectedCategory(category)
  }

  return (
    <div className="products-page-container flex">
      {/* Sidebar */}
      <aside className="w-64 p-4 border-r bg-gray-50">
        <h2 className="font-semibold text-lg mb-4">Filters</h2>
        <CategoryFilter
          categories={categories}
          selectedCategory={selectedCategory}
          onCategoryChange={handleCategoryChange}
          loading={categoriesLoading}
          error={categoriesError}
        />
        {/* Add sort options here if needed */}
      </aside>
      {/* Main content */}
      <main className="flex-1 p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">All Products</h1>
          {hasActiveFilters && (
            <div className="mb-2">
              <span className="text-blue-800 font-medium">
                {debouncedQuery && selectedCategory
                  ? `Showing results for "${debouncedQuery}" in ${selectedCategory}`
                  : debouncedQuery
                  ? `Showing results for "${debouncedQuery}"`
                  : `Showing ${selectedCategory} products`}
              </span>
              <span className="ml-2 text-blue-600 text-sm">
                {totalResults} product{totalResults !== 1 ? "s" : ""} found
              </span>
              <button
                onClick={clearAllFilters}
                className="ml-4 text-blue-600 hover:text-blue-800 font-medium text-sm"
              >
                Clear filters
              </button>
            </div>
          )}
        </div>
        <ProductGrid
          products={filteredProducts}
          loading={loading}
          emptyMessage={
            hasActiveFilters
              ? "No products match your current filters. Try adjusting your search or category selection."
              : "We couldn't find any products to display. Please try again later."
          }
        />
      </main>
    </div>
  )
}
