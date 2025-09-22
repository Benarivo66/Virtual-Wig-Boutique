"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import ProductCard from "../ProductCard";
import { ProductField } from "@/app/lib/definitions";
import "./ProductCarousel.css";

interface ProductCarouselProps {
    products: ProductField[];
    autoPlay?: boolean;
    autoPlayInterval?: number;
    showDots?: boolean;
    showArrows?: boolean;
    className?: string;
    loading?: boolean;
    error?: string | null;
}

// Skeleton carousel component for loading state
function CarouselSkeleton({ className = "" }: { className?: string }) {
    return (
        <div className={`carousel-container ${className}`}>
            <div className="overflow-hidden rounded-lg">
                <div className="carousel-track">
                    {[...Array(4)].map((_, index) => (
                        <div key={index} className="carousel-item" style={{ width: '25%' }}>
                            <div className="bg-white shadow-md rounded-2xl overflow-hidden border border-gray-100 animate-pulse">
                                <div className="aspect-square bg-gray-200"></div>
                                <div className="p-4 space-y-3">
                                    <div className="h-5 bg-gray-200 rounded w-3/4"></div>
                                    <div className="space-y-2">
                                        <div className="h-3 bg-gray-200 rounded w-full"></div>
                                        <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <div className="flex gap-1">
                                            {[...Array(5)].map((_, i) => (
                                                <div key={i} className="w-3 h-3 bg-gray-200 rounded"></div>
                                            ))}
                                        </div>
                                        <div className="h-3 bg-gray-200 rounded w-8 ml-1"></div>
                                    </div>
                                    <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                                        <div className="h-6 bg-gray-200 rounded w-16"></div>
                                        <div className="h-8 bg-gray-200 rounded w-20"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <div className="dots-container">
                {[...Array(3)].map((_, index) => (
                    <div key={index} className="w-2 h-2 bg-gray-300 rounded-full animate-pulse"></div>
                ))}
            </div>
        </div>
    );
}

// Error state component
function CarouselError({ error, onRetry, className = "" }: { error: string; onRetry?: () => void; className?: string }) {
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
                <h3 className="text-lg font-semibold text-red-900 mb-2">Failed to Load Products</h3>
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
    autoPlay = true,
    autoPlayInterval = 5000,
    showDots = true,
    showArrows = true,
    className = "",
    loading = false,
    error = null
}: ProductCarouselProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isAutoPlaying, setIsAutoPlaying] = useState(autoPlay);
    const [touchStart, setTouchStart] = useState<number | null>(null);
    const [touchEnd, setTouchEnd] = useState<number | null>(null);
    const [itemsPerView, setItemsPerView] = useState(1);
    const [isTransitioning, setIsTransitioning] = useState(false);

    const carouselRef = useRef<HTMLDivElement>(null);
    const autoPlayRef = useRef<NodeJS.Timeout | null>(null);

    // Calculate items per view based on screen size
    useEffect(() => {
        const updateItemsPerView = () => {
            const width = window.innerWidth;
            if (width >= 1280) {
                setItemsPerView(4); // xl screens - 4 items
            } else if (width >= 1024) {
                setItemsPerView(3); // lg screens - 3 items
            } else if (width >= 768) {
                setItemsPerView(2); // md screens - 2 items
            } else {
                setItemsPerView(1); // sm screens - 1 item
            }
        };

        updateItemsPerView();
        window.addEventListener('resize', updateItemsPerView);
        return () => window.removeEventListener('resize', updateItemsPerView);
    }, []);

    // Auto-play functionality
    useEffect(() => {
        if (isAutoPlaying && products.length > itemsPerView && !isTransitioning) {
            autoPlayRef.current = setInterval(() => {
                setCurrentIndex((prevIndex) => {
                    const maxIndex = Math.max(0, products.length - itemsPerView);
                    return prevIndex >= maxIndex ? 0 : prevIndex + 1;
                });
            }, autoPlayInterval);
        }

        return () => {
            if (autoPlayRef.current) {
                clearInterval(autoPlayRef.current);
            }
        };
    }, [isAutoPlaying, products.length, itemsPerView, autoPlayInterval, isTransitioning]);

    // Navigation functions
    const goToSlide = useCallback((index: number) => {
        if (isTransitioning) return;

        const maxIndex = Math.max(0, products.length - itemsPerView);
        const newIndex = Math.max(0, Math.min(index, maxIndex));

        setIsTransitioning(true);
        setCurrentIndex(newIndex);

        setTimeout(() => setIsTransitioning(false), 500);
    }, [products.length, itemsPerView, isTransitioning]);

    const goToPrevious = useCallback(() => {
        if (isTransitioning) return;

        setIsTransitioning(true);
        const maxIndex = Math.max(0, products.length - itemsPerView);
        setCurrentIndex((prevIndex) =>
            prevIndex <= 0 ? maxIndex : prevIndex - 1
        );

        setTimeout(() => setIsTransitioning(false), 500);
    }, [products.length, itemsPerView, isTransitioning]);

    const goToNext = useCallback(() => {
        if (isTransitioning) return;

        setIsTransitioning(true);
        const maxIndex = Math.max(0, products.length - itemsPerView);
        setCurrentIndex((prevIndex) =>
            prevIndex >= maxIndex ? 0 : prevIndex + 1
        );

        setTimeout(() => setIsTransitioning(false), 500);
    }, [products.length, itemsPerView, isTransitioning]);

    // Enhanced touch handlers for swipe functionality
    const handleTouchStart = (e: React.TouchEvent) => {
        setTouchEnd(null);
        setTouchStart(e.targetTouches[0].clientX);
        // Pause auto-play during touch interaction
        setIsAutoPlaying(false);
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        setTouchEnd(e.targetTouches[0].clientX);

        // Prevent default scrolling behavior during horizontal swipe
        if (touchStart) {
            const distance = Math.abs(touchStart - e.targetTouches[0].clientX);
            if (distance > 10) {
                e.preventDefault();
            }
        }
    };

    const handleTouchEnd = () => {
        if (!touchStart || !touchEnd || isTransitioning) {
            // Resume auto-play if it was enabled
            if (autoPlay) {
                setTimeout(() => setIsAutoPlaying(true), 1000);
            }
            return;
        }

        const distance = touchStart - touchEnd;
        const isLeftSwipe = distance > 30; // Reduced threshold for better responsiveness
        const isRightSwipe = distance < -30;

        if (isLeftSwipe) {
            goToNext();
        } else if (isRightSwipe) {
            goToPrevious();
        }

        // Resume auto-play after a delay
        if (autoPlay) {
            setTimeout(() => setIsAutoPlaying(true), 2000);
        }
    };

    // Mouse handlers for hover pause
    const handleMouseEnter = () => {
        setIsAutoPlaying(false);
    };

    const handleMouseLeave = () => {
        if (autoPlay) {
            setIsAutoPlaying(true);
        }
    };

    // Enhanced keyboard navigation
    const handleKeyDown = (e: React.KeyboardEvent) => {
        switch (e.key) {
            case 'ArrowLeft':
                e.preventDefault();
                goToPrevious();
                break;
            case 'ArrowRight':
                e.preventDefault();
                goToNext();
                break;
            case 'Home':
                e.preventDefault();
                goToSlide(0);
                break;
            case 'End':
                e.preventDefault();
                goToSlide(Math.max(0, products.length - itemsPerView));
                break;
            case ' ':
            case 'Enter':
                e.preventDefault();
                setIsAutoPlaying(!isAutoPlaying);
                break;
            default:
                break;
        }
    };

    // Calculate total slides for dots
    const totalSlides = Math.max(1, Math.ceil(products.length / itemsPerView));
    const currentSlide = Math.floor(currentIndex / itemsPerView);

    // Show loading state
    if (loading) {
        return <CarouselSkeleton className={className} />;
    }

    // Show error state
    if (error) {
        return (
            <CarouselError
                error={error}
                onRetry={() => window.location.reload()}
                className={className}
            />
        );
    }

    // Show empty state
    if (!products || products.length === 0) {
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
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No Products Available</h3>
                    <p className="text-gray-500">Check back later for featured products</p>
                </div>
            </div>
        );
    }

    return (
        <div
            className={`carousel-container ${className}`}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onKeyDown={handleKeyDown}
            tabIndex={0}
            role="region"
            aria-label="Product carousel"
        >
            {/* Carousel Container */}
            <div
                ref={carouselRef}
                className="overflow-hidden rounded-lg"
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
            >
                <div
                    className="carousel-track"
                    style={{
                        transform: `translateX(-${(currentIndex * 100) / itemsPerView}%)`,
                        width: `${(products.length * 100) / itemsPerView}%`
                    }}
                    role="group"
                    aria-live="polite"
                    aria-atomic="false"
                >
                    {products.map((product, index) => (
                        <div
                            key={`carousel-product-${product.id}-${index}`}
                            className="carousel-item"
                            style={{ width: `${100 / products.length}%` }}
                            role="group"
                            aria-label={`Product ${index + 1} of ${products.length}: ${product.name}`}
                        >
                            <ProductCard
                                product={product}
                                showCategory={true}
                                showRating={true}
                                onClick={(productId) => {
                                    window.location.href = `/admin/product/${productId}`;
                                }}
                            />
                        </div>
                    ))}
                </div>
            </div>

            {/* Navigation Arrows */}
            {showArrows && products.length > itemsPerView && (
                <>
                    <button
                        onClick={goToPrevious}
                        disabled={isTransitioning}
                        className="nav-button prev-button"
                        aria-label="View previous products"
                        type="button"
                    >
                        <FaChevronLeft className="w-4 h-4" aria-hidden="true" />
                    </button>

                    <button
                        onClick={goToNext}
                        disabled={isTransitioning}
                        className="nav-button next-button"
                        aria-label="View next products"
                        type="button"
                    >
                        <FaChevronRight className="w-4 h-4" aria-hidden="true" />
                    </button>
                </>
            )}

            {/* Dots Indicator */}
            {showDots && totalSlides > 1 && (
                <div className="dots-container" role="tablist" aria-label="Carousel navigation">
                    {Array.from({ length: totalSlides }).map((_, index) => (
                        <button
                            key={index}
                            onClick={() => goToSlide(index * itemsPerView)}
                            disabled={isTransitioning}
                            className={`dot ${index === currentSlide ? 'dot-active' : ''}`}
                            role="tab"
                            aria-selected={index === currentSlide}
                            aria-label={`Go to slide ${index + 1} of ${totalSlides}`}
                            type="button"
                        />
                    ))}
                </div>
            )}

            {/* Progress Bar */}
            {isAutoPlaying && products.length > itemsPerView && (
                <div className="progress-bar" role="progressbar" aria-label="Carousel auto-play progress">
                    <div
                        className="progress-fill"
                        style={{
                            width: `${((currentIndex + 1) / Math.max(1, products.length - itemsPerView + 1)) * 100}%`
                        }}
                    />
                </div>
            )}

            {/* Screen reader announcements */}
            <div className="sr-only" aria-live="polite" aria-atomic="true">
                Showing products {currentIndex + 1} to {Math.min(currentIndex + itemsPerView, products.length)} of {products.length}
                {isAutoPlaying ? '. Auto-play is active.' : '. Auto-play is paused.'}
            </div>
        </div>
    );
}