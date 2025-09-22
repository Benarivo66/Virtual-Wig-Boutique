"use client";

import { useState, useEffect, useMemo } from "react";
import HeroCard from "./ui/HeroCard/HeroCard";
import ProductCarousel from "./ui/ProductCarousel/ProductCarousel";
import CategoryFilter from "./ui/CategoryFilter/CategoryFilter";
import ProductGrid from "./ui/ProductGrid";
import { ProductField } from "./lib/definitions";
import { products as placeholderProducts } from "./lib/placeholder-data";
import { getUniqueCategories } from "./lib/utils";
import "./page.css";

// Custom hook for product filtering and search
function useProductFiltering(products: ProductField[], searchQuery: string, selectedCategory: string | null) {
  return useMemo(() => {
    let filtered = products;

    // Filter by category
    if (selectedCategory) {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [products, searchQuery, selectedCategory]);
}

export default function Home() {
  const [products, setProducts] = useState<ProductField[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [categories, setCategories] = useState<string[]>([]);

  // Fetch products on component mount
  useEffect(() => {
    async function loadProducts() {
      try {
        setLoading(true);
        setError(null);

        // Fetch products from API endpoint
        let fetchedProducts: ProductField[];
        try {
          const response = await fetch('/api/products');
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          fetchedProducts = await response.json();
        } catch (apiError) {
          console.warn("API fetch failed, using placeholder data:", apiError);
          // Fallback to placeholder data if API fails
          fetchedProducts = placeholderProducts as ProductField[];
        }

        setProducts(fetchedProducts);

        // Extract unique categories from products
        const uniqueCategories = getUniqueCategories(fetchedProducts);
        setCategories(uniqueCategories);

      } catch (err) {
        console.error("Failed to load products:", err);
        setError("Failed to load products. Please try again later.");

        // Fallback to placeholder categories
        const placeholderCategories = getUniqueCategories(placeholderProducts as ProductField[]);
        setCategories(placeholderCategories);
      } finally {
        setLoading(false);
      }
    }

    loadProducts();
  }, []);

  // Listen for search updates from TopBar (if implemented)
  useEffect(() => {
    const handleSearch = (event: CustomEvent<{ query: string }>) => {
      setSearchQuery(event.detail.query);
    };

    window.addEventListener('search-update', handleSearch as EventListener);
    return () => {
      window.removeEventListener('search-update', handleSearch as EventListener);
    };
  }, []);

  // Filter products based on category and search
  const filteredProducts = useProductFiltering(products, searchQuery, selectedCategory);

  // Get featured products for carousel (first 8 products or highest rated)
  const featuredProducts = useMemo(() => {
    const sorted = [...products]
      .sort((a, b) => (b.average_rating || 0) - (a.average_rating || 0))
      .slice(0, 8);
    return sorted.length > 0 ? sorted : products.slice(0, 8);
  }, [products]);

  const handleCategoryChange = (category: string | null) => {
    setSelectedCategory(category);
  };

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Oops! Something went wrong</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <section className="mb-12">
          <HeroCard />
        </section>

        {/* Featured Products Carousel */}
        {featuredProducts.length > 0 && (
          <section className="mb-12">
            <div className="mb-6">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Featured Products</h2>
              <p className="text-gray-600">Discover our most popular and highly-rated wigs</p>
            </div>
            <ProductCarousel
              products={featuredProducts}
              autoPlay={true}
              autoPlayInterval={5000}
              showDots={true}
              showArrows={true}
              className="mb-8"
            />
          </section>
        )}

        {/* Category Filter */}
        <section className="mb-8">
          <div className="mb-6">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Shop by Category</h2>
            <p className="text-gray-600">Find the perfect wig style for you</p>
          </div>
          <CategoryFilter
            categories={categories}
            selectedCategory={selectedCategory}
            onCategoryChange={handleCategoryChange}
          />
        </section>

        {/* Search Results Info */}
        {(searchQuery || selectedCategory) && (
          <section className="mb-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-800 font-medium">
                    {searchQuery && selectedCategory
                      ? `Showing results for "${searchQuery}" in ${selectedCategory}`
                      : searchQuery
                        ? `Showing results for "${searchQuery}"`
                        : `Showing ${selectedCategory} products`}
                  </p>
                  <p className="text-blue-600 text-sm">
                    {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''} found
                  </p>
                </div>
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCategory(null);
                  }}
                  className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                >
                  Clear filters
                </button>
              </div>
            </div>
          </section>
        )}

        {/* Product Grid */}
        <section className="mb-12" data-section="products">
          <div className="mb-6">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              {selectedCategory ? `${selectedCategory} Wigs` : 'All Products'}
            </h2>
            <p className="text-gray-600">
              {selectedCategory
                ? `Browse our collection of ${selectedCategory.toLowerCase()} wigs`
                : 'Browse our complete collection of premium wigs'}
            </p>
          </div>

          <ProductGrid
            products={filteredProducts}
            loading={loading}
            emptyMessage={
              searchQuery || selectedCategory
                ? "No products match your current filters. Try adjusting your search or category selection."
                : "We couldn't find any products to display. Please try again later."
            }
          />
        </section>

        {/* Promotional Section */}
        {!loading && products.length > 0 && (
          <section className="mb-12">
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-8 text-white text-center">
              <h2 className="text-3xl font-bold mb-4">Special Offers</h2>
              <p className="text-lg mb-6 opacity-90">
                Get 20% off on your first purchase! Use code WELCOME20 at checkout.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="px-8 py-3 bg-white text-purple-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors">
                  Shop Now
                </button>
                <button className="px-8 py-3 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-purple-600 transition-colors">
                  Learn More
                </button>
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}