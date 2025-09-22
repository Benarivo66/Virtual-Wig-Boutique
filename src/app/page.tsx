"use client";

import { useState, useEffect, useMemo } from "react";
import HeroCard from "./ui/HeroCard/HeroCard";
import ProductCarousel from "./ui/ProductCarousel/ProductCarousel";
import CategoryFilter from "./ui/CategoryFilter/CategoryFilter";
import ProductGrid from "./ui/ProductGrid";
import PromotionalBanner from "./ui/PromotionalBanner/PromotionalBanner";
import { ProductField } from "./lib/definitions";
import { products as placeholderProducts } from "./lib/placeholder-data";
import { getUniqueCategories } from "./lib/utils";
import { useProductFilters } from "./lib/hooks";
import "./page.css";

export default function Home() {
  const [products, setProducts] = useState<ProductField[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<string[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [categoriesError, setCategoriesError] = useState<string | null>(null);

  // Use the custom product filters hook
  const {
    filteredProducts,
    debouncedQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    clearAllFilters,
    hasActiveFilters,
    totalResults,
  } = useProductFilters(products);

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
        setCategoriesLoading(true);
        setCategoriesError(null);
        try {
          const uniqueCategories = getUniqueCategories(fetchedProducts);
          // Add "New Arrivals" as a special category at the beginning
          const categoriesWithNewArrivals = ['New Arrivals', ...uniqueCategories];
          setCategories(categoriesWithNewArrivals);
        } catch (categoryError) {
          console.error("Failed to extract categories:", categoryError);
          setCategoriesError("Failed to load categories");
          // Fallback to placeholder categories
          const placeholderCategories = getUniqueCategories(placeholderProducts as ProductField[]);
          const categoriesWithNewArrivals = ['New Arrivals', ...placeholderCategories];
          setCategories(categoriesWithNewArrivals);
        } finally {
          setCategoriesLoading(false);
        }

      } catch (err) {
        console.error("Failed to load products:", err);
        setError("Failed to load products. Please try again later.");

        // Fallback to placeholder categories
        setCategoriesLoading(true);
        setCategoriesError("Failed to load categories from API");
        try {
          const placeholderCategories = getUniqueCategories(placeholderProducts as ProductField[]);
          const categoriesWithNewArrivals = ['New Arrivals', ...placeholderCategories];
          setCategories(categoriesWithNewArrivals);
        } catch (categoryError) {
          console.error("Failed to extract placeholder categories:", categoryError);
          setCategoriesError("Failed to load categories");
        } finally {
          setCategoriesLoading(false);
        }
      } finally {
        setLoading(false);
      }
    }

    loadProducts();
  }, []);

  // Listen for search updates from TopBar
  useEffect(() => {
    const handleSearch = (event: CustomEvent<{ query: string }>) => {
      setSearchQuery(event.detail.query);
    };

    window.addEventListener('search-update', handleSearch as EventListener);
    return () => {
      window.removeEventListener('search-update', handleSearch as EventListener);
    };
  }, [setSearchQuery]);

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

  const handlePromotionalAction = () => {
    // Filter for new arrivals (products with rating >= 4.5 or latest products)
    const newArrivals = products
      .filter(product => (product.average_rating || 0) >= 4.5)
      .sort((a, b) => (b.average_rating || 0) - (a.average_rating || 0));

    if (newArrivals.length > 0) {
      // Set category to show new arrivals
      setSelectedCategory('New Arrivals');

      // Scroll to products section
      const productsSection = document.querySelector('[data-section="products"]');
      if (productsSection) {
        productsSection.scrollIntoView({ behavior: 'smooth' });
        // Focus the products section for screen readers
        (productsSection as HTMLElement).focus();
      }
    }
  };

  const handleLearnMore = () => {
    // Navigate to products page
    window.location.href = '/admin/products';
  };

  // Skip to main content functionality
  const handleSkipToMain = () => {
    const mainContent = document.querySelector('main');
    if (mainContent) {
      mainContent.focus();
      mainContent.scrollIntoView({ behavior: 'smooth' });
    }
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
    <div className="homepage-container">
      {/* Skip to main content link for accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-blue-600 focus:text-white focus:rounded focus:shadow-lg"
        onClick={handleSkipToMain}
      >
        Skip to main content
      </a>

      <main
        id="main-content"
        className="content-wrapper"
        tabIndex={-1}
        role="main"
        aria-label="Homepage content"
      >
        {/* Hero Section */}
        <section className="section-spacing hero">
          <HeroCard />
        </section>

        {/* Featured Products Carousel */}
        <section className="section-spacing featured">
          <div className="section-header left-aligned">
            <h2 className="section-title">Featured Products</h2>
            <p className="section-subtitle">Discover our most popular and highly-rated wigs</p>
          </div>
          <ProductCarousel
            products={featuredProducts}
            autoPlay={true}
            autoPlayInterval={5000}
            showDots={true}
            showArrows={true}
            loading={loading}
            error={error}
          />
        </section>

        {/* Section Divider */}
        <div className="section-divider"></div>

        {/* Category Filter */}
        <section className="section-spacing categories">
          <div className="section-header left-aligned">
            <h2 className="section-title">Shop by Category</h2>
            <p className="section-subtitle">Find the perfect wig style for you</p>
          </div>
          <CategoryFilter
            categories={categories}
            selectedCategory={selectedCategory}
            onCategoryChange={handleCategoryChange}
            loading={categoriesLoading}
            error={categoriesError}
          />
        </section>

        <div className="section-divider"></div>

        {hasActiveFilters && (
          <section className="spacing-md">
            <div className="filter-info-banner">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-800 font-medium">
                    {debouncedQuery && selectedCategory
                      ? `Showing results for "${debouncedQuery}" in ${selectedCategory}`
                      : debouncedQuery
                        ? `Showing results for "${debouncedQuery}"`
                        : `Showing ${selectedCategory} products`}
                  </p>
                  <p className="text-blue-600 text-sm">
                    {totalResults} product{totalResults !== 1 ? 's' : ''} found
                  </p>
                </div>
                <button
                  onClick={clearAllFilters}
                  className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                >
                  Clear filters
                </button>
              </div>
            </div>
          </section>
        )}

        {/* Product Grid */}
        <section
          className="section-spacing"
          data-section="products"
          aria-labelledby="products-heading"
          tabIndex={-1}
        >
          <div className="section-header left-aligned">
            <h2 id="products-heading" className="section-title">
              {selectedCategory ? `${selectedCategory} Wigs` : 'All Products'}
            </h2>
            <p className="section-subtitle">
              {selectedCategory
                ? `Browse our collection of ${selectedCategory.toLowerCase()} wigs`
                : 'Browse our complete collection of premium wigs'}
            </p>
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
        </section>

        <section className="section-spacing promotional">
          {!loading && products.length > 0 && (
            <PromotionalBanner
              title="New Collection Alert! 🎉"
              description="Discover our latest arrivals featuring premium quality wigs in trending styles. Perfect for every occasion."
              primaryButtonText="Explore New Arrivals"
              onPrimaryClick={handlePromotionalAction}
              backgroundColor="from-emerald-500 to-teal-600"
              showCloseButton={true}
            />
          )}
        </section>
      </main>
    </div>
  );
}