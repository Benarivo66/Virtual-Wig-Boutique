"use client"

import React, { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useCart } from "@/app/lib/contexts/CartContext"
import { useToast } from "@/app/lib/contexts/ToastContext"
import "../page.css"

function CartPage() {
  const {
    items,
    totalItems,
    totalPrice,
    removeItem,
    updateQuantity,
    clearCart,
    isLoading,
  } = useCart()
  const { showSuccess, showWarning, showError } = useToast()
  const [removingItems, setRemovingItems] = useState<Set<string>>(new Set())
  const [updatingItems, setUpdatingItems] = useState<Set<string>>(new Set())

  const handleQuantityChange = async (
    productId: string,
    newQuantity: number
  ) => {
    if (newQuantity < 1) {
      handleRemoveItem(productId)
      return
    }

    if (newQuantity > 99) {
      showWarning("Maximum Quantity", "You can only add up to 99 of each item.")
      return
    }

    setUpdatingItems((prev) => new Set(prev).add(productId))
    try {
      updateQuantity(productId, newQuantity)
      showSuccess("Quantity Updated", "Cart has been updated successfully.")
    } catch (error) {
      showError("Update Failed", "Failed to update quantity. Please try again.")
    } finally {
      setUpdatingItems((prev) => {
        const newSet = new Set(prev)
        newSet.delete(productId)
        return newSet
      })
    }
  }

  const handleRemoveItem = async (productId: string) => {
    const item = items.find((item) => item.id === productId)
    if (!item) return

    setRemovingItems((prev) => new Set(prev).add(productId))
    try {
      removeItem(productId)
      showSuccess(
        "Item Removed",
        `${item.name} has been removed from your cart.`,
        {
          actions: [
            {
              label: "Undo",
              onClick: () => {
                // Note: This would require implementing an undo functionality
                // For now, we'll just show a message
                showWarning(
                  "Undo Not Available",
                  "Please re-add the item from the product page."
                )
              },
              variant: "primary",
            },
          ],
        }
      )
    } catch (error) {
      showError("Remove Failed", "Failed to remove item. Please try again.")
    } finally {
      setRemovingItems((prev) => {
        const newSet = new Set(prev)
        newSet.delete(productId)
        return newSet
      })
    }
  }

  const handleClearCart = () => {
    if (items.length === 0) return

    try {
      clearCart()
      showSuccess("Cart Cleared", "All items have been removed from your cart.")
    } catch (error) {
      showError("Clear Failed", "Failed to clear cart. Please try again.")
    }
  }

  const handleCheckout = () => {
    if (items.length === 0) {
      showWarning(
        "Empty Cart",
        "Please add some items to your cart before checking out."
      )
      return
    }
    // Navigate to checkout page
    window.location.href = "/checkout"
  }

  const EmptyCartState = () => (
    <div className="content-section text-center py-16">
      <div className="max-w-md mx-auto">
        <div className="mb-8">
          <svg
            className="mx-auto h-24 w-24 text-gray-300"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6M7 13l-1.5-6m0 0h15.5M17 21a2 2 0 100-4 2 2 0 000 4zM9 21a2 2 0 100-4 2 2 0 000 4z"
            />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Your cart is empty
        </h2>
        <p className="text-gray-600 mb-8">
          Looks like you haven&apos;t added any items to your cart yet. Start
          shopping to find your perfect wig!
        </p>
        <div className="space-y-4">
          <Link
            href="/products"
            className="inline-block w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
          >
            Browse Products
          </Link>
        </div>
      </div>
    </div>
  )

  return (
    <div className="homepage-container min-h-screen">
      <main className="content-wrapper" role="main" aria-label="Shopping cart">
        <div className="section-spacing">
          {/* Page Header */}
          <div className="section-header left-aligned">
            <h1 className="section-title">Shopping Cart</h1>
            <p className="section-subtitle">
              {items.length === 0
                ? "Your cart is currently empty"
                : `${totalItems} item${
                    totalItems !== 1 ? "s" : ""
                  } in your cart`}
            </p>
          </div>

          {items.length === 0 ? (
            <EmptyCartState />
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2">
                <div className="content-section">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold text-gray-900">
                      Cart Items
                    </h2>
                    <button
                      onClick={handleClearCart}
                      className="text-red-600 hover:text-red-800 font-medium text-sm transition-colors duration-200"
                      disabled={isLoading}
                    >
                      Clear Cart
                    </button>
                  </div>

                  <div className="space-y-6">
                    {items.map((item) => {
                      const isRemoving = removingItems.has(item.id)
                      const isUpdating = updatingItems.has(item.id)
                      const itemLoading = isRemoving || isUpdating

                      return (
                        <div
                          key={item.id}
                          className={`flex flex-col sm:flex-row gap-4 p-4 border border-gray-200 rounded-lg transition-opacity duration-200 ${
                            itemLoading ? "opacity-50" : ""
                          }`}
                        >
                          {/* Product Image */}
                          <div className="flex-shrink-0">
                            <div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden">
                              {item.image_url ? (
                                <Image
                                  src={item.image_url}
                                  alt={item.name}
                                  width={96}
                                  height={96}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-400">
                                  <svg
                                    className="w-8 h-8"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                  >
                                    <path
                                      fillRule="evenodd"
                                      d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                                      clipRule="evenodd"
                                    />
                                  </svg>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Product Details */}
                          <div className="flex-grow">
                            <div className="flex flex-col sm:flex-row sm:justify-between">
                              <div className="mb-2 sm:mb-0">
                                <h3 className="font-semibold text-gray-900 text-lg">
                                  {item.name}
                                </h3>
                                <p className="text-gray-600 text-sm">
                                  {item.category}
                                </p>
                                <p className="text-blue-600 font-semibold text-lg mt-1">
                                  $
                                  {(typeof item.price === "string"
                                    ? parseFloat(item.price)
                                    : item.price
                                  ).toFixed(2)}
                                </p>
                              </div>

                              {/* Quantity Controls */}
                              <div className="flex items-center space-x-3">
                                <div className="flex items-center border border-gray-300 rounded-lg">
                                  <button
                                    onClick={() =>
                                      handleQuantityChange(
                                        item.id,
                                        item.quantity - 1
                                      )
                                    }
                                    disabled={itemLoading || item.quantity <= 1}
                                    className="p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                                    aria-label="Decrease quantity"
                                  >
                                    <svg
                                      className="w-4 h-4"
                                      fill="none"
                                      stroke="currentColor"
                                      viewBox="0 0 24 24"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M20 12H4"
                                      />
                                    </svg>
                                  </button>
                                  <span className="px-4 py-2 font-medium min-w-[3rem] text-center">
                                    {isUpdating ? (
                                      <div className="loading-spinner mx-auto"></div>
                                    ) : (
                                      item.quantity
                                    )}
                                  </span>
                                  <button
                                    onClick={() =>
                                      handleQuantityChange(
                                        item.id,
                                        item.quantity + 1
                                      )
                                    }
                                    disabled={
                                      itemLoading || item.quantity >= 99
                                    }
                                    className="p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                                    aria-label="Increase quantity"
                                  >
                                    <svg
                                      className="w-4 h-4"
                                      fill="none"
                                      stroke="currentColor"
                                      viewBox="0 0 24 24"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                                      />
                                    </svg>
                                  </button>
                                </div>

                                <button
                                  onClick={() => handleRemoveItem(item.id)}
                                  disabled={itemLoading}
                                  className="text-red-600 hover:text-red-800 p-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                                  aria-label={`Remove ${item.name} from cart`}
                                >
                                  {isRemoving ? (
                                    <div className="loading-spinner"></div>
                                  ) : (
                                    <svg
                                      className="w-5 h-5"
                                      fill="none"
                                      stroke="currentColor"
                                      viewBox="0 0 24 24"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                      />
                                    </svg>
                                  )}
                                </button>
                              </div>
                            </div>

                            {/* Item Total */}
                            <div className="mt-2 text-right sm:text-left">
                              <span className="text-gray-600 text-sm">
                                Subtotal:{" "}
                              </span>
                              <span className="font-semibold text-gray-900">
                                $
                                {(
                                  (typeof item.price === "string"
                                    ? parseFloat(item.price)
                                    : item.price) * item.quantity
                                ).toFixed(2)}
                              </span>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <div className="content-section sticky top-8">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">
                    Order Summary
                  </h2>

                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between text-gray-600">
                      <span>Items ({totalItems})</span>
                      <span>${totalPrice.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>Shipping</span>
                      <span>Calculated at checkout</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>Tax</span>
                      <span>Calculated at checkout</span>
                    </div>
                    <div className="border-t pt-4">
                      <div className="flex justify-between text-xl font-semibold text-gray-900">
                        <span>Total</span>
                        <span>${totalPrice.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={handleCheckout}
                    disabled={isLoading || items.length === 0}
                    className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 mb-4"
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center">
                        <div className="loading-spinner mr-2"></div>
                        Processing...
                      </div>
                    ) : (
                      <Link
                      href="/checkout"
                      >
                       Proceed to Checkout
                      </Link>
                     
                    )}
                  </button>

                  <Link
                    href="/"
                    className="block w-full text-center bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
                  >
                    Continue Shopping
                  </Link>

                  {/* Security Badge */}
                  <div className="mt-6 text-center">
                    <div className="flex items-center justify-center text-gray-500 text-sm">
                      <svg
                        className="w-4 h-4 mr-2"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Secure checkout
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default CartPage
