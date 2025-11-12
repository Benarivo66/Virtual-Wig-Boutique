"use client"

import { useState, useEffect } from "react"
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
  const [isFilterOpen, setIsFilterOpen] = useState(false)

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

  // Handle URL category
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
          if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)
          fetchedProducts = await response.json()
        } catch {
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
      } catch {
        setError("Failed to load products.")
        setCategoriesError("Failed to load categories.")
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

  const handleCategoryChange = (category: string | null) => {
    setSelectedCategory(category)
  }

  return (
    <div className="products-page-container flex flex-col md:flex-row relative">
      {/* Mobile Filter Button */}
      <div className="p-4 md:hidden">
        <button
          onClick={() => setIsFilterOpen(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium"
        >
          Filters
        </button>
      </div>

      {/* Sidebar / Drawer */}
      <aside
        className={`fixed inset-y-0 left-0 w-64 bg-gray-50 border-r p-4 transform transition-transform duration-300 ease-in-out z-50
          ${isFilterOpen ? "translate-x-0" : "-translate-x-full"}
          md:static md:translate-x-0 md:w-64 md:block`}
      >
        <div className="flex justify-between items-center mb-4 md:hidden">
          <h2 className="font-semibold text-lg">Filters</h2>
          <button
            onClick={() => setIsFilterOpen(false)}
            className="text-gray-600 hover:text-gray-900 font-bold text-xl"
          >
            ×
          </button>
        </div>

        <h2 className="font-semibold text-lg mb-4 hidden md:block">Filters</h2>

        <CategoryFilter
          categories={categories}
          selectedCategory={selectedCategory}
          onCategoryChange={handleCategoryChange}
          loading={categoriesLoading}
          error={categoriesError}
        />
      </aside>

      {/* Overlay (mobile only) */}
      {isFilterOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 md:hidden z-40"
          onClick={() => setIsFilterOpen(false)}
        />
      )}

      {/* Main Content */}
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
