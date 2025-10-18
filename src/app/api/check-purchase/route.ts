import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/app/lib/jwt';
import { ErrorResponse } from '@/app/lib/auth-types';
import postgres from "postgres";

const sql = postgres(process.env.POSTGRES_URL!, { ssl: "require" });

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('productId');
    
    // Get token from cookies for user verification
    const token = request.cookies.get('auth-token')?.value;

    if (!token) {
      return NextResponse.json({ hasPurchased: false });
    }

    // Verify the token to get user ID
    const payload = verifyToken(token);
    
    if (!payload || !payload.id) {
      return NextResponse.json({ hasPurchased: false });
    }

    const userId = payload.id;

    if (!productId) {
      return NextResponse.json({ hasPurchased: false });
    }

    // Check if user has purchased this product
    const purchase = await sql`
      SELECT rp.request_id 
      FROM request_product rp
      JOIN request r ON rp.request_id = r.id
      WHERE r.user_id = ${userId} 
        AND rp.product_id = ${productId}
        AND r.status = 'paid'
      LIMIT 1
    `;

    const hasPurchased = purchase.length > 0;
    
    return NextResponse.json({ hasPurchased });

  } catch (error) {
    console.error("Error checking purchase:", error);
    return NextResponse.json({ hasPurchased: false });
  }
}