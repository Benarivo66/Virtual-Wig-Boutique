"use client";

import Image from "next/image";
import { FaStar, FaRegStar } from "react-icons/fa";
import { addToCart } from "@/app/lib/cart";
import { ProductField } from "@/app/lib/definitions";

interface ProductCardProps {
  product: ProductField;
  showCategory?: boolean;
  showRating?: boolean;
  onClick?: (productId: string) => void;
}

export default function ProductCard({
  product,
  showCategory = true,
  showRating = true,
  onClick
}: ProductCardProps) {
  const {
    id,
    name,
    description,
    price,
    category,
    average_rating,
    image_url,
    video_url
  } = product;

  // Format price with proper currency formatting
  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(price);
  };

  // Generate star rating display
  const renderStarRating = (rating: number | null | undefined) => {
    if (!rating || rating === 0) {
      return (
        <div className="flex items-center gap-1">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <FaRegStar key={i} className="text-gray-300 text-sm" />
            ))}
          </div>
          <span className="text-xs text-gray-400">No reviews</span>
        </div>
      );
    }

    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    // Full stars
    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <FaStar key={`full-${i}`} className="text-yellow-400 text-sm" />
      );
    }

    // Half star (if needed)
    if (hasHalfStar) {
      stars.push(
        <div key="half" className="relative">
          <FaRegStar className="text-yellow-400 text-sm" />
          <FaStar
            className="absolute top-0 left-0 text-yellow-400 text-sm"
            style={{ clipPath: 'inset(0 50% 0 0)' }}
          />
        </div>
      );
    }

    // Empty stars
    const remainingStars = 5 - Math.ceil(rating);
    for (let i = 0; i < remainingStars; i++) {
      stars.push(
        <FaRegStar key={`empty-${i}`} className="text-gray-300 text-sm" />
      );
    }

    return (
      <div className="flex items-center gap-1">
        <div className="flex items-center">
          {stars}
        </div>
        <span className="text-xs text-gray-600 ml-1">
          ({rating.toFixed(1)})
        </span>
      </div>
    );
  };

  // Get category badge color
  const getCategoryBadgeColor = (category: string): string => {
    const colors: { [key: string]: string } = {
      'Straight': 'bg-blue-100 text-blue-800',
      'Curly': 'bg-purple-100 text-purple-800',
      'Bob': 'bg-pink-100 text-pink-800',
      'Lace Front': 'bg-green-100 text-green-800',
      'Wavy': 'bg-indigo-100 text-indigo-800',
      'Pixie': 'bg-yellow-100 text-yellow-800',
      'Long': 'bg-red-100 text-red-800',
      'Afro': 'bg-orange-100 text-orange-800',
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  const handleCardClick = () => {
    if (onClick) {
      onClick(id);
    } else {
      window.location.href = `/dashboard/product/${id}`;
    }
  };

  return (
    <div className="bg-white shadow-md rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-2 flex flex-col h-full group border border-gray-100 cursor-pointer"
      onClick={handleCardClick}>
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden">
        {/* Category Badge */}
        {showCategory && (
          <div className="absolute top-3 left-3 z-10">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryBadgeColor(category)}`}>
              {category}
            </span>
          </div>
        )}

        {/* Product Image */}
        <div className="w-full h-full bg-gray-50 flex items-center justify-center relative">
          {video_url && (
            <video
              src={video_url}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              muted
              loop
              playsInline
              onMouseEnter={(e) => e.currentTarget.play()}
              onMouseLeave={(e) => e.currentTarget.pause()}
            />
          )}
          {image_url && (
            <Image
              src={image_url}
              alt={`${name} - ${category} wig`}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              priority={false}
              placeholder="blur"
              blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
            />
          )}
          {!image_url && !video_url && (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              <span className="text-gray-400 text-sm">No Image</span>
            </div>
          )}
        </div>

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300 pointer-events-none" />

        {/* Quick View Button - appears on hover */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button className="bg-white text-gray-900 px-4 py-2 rounded-lg font-medium shadow-lg hover:bg-gray-50 transition-colors">
            Quick View
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-grow">
        {/* Product Name */}
        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
          {name}
        </h3>

        {/* Description */}
        <p className="text-sm text-gray-600 mb-3 line-clamp-2 flex-grow">
          {description}
        </p>

        {/* Rating */}
        {showRating && (
          <div className="mb-3">
            {renderStarRating(average_rating)}
          </div>
        )}

        {/* Price and Add to Cart */}
        <div className="flex items-center justify-between mt-auto pt-2 border-t border-gray-100">
          <div className="flex flex-col">
            <span className="text-xl font-bold text-gray-900">
              {formatPrice(price)}
            </span>
          </div>

          <button
            className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 active:bg-blue-800 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transform hover:scale-105"
            onClick={(e) => {
              e.stopPropagation();
              addToCart(product);
              // You might want to replace this alert with a toast notification
              alert(`Added ${name} to cart!`);
            }}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
