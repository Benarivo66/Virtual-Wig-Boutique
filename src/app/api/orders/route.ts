import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/app/lib/jwt';
import { ErrorResponse } from '@/app/lib/auth-types';
import postgres from "postgres";

const sql = postgres(process.env.POSTGRES_URL!, { ssl: "require" });

export async function GET(request: NextRequest) {
  try {
    // Get token from cookies
    const token = request.cookies.get('auth-token')?.value;

    if (!token) {
      const errorResponse: ErrorResponse = {
        error: 'Unauthorized',
        message: 'No authentication token provided',
        statusCode: 401,
      };
      return NextResponse.json(errorResponse, { status: 401 });
    }

    // Verify the token
    const payload = verifyToken(token);
    
    if (!payload || !payload.id) {
      const errorResponse: ErrorResponse = {
        error: 'Unauthorized',
        message: 'Invalid or expired authentication token',
        statusCode: 401,
      };
      return NextResponse.json(errorResponse, { status: 401 });
    }

    const userId = payload.id;

    // Get user's orders
    const userOrders = await sql`
      SELECT 
        id,
        user_id,
        total_amount,
        status,
        payment_reference,
        created_at,
        address,
        phone
      FROM request 
      WHERE user_id = ${userId}
      ORDER BY created_at DESC
    `;

    if (userOrders.length === 0) {
      return NextResponse.json([]);
    }

    // Query products for each order
    let allOrderProducts: any[] = [];

    for (const order of userOrders) {
      try {
        const productsForOrder = await sql`
          SELECT 
            request_id,
            product_id,
            name,
            quantity,
            price
          FROM request_product 
          WHERE request_id = ${order.id}
        `;
        allOrderProducts = [...allOrderProducts, ...productsForOrder];
      } catch (error) {
        console.error(`❌ Error fetching products for order ${order.id}:`, error);
      }
    }

    // Combine data manually
    const ordersWithItems = userOrders.map(order => {
      const items = allOrderProducts
        .filter(product => product.request_id === order.id)
        .map(product => ({
          product_id: product.product_id,
          name: product.name,
          quantity: product.quantity,
          price: parseFloat(product.price)
        }));

      return {
        id: order.id,
        total_amount: parseFloat(order.total_amount),
        status: order.status,
        payment_reference: order.payment_reference,
        created_at: order.created_at,
        address: order.address,
        phone: order.phone,
        items: items
      };
    });
    
    // Log each order's items for debugging
    ordersWithItems.forEach(order => {
      order.items.forEach(item => {
      });
    });
    
    return NextResponse.json(ordersWithItems);

  } catch (error) {
    console.error("❌ Error fetching orders:", error);
    // Return empty array on error to prevent frontend crashes
    return NextResponse.json([]);
  }
}