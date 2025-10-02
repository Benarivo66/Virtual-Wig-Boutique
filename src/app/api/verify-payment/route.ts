import { NextResponse } from "next/server";
import postgres from "postgres";

const sql = postgres(process.env.POSTGRES_URL!, { ssl: "require" });

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

      const [order] = await sql`
        INSERT INTO request (user_id, total_amount, payment_reference, status, address, phone)
        VALUES (${userId}, ${paystackData.amount / 100}, ${paystackData.reference}, 'paid', ${address}, ${phone})
        RETURNING id;
      `;

      for (const item of cart) {
        await sql`
          INSERT INTO request_product (request_id, product_id, name, quantity, price)
          VALUES (${order.id}, ${item.id}, ${item.name}, ${item.quantity}, ${item.price});
        `;
      }

      return NextResponse.json({ success: true, data: paystackData });
    } else {
      return NextResponse.json(
        { success: false, message: "Payment verification failed" },
        { status: 400 }
      );
    }
  } catch (error: any) {
    console.error("Verify payment error:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
