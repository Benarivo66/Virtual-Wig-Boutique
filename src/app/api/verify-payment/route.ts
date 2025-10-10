import { NextResponse } from "next/server";
import postgres from "postgres";

// Create a more robust database connection
const sql = postgres(process.env.POSTGRES_URL!, { 
  ssl: "require",
  idle_timeout: 20,
  max_lifetime: 60 * 30,
});

export async function POST(req: Request) {
  try {
    const { reference } = await req.json();

    const res = await fetch(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const verifyData = await res.json();

    if (verifyData.status && verifyData.data.status === "success") {
      const paystackData = verifyData.data;

      const customFields = paystackData.metadata?.custom_fields || [];
      const phone = JSON.parse(customFields[2].value)["phone"]
      const address = JSON.parse(customFields[2].value)["address"];
      const cartField = customFields.find((f: any) => f.variable_name === "cart");

      const userId = customFields[0]?.value || "anonymous";
      const cart = cartField ? JSON.parse(cartField.value) : [];

      console.log('🔍 Payment Verification Debug:');
      console.log('📦 User ID:', userId);
      console.log('🛒 Cart items:', cart);
      console.log('💰 Amount:', paystackData.amount / 100);
      console.log('📞 Phone:', phone);
      console.log('🏠 Address:', address);

      try {
        const [order] = await sql`
          INSERT INTO request (user_id, total_amount, payment_reference, status, address, phone)
          VALUES (${userId}, ${paystackData.amount / 100}, ${paystackData.reference}, 'paid', ${address}, ${phone})
          RETURNING id;
        `;

        console.log('✅ Order created with ID:', order.id);

        let insertedProducts = 0;
        for (const item of cart) {
          console.log('📦 Inserting product:', item);
          try {
            await sql`
              INSERT INTO request_product (request_id, product_id, name, quantity, price)
              VALUES (${order.id}, ${item.id}, ${item.name}, ${item.quantity}, ${item.price});
            `;
            insertedProducts++;
            console.log('✅ Product inserted successfully');
          } catch (error) {
            console.error('❌ Failed to insert product:', error);
          }
        }

        console.log(`🎯 Total products inserted: ${insertedProducts}/${cart.length}`);

        return NextResponse.json({ 
          success: true, 
          data: paystackData,
          debug: {
            orderId: order.id,
            productsInserted: insertedProducts,
            totalCartItems: cart.length
          }
        });
      } catch (dbError) {
        console.error('❌ Database error during order creation:', dbError);
        return NextResponse.json(
          { success: false, message: "Database error during order creation" },
          { status: 500 }
        );
      }
    } else {
      return NextResponse.json(
        { success: false, message: "Payment verification failed" },
        { status: 400 }
      );
    }
  } catch (error: any) {
    console.error("Verify payment error:", error);
    return NextResponse.json(
      { success: false, message: "Server error during payment verification" },
      { status: 500 }
    );
  }
}