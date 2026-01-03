"use client";

import { ProductField } from "@/app/lib/definitions";
import ProductCard from "./ProductCard";

interface ProductGridProps {
    products: ProductField[];
    loading?: boolean;
    emptyMessage?: string;
}

// Skeleton card component for loading state
function SkeletonCard() {
    return (
        <div className="bg-white shadow-md rounded-2xl overflow-hidden border border-gray-100 animate-pulse">
            {/* Image skeleton */}
            <div className="aspect-square bg-gray-200"></div>

            {/* Content skeleton */}
            <div className="p-4 space-y-3">
                {/* Title skeleton */}
                <div className="h-5 bg-gray-200 rounded w-3/4"></div>

                {/* Description skeleton */}
                <div className="space-y-2">
                    <div className="h-3 bg-gray-200 rounded w-full"></div>
                    <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                </div>

                {/* Rating skeleton */}
                <div className="flex items-center gap-1">
                    <div className="flex gap-1">
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className="w-3 h-3 bg-gray-200 rounded"></div>
                        ))}
                    </div>
                    <div className="h-3 bg-gray-200 rounded w-8 ml-1"></div>
                </div>

                {/* Price and button skeleton */}
                <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                    <div className="h-6 bg-gray-200 rounded w-16"></div>
                    <div className="h-8 bg-gray-200 rounded w-20"></div>
                </div>
            </div>
        </div>
    );
}

// Empty state component
function EmptyState({ message }: { message: string }) {
    return (
        <div className="col-span-full flex flex-col items-center justify-center py-16 px-4">
            <div className="text-center max-w-md">
                {/* Empty state icon */}
                <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                    <svg
                        className="w-12 h-12 text-gray-400"
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

                {/* Empty state message */}
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    No Products Found
                </h3>
                <p className="text-gray-600 mb-6">
                    {message}
                </p>

                {/* Optional action button */}
                <button
                    onClick={() => window.location.reload()}
                    className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
                >
                    Refresh Page
                </button>
            </div>
        </div>
    );
}

export default function ProductGrid({
    products,
    loading = false,
    emptyMessage = "We couldn't find any products to display. Please try again later."
}: ProductGridProps) {
    // Show loading state
    if (loading) {
        return (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[...Array(8)].map((_, index) => (
                    <SkeletonCard key={index} />
                ))}
            </div>
        );
    }

    // Show empty state
    if (!products || products.length === 0) {
        return (
            <div className="grid grid-cols-1">
                <EmptyState message={emptyMessage} />
            </div>
        );
    }

    // Show products grid
    return (
            <div
                className="
                    grid 
                    grid-cols-2 
                    md:grid-cols-3 
                    lg:grid-cols-4 
                    gap-4 sm:gap-6
                "
                role="grid"
                aria-label="Product grid"
                >
                {products.map(product => (
                    <div key={product.id} role="gridcell">
                    <ProductCard
                        product={product}
                        showCategory
                        showRating
                    />
                    </div>
                ))}
            </div>

    );
}