import { NextResponse } from "next/server"
import { fetchProductById } from "@/app/lib/data"

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const id = (await params).id
    const product = await fetchProductById(id)

    if (!product) {
      return new NextResponse(JSON.stringify({ error: "Product not found" }), {
        status: 404,
      })
    }

    return NextResponse.json(product)
  } catch (error) {
    console.error("Failed to fetch product:", error)
    return new NextResponse(
      JSON.stringify({ error: "Internal Server Error" }),
      {
        status: 500,
      }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const id = (await params).id
    // First check if product exists
    const product = await fetchProductById(id)

    if (!product) {
      return new NextResponse(JSON.stringify({ error: "Product not found" }), {
        status: 404,
      })
    }

    // TODO: Implement delete product functionality in data.ts
    // await deleteProduct(id)

    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error("Failed to delete product:", error)
    return new NextResponse(
      JSON.stringify({ error: "Internal Server Error" }),
      {
        status: 500,
      }
    )
  }
}
