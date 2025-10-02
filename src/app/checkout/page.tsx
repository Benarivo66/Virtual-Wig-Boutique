'use client';

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { useAuth } from "@/app/lib/hooks/useAuth";
import { useCart } from "@/app/lib/contexts/CartContext";
import { useToast } from "@/app/lib/contexts/ToastContext";
import "../page.css";

const PaystackButton = dynamic(
  () => import("react-paystack").then((mod) => mod.PaystackButton),
  { ssr: false }
);
interface ShippingInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

function CheckoutPage() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const { items, totalPrice, clearCart, refreshCart } = useCart();
  const { showSuccess, showError, showWarning } = useToast();

  const [shippingInfo, setShippingInfo] = useState<ShippingInfo>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
  });

  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  useEffect(() => {
    refreshCart();
  }, [refreshCart]);

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setShippingInfo({ ...shippingInfo, [e.target.name]: e.target.value });
  };

const paystackConfig = {
  reference: new Date().getTime().toString(),
  email: shippingInfo.email || user?.email || "",
  amount: totalPrice * 100, // Paystack requires amount in kobo
  publicKey: process.env.NEXT_PUBLIC_PAYSTACK_KEY!,
  metadata: {
    custom_fields: [
      {
        display_name: "User ID",
        variable_name: "user_id",
        value: user?.id,
      },
      {
        display_name: "Cart",
        variable_name: "cart",
        value: JSON.stringify(
          items.map((item) => ({
            id: item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
          }))
        ),
      },
      {
        display_name: "Shipping Info",
        variable_name: "shipping_info",
        value: JSON.stringify(shippingInfo),
      },
    ],
  },
};

  const handlePaymentClose = () => {
    showWarning("Payment Cancelled", "You cancelled the payment.");
  };

const handlePaymentSuccess = async (reference: any) => {
  try {
    const res = await fetch("/api/verify-payment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reference: reference.reference }),
    });

    const result = await res.json();

    if (result.success) {
      showSuccess("Payment Verified", "Your order has been placed.");
      clearCart();
      router.push("/order-success");
    } else {
      showError("Payment Failed", "Could not verify your payment. Please contact support.");
    }
  } catch (err) {
    console.error("Verification error:", err);
    showError("Server Error", "Unable to verify payment right now.");
  }
};


  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">Checkout</h1>

      {/* Shipping Form */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <input
          name="firstName"
          placeholder="First Name"
          value={shippingInfo.firstName}
          onChange={handleInputChange}
          className="border p-2 rounded"
        />
        <input
          name="lastName"
          placeholder="Last Name"
          value={shippingInfo.lastName}
          onChange={handleInputChange}
          className="border p-2 rounded"
        />
        <input
          name="email"
          placeholder="Email"
          value={shippingInfo.email}
          onChange={handleInputChange}
          className="border p-2 rounded col-span-2"
        />
        <input
          name="phone"
          placeholder="Phone"
          value={shippingInfo.phone}
          onChange={handleInputChange}
          className="border p-2 rounded col-span-2"
        />
        <input
          name="address"
          placeholder="Address"
          value={shippingInfo.address}
          onChange={handleInputChange}
          className="border p-2 rounded col-span-2"
        />
        <input
          name="city"
          placeholder="City"
          value={shippingInfo.city}
          onChange={handleInputChange}
          className="border p-2 rounded"
        />
        <input
          name="state"
          placeholder="State"
          value={shippingInfo.state}
          onChange={handleInputChange}
          className="border p-2 rounded"
        />
        <input
          name="zipCode"
          placeholder="Zip Code"
          value={shippingInfo.zipCode}
          onChange={handleInputChange}
          className="border p-2 rounded"
        />
        <input
          name="country"
          placeholder="Country"
          value={shippingInfo.country}
          onChange={handleInputChange}
          className="border p-2 rounded"
        />
      </div>

      {/* Order Summary */}
      <div className="bg-gray-50 p-4 rounded-lg mb-6">
        <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
        <p>Items: {items.length}</p>
        <p>Total: ₦{totalPrice.toLocaleString()}</p>
      </div>

  <PaystackButton
    reference={paystackConfig.reference}
    email={paystackConfig.email}
    amount={paystackConfig.amount}
    publicKey={paystackConfig.publicKey}
    metadata={paystackConfig.metadata}
    text={isPlacingOrder ? "Processing..." : "Pay Now"}
    onSuccess={handlePaymentSuccess}
    onClose={handlePaymentClose}
    className="cursor-pointer w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 text-center"
    disabled={items.length === 0 || !shippingInfo.email}
  />

    </div>
  );
}

export default CheckoutPage;

