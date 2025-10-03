import { NextResponse } from "next/server"
import { fetchProductById } from "@/app/lib/data"

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = (await params).id
    console.log('Fetching product with ID:', id)
    
    const product = await fetchProductById(id)

    if (!product) {
      console.log('Product not found for ID:', id)
      return new NextResponse(JSON.stringify({ error: "Product not found" }), {
        status: 404,
      })
    }

    console.log('Product found:', product.id)
    return NextResponse.json(product)
  } catch (error) {
    console.error("Failed to fetch product:", error)
    return new NextResponse(
      JSON.stringify({ 
        error: "Internal Server Error",
        details: error instanceof Error ? error.message : "Unknown error"
      }),
      {
        status: 500,
      }
    )
  }
}

// added this change