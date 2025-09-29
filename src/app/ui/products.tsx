"use client"

import { useEffect, useState } from "react"
import { ProductField } from "@/app/lib/definitions"
import ProductCard from "@/app/ui/ProductCard"

export default function ProductsPage({
  products,
  isAdminView = false,
}: {
  products: ProductField[]
  isAdminView?: boolean
}) {
  const [filtered, setFiltered] = useState(products)
  const [category, setCategory] = useState("")
  const [minPrice, setMinPrice] = useState("")
  const [maxPrice, setMaxPrice] = useState("")
  const [minRating, setMinRating] = useState("")
  const [sortBy, setSortBy] = useState("newest")

  useEffect(() => {
    let filteredProducts = products.filter((product) => {
      const matchesCategory = category
        ? product.category?.toLowerCase().includes(category.toLowerCase())
        : true

      const matchesMinPrice = minPrice
        ? product.price >= parseFloat(minPrice)
        : true

      const matchesMaxPrice = maxPrice
        ? product.price <= parseFloat(maxPrice)
        : true

      const matchesRating = minRating
        ? (product.average_rating || 0) >= parseFloat(minRating)
        : true

      return (
        matchesCategory && matchesMinPrice && matchesMaxPrice && matchesRating
      )
    })

    // Apply sorting
    if (sortBy === "newest") {
      filteredProducts = [...filteredProducts].sort((a, b) => {
        const ratingA = a.average_rating || 0
        const ratingB = b.average_rating || 0
        return ratingB - ratingA
      })
    } else if (sortBy === "price-low") {
      filteredProducts = [...filteredProducts].sort((a, b) => a.price - b.price)
    } else if (sortBy === "price-high") {
      filteredProducts = [...filteredProducts].sort((a, b) => b.price - a.price)
    } else if (sortBy === "rating") {
      filteredProducts = [...filteredProducts].sort(
        (a, b) => (b.average_rating || 0) - (a.average_rating || 0)
      )
    }

    setFiltered(filteredProducts)
  }, [category, minPrice, maxPrice, minRating, sortBy, products])

  useEffect(() => {
    // Handle URL search params on client side
    const searchParams = new URLSearchParams(window.location.search)
    const categoryParam = searchParams.get("category")
    if (categoryParam) {
      setCategory(categoryParam)
    }
  }, [])

  return (
    <div className="p-4">
      {/* Filter Inputs */}
      <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        <input
          type="text"
          placeholder="Filter by category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border p-2 rounded w-full"
        />
        <input
          type="number"
          placeholder="Min price"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
          className="border p-2 rounded w-full"
        />
        <input
          type="number"
          placeholder="Max price"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
          className="border p-2 rounded w-full"
        />
        <input
          type="number"
          placeholder="Min rating"
          min="0"
          max="5"
          step="0.5"
          value={minRating}
          onChange={(e) => setMinRating(e.target.value)}
          className="border p-2 rounded w-full"
        />
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="border p-2 rounded w-full"
        >
          <option value="newest">New Arrivals</option>
          <option value="price-low">Price: Low to High</option>
          <option value="price-high">Price: High to Low</option>
          <option value="rating">Highest Rated</option>
        </select>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            isAdminView={isAdminView}
          />
        ))}
      </div>
    </div>
  )
}
