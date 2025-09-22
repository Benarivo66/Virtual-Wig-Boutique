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
}

export default function ProductCarousel({
    products,
    autoPlay = true,
    autoPlayInterval = 5000,
    showDots = true,
    showArrows = true,
    className = ""
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

    // Touch handlers for swipe functionality
    const handleTouchStart = (e: React.TouchEvent) => {
        setTouchEnd(null);
        setTouchStart(e.targetTouches[0].clientX);
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        setTouchEnd(e.targetTouches[0].clientX);
    };

    const handleTouchEnd = () => {
        if (!touchStart || !touchEnd || isTransitioning) return;

        const distance = touchStart - touchEnd;
        const isLeftSwipe = distance > 50;
        const isRightSwipe = distance < -50;

        if (isLeftSwipe) {
            goToNext();
        } else if (isRightSwipe) {
            goToPrevious();
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

    // Keyboard navigation
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'ArrowLeft') {
            e.preventDefault();
            goToPrevious();
        } else if (e.key === 'ArrowRight') {
            e.preventDefault();
            goToNext();
        }
    };

    // Calculate total slides for dots
    const totalSlides = Math.max(1, Math.ceil(products.length / itemsPerView));
    const currentSlide = Math.floor(currentIndex / itemsPerView);

    if (!products || products.length === 0) {
        return (
            <div className={`w-full ${className}`}>
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                    <p className="text-gray-500 text-lg">No products to display</p>
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
                            key={product.id}
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
                                    window.location.href = `/dashboard/product/${productId}`;
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