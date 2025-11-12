"use client";

import ProductCard from "../ProductCard";
import { ProductField } from "@/app/lib/definitions";
import "./ProductCarousel.css";

interface ProductCarouselProps {
  products: ProductField[];
  className?: string;
  loading?: boolean;
  error?: string | null;
}

// Skeleton for loading state
function CarouselSkeleton({ className = "" }: { className?: string }) {
  return (
    <div className={`static-grid ${className}`}>
      {[...Array(4)].map((_, index) => (
        <div
          key={index}
          className="bg-white shadow-md rounded-2xl overflow-hidden border border-gray-100 animate-pulse"
        >
          <div className="aspect-square bg-gray-200"></div>
          <div className="p-4 space-y-3">
            <div className="h-5 bg-gray-200 rounded w-3/4"></div>
            <div className="space-y-2">
              <div className="h-3 bg-gray-200 rounded w-full"></div>
              <div className="h-3 bg-gray-200 rounded w-2/3"></div>
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-gray-100">
              <div className="h-6 bg-gray-200 rounded w-16"></div>
              <div className="h-8 bg-gray-200 rounded w-20"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// Error state
function CarouselError({
  error,
  onRetry,
  className = "",
}: {
  error: string;
  onRetry?: () => void;
  className?: string;
}) {
  return (
    <div className={`w-full ${className}`}>
      <div className="text-center py-12 bg-red-50 rounded-lg border border-red-200">
        <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
          <svg
            className="w-8 h-8 text-red-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-red-900 mb-2">
          Failed to Load Products
        </h3>
        <p className="text-red-700 mb-4">{error}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="px-4 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
        )}
      </div>
    </div>
  );
}

export default function ProductCarousel({
  products,
  className = "",
  loading = false,
  error = null,
}: ProductCarouselProps) {
  // Loading
  if (loading) return <CarouselSkeleton className={className} />;

  // Error
  if (error)
    return (
      <CarouselError
        error={error}
        onRetry={() => window.location.reload()}
        className={className}
      />
    );

  // Empty
  if (!products || products.length === 0)
    return (
      <div className={`w-full ${className}`}>
        <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
          <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <svg
              className="w-8 h-8 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M9 5l7 7-7 7"
              />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No Products Available
          </h3>
          <p className="text-gray-500">Check back later for featured products</p>
        </div>
      </div>
    );

  // Static product grid (no carousel)
  return (
    <div className={`static-grid ${className}`}>
      {products.slice(0, 4).map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          showCategory={true}
          showRating={true}
        />
      ))}
    </div>
  );
}
