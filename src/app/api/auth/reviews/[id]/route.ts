import { NextResponse } from "next/server"
import postgres from "postgres"

const sql = postgres(process.env.POSTGRES_URL!, { ssl: "require" })

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Correct way in Next.js 15 - await the params
    const { id } = await params
    const productId = id
    
    console.log('Fetching reviews for product ID:', productId)

    if (!productId) {
      return new NextResponse(JSON.stringify({ error: "Product ID is required" }), {
        status: 400,
      })
    }

    // Fetch reviews for this product
    const reviews = await sql`
      SELECT 
        r.id,
        r.rating,
        r.review,
        r.created_at,
        r.purchase_verified,
        u.name as user_name,
        u.id as user_id
      FROM ratings r
      LEFT JOIN users u ON r.user_id = u.id
      WHERE r.product_id = ${productId}
      ORDER BY r.created_at DESC
    `

    console.log('Reviews found:', reviews.length)

    if (reviews.length === 0) {
      console.log('No reviews found for product:', productId)
      return NextResponse.json([])
    }

    // Format the reviews
    const formattedReviews = reviews.map(review => ({
      id: review.id,
      rating: Number(review.rating),
      review: review.review,
      created_at: review.created_at,
      purchase_verified: Boolean(review.purchase_verified),
      user_name: review.user_name,
      user_id: review.user_id
    }))

    console.log('Reviews formatted:', formattedReviews.length)
    return NextResponse.json(formattedReviews)

  } catch (error) {
    console.error("Failed to fetch reviews:", error)
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