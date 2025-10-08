'use client';

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function OrderSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ reference?: string; requestId?: string }>;
}) {
  const [isLoading, setIsLoading] = useState(true);
  const [orderDetails, setOrderDetails] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const verifyPaymentAndProcess = async () => {
      try {
        setIsLoading(true);
        const params = await searchParams;
        const { reference } = params;

        if (reference) {
          // Verify payment with your existing API
          const verifyResponse = await fetch('/api/verify-payment', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ reference }),
          });

          const verifyResult = await verifyResponse.json();

          if (verifyResult.success) {
            setOrderDetails({
              reference: verifyResult.data.reference,
              amount: verifyResult.data.amount / 100,
            });
          } else {
            console.error('Payment verification failed:', verifyResult.message);
            // Redirect to failure page or show error
            router.push('/payment-failed');
            return;
          }
        }

      } catch (error) {
        console.error('Error processing payment success:', error);
      } finally {
        setIsLoading(false);
      }
    };

    verifyPaymentAndProcess();
  }, [searchParams, router]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-green-50 text-center px-4">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-600 mb-4"></div>
        <h2 className="text-xl font-semibold text-green-700 mb-2">Processing Your Order...</h2>
        <p className="text-gray-600">Please wait while we confirm your payment.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-green-50 text-center px-4 py-8">
      {/* Success Icon */}
      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
        <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      </div>

      {/* Success Message */}
      <h1 className="text-3xl font-bold text-green-700 mb-4">🎉 Payment Successful!</h1>
      
      <p className="text-gray-700 mb-4 text-lg">
        Thank you for your purchase! Your payment has been verified and your order is being processed.
      </p>

      {/* Order Details */}
      {orderDetails?.reference && (
        <div className="bg-white rounded-lg p-6 shadow-sm border mb-6 max-w-md w-full">
          <h3 className="font-semibold text-gray-900 mb-3">Order Details</h3>
          <div className="text-left space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Reference:</span>
              <span className="font-medium">{orderDetails.reference}</span>
            </div>
            {orderDetails.amount && (
              <div className="flex justify-between">
                <span className="text-gray-600">Amount Paid:</span>
                <span className="font-medium">${orderDetails.amount.toFixed(2)}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Review Information */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 max-w-md w-full">
        <h3 className="font-semibold text-blue-800 mb-2">You&apos;re Now a Verified Customer!</h3>
        <p className="text-blue-700 text-sm">
          You can now review the products you purchased. Your reviews will be marked as &quot;Verified Purchase&quot; to help other customers.
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Link
          href="/products"
          className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-200 shadow-sm hover:shadow-md"
        >
          Continue Shopping
        </Link>
        
        <Link
          href="/"
          className="bg-white hover:bg-gray-50 text-gray-700 font-semibold py-3 px-8 rounded-lg border border-gray-300 transition-colors duration-200 shadow-sm hover:shadow-md"
        >
          Go to Home
        </Link>
      </div>

      {/* Additional Help */}
      <div className="mt-8 text-sm text-gray-500 max-w-md">
        <p>
          Need help?{" "}
          <Link href="/contact" className="text-blue-600 hover:text-blue-800 underline">
            Contact our support team
          </Link>
        </p>
      </div>
    </div>
  );
}