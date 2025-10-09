"use client"

import { useState } from "react"
import { useActionState } from "react"
import { createProduct } from "@/app/lib/actions"
import uploadToCloudinary from "@/app/helper/uploadCloud"
import Image from "next/image"

type FormState = {
  errors: Record<string, string>
  message: string
}

const initialState: FormState = {
  errors: {},
  message: "",
}

export default function CreateProductForm() {
  const [state, formAction, isPending] = useActionState(
    createProduct,
    initialState
  )

  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [videoUrl, setVideoUrl] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)

  async function handleUpload(
    e: React.ChangeEvent<HTMLInputElement>,
    type: "image" | "video"
  ) {
    const file = e.target.files?.[0]
    console.log({ file })
    if (!file) return

    try {
      setUploading(true)
      const url = await uploadToCloudinary(file, type)
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
      <h2 className="text-xl font-semibold">Create Product</h2>

      {/* Name */}
      <div>
        <label className="block text-sm font-medium">Name</label>
        <input
          type="text"
          name="name"
          required
          className="mt-1 w-full rounded border px-3 py-2"
        />
        {state.errors?.name && (
          <p className="text-red-500">{state.errors.name}</p>
        )}
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium">Description</label>
        <textarea
          name="description"
          required
          className="mt-1 w-full rounded border px-3 py-2"
        />
        {state.errors?.description && (
          <p className="text-red-500">{state.errors.description}</p>
        )}
      </div>

      {/* Price */}
      <div>
        <label className="block text-sm font-medium">Price</label>
        <input
          type="number"
          name="price"
          step="0.01"
          required
          className="mt-1 w-full rounded border px-3 py-2"
        />
        {state.errors?.price && (
          <p className="text-red-500">{state.errors.price}</p>
        )}
      </div>

      {/* Category */}
      <div>
        <label className="block text-sm font-medium">Category</label>
        <input
          type="text"
          name="category"
          required
          className="mt-1 w-full rounded border px-3 py-2"
        />
        {state.errors?.category && (
          <p className="text-red-500">{state.errors.category}</p>
        )}
      </div>

      {/* Upload Warning Note */}
<div className="p-3 bg-yellow-50 border border-yellow-400 rounded-md text-yellow-800 text-sm">
  ⚠️ Please upload <span className="font-semibold">either an image or a video</span> — not both.
</div>


      {/* Image Upload */}
      <div>
        <label className="block text-sm font-medium">Image</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => handleUpload(e, "image")}
          className="mt-1"
        />
        {uploading && <p className="text-sm text-gray-500">Uploading…</p>}
        {imageUrl && (
          <Image
            src={imageUrl}
            alt="Preview"
            width={128}
            height={128}
            className="mt-2 h-32 rounded object-cover"
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
          className="mt-1"
        />
        {videoUrl && (
          <video
            src={videoUrl}
            controls
            className="mt-2 h-32 w-full rounded object-cover"
          />
        )}
        <input type="hidden" name="video_url" value={videoUrl || ""} />
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={isPending || uploading}
        className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
      >
        {isPending ? "Saving…" : "Create Product"}
      </button>

      {state.message && (
        <p className="text-green-600 font-medium">{state.message}</p>
      )}
    </form>
  )
}
