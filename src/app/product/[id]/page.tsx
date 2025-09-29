"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
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
import { ProductField } from "@/app/lib/definitions"
import { useCart } from "@/app/lib/contexts/CartContext"
import { useToast } from "@/app/lib/contexts/ToastContext"

export default function ProductDetailPage() {
  const params = useParams()
  const productId = params.id as string
  const [product, setProduct] = useState<ProductField | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [addToCartState, setAddToCartState] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle")

  const { addItem } = useCart()
  const { showSuccess, showError } = useToast()

  useEffect(() => {
    async function loadProduct() {
      try {
        setLoading(true)
        setError(null)

        const response = await fetch(`/api/products/${productId}`)
        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || "Product not found")
        }
        const productData = await response.json()
        if (!productData) {
          throw new Error("Product not found")
        }
        setProduct(productData)
      } catch (err) {
        console.error("Failed to load product:", err)
        setError("Failed to load product. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    if (productId) {
      loadProduct()
    }
  }, [productId])

  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(price)
  }

  const renderStarRating = (rating: number | null | undefined) => {
    if (!rating || rating === 0) {
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
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 !== 0

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

    const remainingStars = 5 - Math.ceil(rating)
    for (let i = 0; i < remainingStars; i++) {
      stars.push(
        <FaRegStar key={`empty-${i}`} className="text-gray-300 text-lg" />
      )
    }

    return (
      <div className="flex items-center gap-1">
        <div className="flex items-center">{stars}</div>
        <span className="text-sm text-gray-600 ml-2">
          ({rating.toFixed(1)})
        </span>
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

  if (loading) {
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
            Product Not Found
          </h2>
          <p className="text-gray-600 mb-6">
            {error || "The product you're looking for doesn't exist."}
          </p>
          <Link
            href="/"
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            <FaArrowLeft className="mr-2" />
            Back to Home
          </Link>
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
                {formatPrice(product.price)}
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
                        ? `${product.average_rating}/5`
                        : "No ratings yet"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
