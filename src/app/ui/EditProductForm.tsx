"use client"

import { useState } from "react"
import { useActionState } from "react"
import Image from "next/image"
import uploadToCloudinary from "@/app/helper/uploadCloud"
import { updateProduct } from "@/app/lib/actions"
import { Product } from "@/app/lib/definitions"

type FormState = {
  errors?: Record<string, string[]>
  message?: string
}

const initialState: FormState = {
  errors: {},
  message: "",
}

type EditProductFormProps = {
  product: Product
}


export default function EditProductForm({ product }: EditProductFormProps) {
  const [state, formAction, isPending] = useActionState(
    updateProduct.bind(null, product.id),
    initialState
  )

  const [imageUrl, setImageUrl] = useState<string | null>(product.image_url)
  const [videoUrl, setVideoUrl] = useState<string | null>(product.video_url)
  const [uploading, setUploading] = useState(false)

  async function handleUpload(
    e: React.ChangeEvent<HTMLInputElement>,
    type: "image" | "video"
  ) {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      setUploading(true)
      const url = await uploadToCloudinary(file, type);
      if (type === "image") setImageUrl(url)
      if (type === "video") setVideoUrl(url)
    } catch (err) {
      console.error("Upload failed:", err)
    } finally {
      setUploading(false)
    }
  }

  return (
    <form action={formAction} className="space-y-4 p-4 border rounded-md">

      {/* Name */}
      <div>
        <label className="block text-sm font-medium">Name</label>
        <input
          name="name"
          defaultValue={product.name}
          required
          className="mt-1 w-full rounded border px-3 py-2"
        />
        {state.errors?.name && (
          <p className="text-red-500">{state.errors.name[0]}</p>
        )}
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium">Description</label>
        <textarea
          name="description"
          defaultValue={product.description}
          required
          className="mt-1 w-full rounded border px-3 py-2"
        />
      </div>

      {/* Price */}
      <div>
        <label className="block text-sm font-medium">Price</label>
        <input
          type="number"
          name="price"
          step="0.01"
          defaultValue={product.price}
          required
          className="mt-1 w-full rounded border px-3 py-2"
        />
      </div>

      {/* Category */}
      <div>
        <label className="block text-sm font-medium">Category</label>
        <input
          name="category"
          defaultValue={product.category}
          required
          className="mt-1 w-full rounded border px-3 py-2"
        />
      </div>

      {/* Upload note */}
      <div className="p-3 bg-yellow-50 border border-yellow-400 rounded-md text-sm">
        ⚠️ Upload either an image or a video — not both.
      </div>

      {/* Image Upload */}
      <div>
        <label className="block text-sm font-medium">Image</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => handleUpload(e, "image")}
        />
        {imageUrl && (
          <Image
            src={imageUrl}
            alt="Preview"
            width={128}
            height={128}
            className="mt-2 rounded object-cover"
          />
        )}
        <input type="hidden" name="image_url" value={imageUrl || ""} />
      </div>

      {/* Video Upload */}
      <div>
        <label className="block text-sm font-medium">Video</label>
        <input
          type="file"
          accept="video/*"
          onChange={(e) => handleUpload(e, "video")}
        />
        {videoUrl && (
          <video
            src={videoUrl}
            controls
            className="mt-2 h-32 w-full rounded"
          />
        )}
        <input type="hidden" name="video_url" value={videoUrl || ""} />
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={isPending || uploading}
        className="rounded bg-blue-600 px-4 py-2 text-white disabled:opacity-50"
      >
        {isPending ? "Updating…" : "Update Product"}
      </button>

      {state.message && (
        <p className="text-green-600 font-medium">{state.message}</p>
      )}
    </form>
  )
}
