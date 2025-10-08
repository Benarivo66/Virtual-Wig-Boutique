"use client"

import { useState, useEffect } from "react"
import { useParams, useSearchParams } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import {
  FaStar,
  FaRegStar,
  FaArrowLeft,
  FaShoppingCart,
  FaSpinner,
  FaCheck,
} from "react-icons/fa"
import { ProductField, ReviewField } from "@/app/lib/definitions"
import { useCart } from "@/app/lib/contexts/CartContext"
import { useToast } from "@/app/lib/contexts/ToastContext"
import ProductReviews from "@/app/ui/ProductReviews/ProductReviews"

export default function ProductDetailPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const productId = params.id as string

  // ✅ ALL HOOKS MUST BE CALLED AT THE TOP - NO EXCEPTIONS
  const [product, setProduct] = useState<ProductField | null>(null)
  const [reviews, setReviews] = useState<ReviewField[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [addToCartState, setAddToCartState] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle")
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)
  const [authLoading, setAuthLoading] = useState(true)
  const [hasPurchased, setHasPurchased] = useState(false)
  const [isValidProduct, setIsValidProduct] = useState(true) // ✅ NEW: Track validity

  const { addItem } = useCart()
  const { showSuccess, showError } = useToast()

  // Auto-scroll to reviews when coming from dashboard
  useEffect(() => {
    const shouldReview = searchParams.get('review');
    
    if (shouldReview === 'true') {
      setTimeout(() => {
        const reviewsSection = document.getElementById('reviews-section');
        if (reviewsSection) {
          reviewsSection.scrollIntoView({ behavior: 'smooth' });
          reviewsSection.style.transition = 'all 0.5s ease';
          reviewsSection.style.boxShadow = '0 0 0 2px #fbbf24';
          setTimeout(() => {
            reviewsSection.style.boxShadow = 'none';
          }, 2000);
        }
      }, 1000);
    }
  }, [searchParams]);

  useEffect(() => {
    async function checkAuth() {
      try {
        const response = await fetch('/api/auth/me')
        if (response.ok) {
          const userData = await response.json()
          setCurrentUserId(userData.user?.id || userData.id)
        } else {
          setCurrentUserId(null)
        }
      } catch (error) {
        console.error('Auth check failed:', error)
        setCurrentUserId(null)
      } finally {
        setAuthLoading(false)
      }
    }

    checkAuth()
  }, [])

  // Check purchase status when user ID is available
  useEffect(() => {
    async function checkPurchaseStatus() {
      if (currentUserId && productId && isValidProduct) {
        try {
          const response = await fetch(`/api/check-purchase?userId=${currentUserId}&productId=${productId}`);
          if (response.ok) {
            const data = await response.json();
            setHasPurchased(data.hasPurchased);
          }
        } catch (error) {
          console.error('Failed to check purchase status:', error);
          setHasPurchased(false);
        }
      }
    }

    checkPurchaseStatus();
  }, [currentUserId, productId, isValidProduct]);

  useEffect(() => {
    // ✅ Check product validity and load data
    if (!productId || productId === 'undefined') {
      setIsValidProduct(false);
      setLoading(false);
      return;
    }

    setIsValidProduct(true);

    async function loadProductData() {
      try {
        setLoading(true)
        setError(null)

        console.log('🔄 Fetching product with ID:', productId);

        // Method 1: Try the specific product endpoint first
        let productData = null;
        try {
          const productResponse = await fetch(`/api/products/${productId}`)
          console.log('📡 Specific product API response status:', productResponse.status);
          
          if (productResponse.ok) {
            productData = await productResponse.json();
            console.log('✅ Product data from specific endpoint:', productData);
          } else {
            console.warn('⚠️ Specific product endpoint failed, trying fallback...');
            throw new Error(`Specific endpoint failed: ${productResponse.status}`);
          }
        } catch (specificError) {
          console.log('🔄 Falling back to products list API');
          
          // Method 2: Fallback - fetch all products and find the matching one
          const allProductsResponse = await fetch('/api/products');
          if (allProductsResponse.ok) {
            const allProducts = await allProductsResponse.json();
            console.log('📦 All products fetched:', allProducts.length);
            
            productData = allProducts.find((p: ProductField) => p.id === productId);
            console.log('🔍 Found product in list:', !!productData);
            
            if (!productData) {
              throw new Error("Product not found in products list");
            }
          } else {
            throw new Error("Failed to load products list");
          }
        }

        if (!productData) {
          throw new Error("Product data is empty");
        }
        
        setProduct(productData)

        // Fetch reviews for this product
        try {
          console.log('🔄 Fetching reviews for product:', productId);
          const reviewsResponse = await fetch(`/api/auth/reviews/${productId}`)
          console.log('📡 Reviews API response status:', reviewsResponse.status);
          
          if (reviewsResponse.ok) {
            const reviewsData = await reviewsResponse.json()
            console.log('✅ Reviews data received:', reviewsData);
            setReviews(reviewsData)
          } else if (reviewsResponse.status === 404) {
            console.warn("Reviews endpoint not found, showing empty reviews")
            setReviews([])
          } else {
            console.warn("Could not fetch reviews, status:", reviewsResponse.status)
            setReviews([])
          }
        } catch (reviewsError) {
          console.warn("Failed to fetch reviews, using empty array:", reviewsError)
          setReviews([])
        }

      } catch (err) {
        console.error("Failed to load product:", err)
        const errorMessage = err instanceof Error ? err.message : "Failed to load product. Please try again later."
        setError(errorMessage)
        setIsValidProduct(false)
      } finally {
        setLoading(false)
      }
    }

    loadProductData()
  }, [productId])

  // ✅ EARLY RETURN AT THE END - AFTER ALL HOOKS
  if (!isValidProduct) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Invalid Product
          </h2>
          <p className="text-gray-600 mb-6">
            The product ID is invalid. Please check the URL and try again.
          </p>
          <Link
            href="/products"
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            <FaArrowLeft className="mr-2" />
            Back to Products
          </Link>
        </div>
      </div>
    )
  }

  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(price)
  }

  const renderStarRating = (rating: number | null | undefined) => {
    const numericRating = rating ? Number(rating) : 0;
    
    if (!numericRating || numericRating === 0) {
      return (
        <div className="flex items-center gap-1">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <FaRegStar
                key={`no-review-${i}`}
                className="text-gray-300 text-lg"
              />
            ))}
          </div>
          <span className="text-sm text-gray-400 ml-2">No reviews yet</span>
        </div>
      )
    }

    const stars = []
    const fullStars = Math.floor(numericRating)
    const hasHalfStar = numericRating % 1 !== 0

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <FaStar key={`full-${i}`} className="text-yellow-400 text-lg" />
      )
    }

    if (hasHalfStar) {
      stars.push(
        <div key="half" className="relative">
          <FaRegStar className="text-yellow-400 text-lg" />
          <FaStar
            className="absolute top-0 left-0 text-yellow-400 text-lg"
            style={{ clipPath: "inset(0 50% 0 0)" }}
          />
        </div>
      )
    }

    const remainingStars = 5 - Math.ceil(numericRating)
    for (let i = 0; i < remainingStars; i++) {
      stars.push(
        <FaRegStar key={`empty-${i}`} className="text-gray-300 text-lg" />
      )
    }

    return (
      <div className="flex items-center gap-1">
        <div className="flex items-center">{stars}</div>
        <span className="text-sm text-gray-600 ml-2">
          ({numericRating.toFixed(1)})
        </span>
        {product?.review_count && product.review_count > 0 && (
          <span className="text-sm text-gray-500 ml-1">
            ({product.review_count} review{product.review_count !== 1 ? 's' : ''})
          </span>
        )}
      </div>
    )
  }

  const handleAddToCart = async () => {
    if (!product || addToCartState === "loading") return

    setAddToCartState("loading")

    try {
      await addItem(product, 1)
      setAddToCartState("success")

      showSuccess(
        "Added to Cart!",
        `${product.name} has been added to your cart.`,
        {
          duration: 6000,
          actions: [
            {
              label: "View Cart",
              onClick: () => {
                window.location.href = "/cart"
              },
              variant: "primary",
            },
            {
              label: "Continue Shopping",
              onClick: () => {
                // Just close the toast
              },
              variant: "secondary",
            },
          ],
        }
      )

      setTimeout(() => {
        setAddToCartState("idle")
      }, 2000)
    } catch (error) {
      setAddToCartState("error")
      showError(
        "Failed to Add Item",
        "There was an error adding the item to your cart. Please try again.",
        { duration: 5000 }
      )

      setTimeout(() => {
        setAddToCartState("idle")
      }, 3000)
    }
  }

  const getAddToCartButtonContent = () => {
    switch (addToCartState) {
      case "loading":
        return (
          <>
            <FaSpinner className="animate-spin mr-2" />
            Adding to Cart...
          </>
        )
      case "success":
        return (
          <>
            <FaCheck className="mr-2" />
            Added to Cart!
          </>
        )
      case "error":
        return (
          <>
            <FaShoppingCart className="mr-2" />
            Try Again
          </>
        )
      default:
        return (
          <>
            <FaShoppingCart className="mr-2" />
            Add to Cart
          </>
        )
    }
  }

  const getAddToCartButtonStyles = () => {
    const baseStyles =
      "w-full px-6 py-4 text-lg font-semibold rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 transform touch-manipulation min-h-[56px] flex items-center justify-center enhanced-button"

    switch (addToCartState) {
      case "loading":
        return `${baseStyles} bg-blue-400 text-white cursor-not-allowed`
      case "success":
        return `${baseStyles} bg-green-600 text-white scale-105 shadow-lg`
      case "error":
        return `${baseStyles} bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 hover:shadow-lg`
      default:
        return `${baseStyles} bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800 focus:ring-blue-500 hover:shadow-lg`
    }
  }

  // Handle review submission success
  const handleReviewSubmitted = async () => {
    try {
      const reviewsResponse = await fetch(`/api/auth/reviews/${productId}`)
      if (reviewsResponse.ok) {
        const reviewsData = await reviewsResponse.json()
        setReviews(reviewsData)
      }
      
      const productResponse = await fetch(`/api/products/${productId}?refresh=${Date.now()}`)
      if (productResponse.ok) {
        const productData = await productResponse.json()
        setProduct(productData)
      }

      showSuccess("Review Submitted!", "Thank you for your review.", {
        duration: 3000,
      })
    } catch (err) {
      console.error("Failed to refresh data after review:", err)
    }
  }

  if (loading || authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <FaSpinner className="animate-spin text-4xl text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading product details...</p>
        </div>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            {error ? "Error Loading Product" : "Product Not Found"}
          </h2>
          <p className="text-gray-600 mb-6">
            {error || "The product you're looking for doesn't exist."}
          </p>
          <div className="space-x-4">
            <Link
              href="/products"
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              <FaArrowLeft className="mr-2" />
              Back to Products
            </Link>
            <button
              onClick={() => window.location.reload()}
              className="inline-flex items-center px-6 py-3 bg-gray-600 text-white font-medium rounded-lg hover:bg-gray-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Navigation */}
        <div className="mb-6">
          <Link
            href="/products"
            className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium transition-all duration-300 group interactive-link"
          >
            <FaArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform duration-300" />
            Back to Products
          </Link>
        </div>

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
            {/* Product Image */}
            <div className="space-y-4">
              <div className="aspect-square relative overflow-hidden rounded-xl bg-gray-100">
                {product.image_url ? (
                  <Image
                    src={product.image_url}
                    alt={product.name}
                    fill
                    className="object-cover"
                    priority
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-gray-400">No Image Available</span>
                  </div>
                )}
              </div>

              {/* Video if available */}
              {product.video_url && (
                <div className="aspect-video relative overflow-hidden rounded-xl bg-gray-100">
                  <video
                    src={product.video_url}
                    className="w-full h-full object-cover"
                    controls
                    muted
                    playsInline
                  />
                </div>
              )}
            </div>

            {/* Product Details */}
            <div className="space-y-6">
              {/* Category Badge */}
              <div>
                <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                  {product.category}
                </span>
              </div>

              {/* Product Name */}
              <h1 className="text-3xl font-bold text-gray-900">
                {product.name}
              </h1>

              {/* Rating */}
              <div className="flex items-center space-x-4">
                {renderStarRating(product.average_rating)}
              </div>

              {/* Price */}
              <div className="text-3xl font-bold text-gray-900">
                {formatPrice(Number(product.price))}
              </div>

              {/* Description */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Description
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {product.description}
                </p>
              </div>

              {/* Add to Cart Button */}
              <div className="pt-4">
                <button
                  className={getAddToCartButtonStyles()}
                  onClick={handleAddToCart}
                  disabled={addToCartState === "loading"}
                  aria-label={`Add ${product.name} to shopping cart`}
                >
                  {getAddToCartButtonContent()}
                </button>
              </div>

              {/* Additional Info */}
              <div className="border-t pt-6 space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-900">Category:</span>
                    <span className="text-gray-600 ml-2">
                      {product.category}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-900">Rating:</span>
                    <span className="text-gray-600 ml-2">
                      {product.average_rating
                        ? `${Number(product.average_rating).toFixed(1)}/5`
                        : "No ratings yet"}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-900">Reviews:</span>
                    <span className="text-gray-600 ml-2">
                      {product.review_count || 0}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-12 bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="p-8" id="reviews-section">
            <ProductReviews 
              productId={productId} 
              userId={currentUserId || ""} 
              productReviews={reviews}
              onReviewSubmitted={handleReviewSubmitted}
              hasPurchased={hasPurchased}
            />
          </div>
        </div>
      </div>
    </div>
  )
}