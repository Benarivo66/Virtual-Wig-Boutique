"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { FaArrowLeft, FaEdit, FaTrash } from "react-icons/fa"
import { ProductField } from "@/app/lib/definitions"
import { useToast } from "@/app/lib/contexts/ToastContext"

export default function AdminProductDetailPage() {
  const params = useParams()
  const router = useRouter()
  const productId = params.id as string
  const [product, setProduct] = useState<ProductField | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [deleteLoading, setDeleteLoading] = useState(false)
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
        setError(err instanceof Error ? err.message : "Failed to load product")
        showError("Failed to load product details")
      } finally {
        setLoading(false)
      }
    }

    loadProduct()
  }, [productId, showError])

  const handleEdit = () => {
    router.push(`/admin/product/${productId}/edit`)
  }

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this product?")) {
      return
    }

    try {
      setDeleteLoading(true)
      const response = await fetch(`/api/products/${productId}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete product")
      }

      showSuccess("Product deleted successfully")
      router.push("/admin/products")
    } catch (err) {
      showError("Failed to delete product")
      console.error("Delete error:", err)
    } finally {
      setDeleteLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="text-red-500 mb-4">{error || "Product not found"}</p>
        <Link href="/admin/products" className="text-blue-500 hover:underline">
          <span className="flex items-center gap-2">
            <FaArrowLeft /> Back to Products
          </span>
        </Link>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <Link href="/admin/products" className="text-blue-500 hover:underline">
          <span className="flex items-center gap-2">
            <FaArrowLeft /> Back to Products
          </span>
        </Link>
        <div className="flex gap-4">
          <button
            onClick={handleEdit}
            className="bg-blue-500 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-blue-600"
          >
            <FaEdit /> Edit
          </button>
          <button
            onClick={handleDelete}
            disabled={deleteLoading}
            className="bg-red-500 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-red-600 disabled:bg-red-300"
          >
            <FaTrash /> {deleteLoading ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Product Image */}
          <div className="relative h-96">
            {product.image_url ? (
              <Image
                src={product.image_url}
                alt={product.name}
                fill
                className="object-cover rounded-lg"
              />
            ) : (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center rounded-lg">
                No image available
              </div>
            )}
          </div>

          {/* Product Details */}
          <div>
            <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
            <div className="space-y-4">
              <div>
                <h2 className="text-lg font-semibold">Price</h2>
                <p className="text-2xl text-blue-600">
                  ${Number(product.price).toFixed(2)}
                </p>
              </div>
              <div>
                <h2 className="text-lg font-semibold">Category</h2>
                <p className="text-gray-700">{product.category}</p>
              </div>
              <div>
                <h2 className="text-lg font-semibold">Description</h2>
                <p className="text-gray-700">{product.description}</p>
              </div>
              {product.video_url && (
                <div>
                  <h2 className="text-lg font-semibold">Product Video</h2>
                  <video
                    src={product.video_url}
                    controls
                    className="w-full mt-2 rounded-lg"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
