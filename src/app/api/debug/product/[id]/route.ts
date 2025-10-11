import { NextRequest, NextResponse } from 'next/server';
import postgres from "postgres";

const sql = postgres(process.env.POSTGRES_URL!, { ssl: "require" });

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params; // AWAIT THE PARAMS
    
    console.log('DEBUG: Fetching product with ID:', id);

    if (!id || id === 'undefined') {
      return NextResponse.json(
        { error: "Product ID is required" },
        { status: 400 }
      );
    }

    // Simple direct database query
    const products = await sql`
      SELECT * FROM products WHERE id = ${id}
    `;

    console.log('DEBUG: Products found:', products.length);

    if (products.length === 0) {
      return NextResponse.json(
        { error: "Product not found", productId: id },
        { status: 404 }
      );
    }

    const product = products[0];
    console.log('DEBUG: Product data:', product);
    
    return NextResponse.json({
      success: true,
      product: {
        ...product,
        price: Number(product.price),
        average_rating: product.average_rating ? Number(product.average_rating) : null,
        review_count: product.review_count ? Number(product.review_count) : 0
      }
    });

  } catch (error) {
    console.error('DEBUG: Database Error:', error);
    return NextResponse.json(
      { 
        error: "Database error",
        message: error instanceof Error ? error.message : "Unknown error",
        stack: process.env.NODE_ENV === 'development' ? error instanceof Error ? error.stack : undefined : undefined
      },
      { status: 500 }
    );
  }
}