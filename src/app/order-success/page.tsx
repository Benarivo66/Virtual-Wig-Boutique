'use client';

import Link from "next/link";

export default function OrderSuccessPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-green-50 text-center px-4">
      <h1 className="text-3xl font-bold text-green-700 mb-4">🎉 Payment Successful!</h1>
      <p className="text-gray-700 mb-6">
        Thank you for your order. Your payment has been verified and your order is being processed.
      </p>
      <Link
        href="/"
        className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors duration-200"
      >
        Go to Home
      </Link>
    </div>
  );
}
