'use client';

import React from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/app/lib/contexts/CartContext";

export default function PaymentPage() {
  const router = useRouter();
  const { totalPrice, items } = useCart();

  const whatsappNumber = "2348152315397"; 
  const accountName = "Chioma Christabel Duru";
  const accountNumber = "1226791938";
  const bankName = "Access Bank";

  const message = encodeURIComponent(
    `Hello, I just made a payment of ₦${totalPrice.toLocaleString()} for my order. Here is my receipt.`
  );

  const whatsappLink = `https://wa.me/${whatsappNumber}?text=${message}`;

  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      <h1 className="text-2xl font-bold mb-6 text-center">
        Complete Your Payment
      </h1>

      {/* Order Summary */}
      <div className="bg-gray-50 p-6 rounded-lg mb-8">
        <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
        <p className="mb-2">Items: {items.length}</p>
        <p className="text-lg font-bold">
          Total Amount: ₦{totalPrice.toLocaleString()}
        </p>
      </div>

      {/* Bank Details */}
      <div className="border rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">
          Bank Transfer Details
        </h2>

        <div className="space-y-3 text-lg">
          <p>
            <span className="font-semibold">Bank Name:</span> {bankName}
          </p>
          <p>
            <span className="font-semibold">Account Name:</span> {accountName}
          </p>
          <p>
            <span className="font-semibold">Account Number:</span>{" "}
            {accountNumber}
          </p>
          <p className="text-red-600 font-semibold mt-4">
            Amount to Pay: ₦{totalPrice.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Instructions */}
      <div className="bg-yellow-50 border border-yellow-200 p-5 rounded-lg mb-8">
        <h3 className="font-semibold mb-2">Payment Instructions:</h3>
        <ol className="list-decimal ml-5 space-y-2">
          <li>Transfer the exact amount to the account above.</li>
          <li>Take a screenshot or receipt of your payment.</li>
          <li>Click the WhatsApp button below to send your receipt.</li>
          <li>Your order will be confirmed after payment verification.</li>
        </ol>
      </div>

      {/* WhatsApp Button */}
      <a
        href={whatsappLink}
        target="_blank"
        rel="noopener noreferrer"
        className="block w-full text-center bg-green-600 hover:bg-green-700 text-white font-semibold py-4 px-6 rounded-lg transition-colors duration-200"
      >
        Send Payment Receipt on WhatsApp
      </a>

      {/* Back Button */}
      <button
        onClick={() => router.push("/checkout")}
        className="w-full mt-4 bg-gray-200 hover:bg-gray-300 text-black font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
      >
        Back to Checkout
      </button>
    </div>
  );
}