import { NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import postgres from "postgres"
import { JWTPayload } from "@/app/lib/auth-types"
import { verifyToken } from "@/app/lib/jwt-unified"

const sql = postgres(process.env.POSTGRES_URL!, { ssl: "require" })

export async function GET(request: NextRequest) {
  try {
    // Get the auth token from cookies
    const cookieStore = cookies()
    const token = (await cookieStore).get("auth-token")?.value

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Verify the token and get user ID
    const payload = await verifyToken(token)
    if (!payload?.id) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }

    const userId = payload.id

    // Fetch orders for the user
    const orders = await sql`
      SELECT r.*, rp.*
      FROM request r
      LEFT JOIN request_product rp ON r.id = rp.request_id
      WHERE r.user_id = ${userId}
      ORDER BY r.created_at DESC
    `

    // Transform the data to match the expected format
    const transformedOrders = orders.reduce((acc: any[], order: any) => {
      const existingOrder = acc.find((o) => o.id === order.request_id)

      if (existingOrder) {
        existingOrder.items.push({
          id: order.id,
          productName: order.name,
          quantity: order.quantity,
          price: order.price,
        })
      } else {
        acc.push({
          id: order.id,
          createdAt: order.created_at,
          status: order.status,
          totalAmount: order.total_amount,
          items: order.name
            ? [
                {
                  id: order.id,
                  productName: order.name,
                  quantity: order.quantity,
                  price: order.price,
                },
              ]
            : [],
        })
      }

      return acc
    }, [])

    return NextResponse.json(transformedOrders)
  } catch (error) {
    console.error("Error fetching orders:", error)
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    )
  }
}
