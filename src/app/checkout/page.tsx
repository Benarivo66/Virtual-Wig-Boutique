'use client';

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/lib/hooks/useAuth";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/app/lib/contexts/CartContext";
import { useToast } from "@/app/lib/contexts/ToastContext";
import "../page.css";

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

interface PaymentInfo {
    cardNumber: string;
    expiryDate: string;
    cvv: string;
    nameOnCard: string;
}

interface OrderSummary {
    subtotal: number;
    shipping: number;
    tax: number;
    total: number;
}

function CheckoutPage() {
    const { user, isLoading: authLoading } = useAuth();
    const router = useRouter();
    const { items, totalItems, totalPrice, clearCart } = useCart();
    const { showSuccess, showError, showWarning } = useToast();

    const [isLoading, setIsLoading] = useState(false);
    const [orderPlaced, setOrderPlaced] = useState(false);
    const [orderId, setOrderId] = useState<string>('');
    const [authError, setAuthError] = useState<string | null>(null);

    // Form states
    const [shippingInfo, setShippingInfo] = useState<ShippingInfo>({
        firstName: '',
        lastName: '',
        email: user?.email || '',
        phone: '',
        address: '',
        city: '',
        state: '',
        zipCode: '',
        country: 'US'
    });

    const [paymentInfo, setPaymentInfo] = useState<PaymentInfo>({
        cardNumber: '',
        expiryDate: '',
        cvv: '',
        nameOnCard: ''
    });

    // Calculate order summary
    const calculateOrderSummary = (): OrderSummary => {
        const subtotal = totalPrice;
        const shipping = subtotal > 100 ? 0 : 9.99; // Free shipping over $100
        const tax = subtotal * 0.08; // 8% tax rate
        const total = subtotal + shipping + tax;

        return { subtotal, shipping, tax, total };
    };

    const orderSummary = calculateOrderSummary();

    // Authentication check
    useEffect(() => {
        if (authLoading) return; // Still loading

        if (!user) {
            // Clear any previous auth errors
            setAuthError(null);

            // Show warning and redirect to login with return URL
            showWarning(
                "Authentication Required",
                "Please sign in to continue with checkout. You'll be redirected back after signing in."
            );

            router.push('/auth?callbackUrl=' + encodeURIComponent('/checkout'));
            return;
        }

        if (user) {
            // Clear any auth errors on successful authentication
            setAuthError(null);

            // Update email if user is authenticated
            if (user.email && !shippingInfo.email) {
                setShippingInfo(prev => ({
                    ...prev,
                    email: user.email || ''
                }));
            }
        }
    }, [authLoading, user, router, shippingInfo.email, showWarning]);

    // Check if cart is empty
    useEffect(() => {
        if (items.length === 0 && !orderPlaced) {
            showWarning("Empty Cart", "Your cart is empty. Please add some items before checking out.");
            router.push('/cart');
        }
    }, [items.length, orderPlaced, router, showWarning]);

    // Handle form input changes
    const handleShippingChange = (field: keyof ShippingInfo, value: string) => {
        setShippingInfo(prev => ({ ...prev, [field]: value }));
    };

    const handlePaymentChange = (field: keyof PaymentInfo, value: string) => {
        setPaymentInfo(prev => ({ ...prev, [field]: value }));
    };

    // Validate forms
    const validateShippingInfo = (): boolean => {
        const required = ['firstName', 'lastName', 'email', 'phone', 'address', 'city', 'state', 'zipCode'];
        return required.every(field => shippingInfo[field as keyof ShippingInfo].trim() !== '');
    };

    const validatePaymentInfo = (): boolean => {
        const required = ['cardNumber', 'expiryDate', 'cvv', 'nameOnCard'];
        return required.every(field => paymentInfo[field as keyof PaymentInfo].trim() !== '');
    };

    // Handle order submission
    const handlePlaceOrder = async () => {
        // Double-check authentication before processing order
        if (!user) {
            setAuthError("Authentication session expired. Please sign in again.");
            showError("Authentication Error", "Your session has expired. Please sign in again to continue.");
            router.push('/auth?callbackUrl=' + encodeURIComponent('/checkout'));
            return;
        }

        if (!validateShippingInfo()) {
            showError("Validation Error", "Please fill in all shipping information fields.");
            return;
        }

        if (!validatePaymentInfo()) {
            showError("Validation Error", "Please fill in all payment information fields.");
            return;
        }

        setIsLoading(true);

        try {
            // Simulate order processing
            await new Promise(resolve => setTimeout(resolve, 2000));

            // Generate order ID
            const newOrderId = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
            setOrderId(newOrderId);

            // Clear cart and show success
            clearCart();
            setOrderPlaced(true);
            showSuccess("Order Placed!", `Your order ${newOrderId} has been placed successfully.`);

        } catch (error) {
            showError("Order Failed", "There was an error processing your order. Please try again.");
            console.error('Order error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    // Loading state while checking authentication
    if (authLoading) {
        return (
            <div className="homepage-container min-h-screen">
                <main className="content-wrapper flex items-center justify-center">
                    <div className="text-center">
                        <div className="loading-spinner mx-auto mb-4"></div>
                        <p className="text-gray-600">Loading checkout...</p>
                    </div>
                </main>
            </div>
        );
    }

    // Order confirmation view
    if (orderPlaced) {
        return (
            <div className="homepage-container min-h-screen">
                <main className="content-wrapper" role="main">
                    <div className="section-spacing">
                        <div className="max-w-2xl mx-auto text-center">
                            <div className="content-section">
                                {/* Success Icon */}
                                <div className="mb-8">
                                    <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                                        <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                </div>

                                <h1 className="text-3xl font-bold text-gray-900 mb-4">Order Confirmed!</h1>
                                <p className="text-lg text-gray-600 mb-6">
                                    Thank you for your purchase. Your order has been successfully placed.
                                </p>

                                <div className="bg-gray-50 rounded-lg p-6 mb-8">
                                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Details</h2>
                                    <div className="space-y-2 text-left">
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Order Number:</span>
                                            <span className="font-semibold">{orderId}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Total Amount:</span>
                                            <span className="font-semibold">${orderSummary.total.toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Email:</span>
                                            <span className="font-semibold">{shippingInfo.email}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <p className="text-gray-600">
                                        A confirmation email has been sent to {shippingInfo.email}
                                    </p>
                                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                        <Link
                                            href="/"
                                            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
                                        >
                                            Continue Shopping
                                        </Link>
                                        <Link
                                            href="/me"
                                            className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
                                        >
                                            View Account
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div className="homepage-container min-h-screen">
            <main className="content-wrapper" role="main" aria-label="Checkout">
                <div className="section-spacing">
                    {/* Page Header */}
                    <div className="section-header left-aligned">
                        <h1 className="section-title">Checkout</h1>
                        <p className="section-subtitle">
                            Complete your order - {totalItems} item{totalItems !== 1 ? 's' : ''} in your cart
                        </p>
                    </div>

                    {/* Authentication Error Display */}
                    {authError && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                            <div className="flex items-center">
                                <svg className="w-5 h-5 text-red-600 mr-3" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                                <div>
                                    <h3 className="text-sm font-medium text-red-800">Authentication Error</h3>
                                    <p className="text-sm text-red-700 mt-1">{authError}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Checkout Forms */}
                        <div className="lg:col-span-2 space-y-8">
                            {/* Shipping Information */}
                            <div className="content-section">
                                <h2 className="text-xl font-semibold text-gray-900 mb-6">Shipping Information</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                                            First Name *
                                        </label>
                                        <input
                                            type="text"
                                            id="firstName"
                                            value={shippingInfo.firstName}
                                            onChange={(e) => handleShippingChange('firstName', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                                            Last Name *
                                        </label>
                                        <input
                                            type="text"
                                            id="lastName"
                                            value={shippingInfo.lastName}
                                            onChange={(e) => handleShippingChange('lastName', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                            Email Address *
                                        </label>
                                        <input
                                            type="email"
                                            id="email"
                                            value={shippingInfo.email}
                                            onChange={(e) => handleShippingChange('email', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                                            Phone Number *
                                        </label>
                                        <input
                                            type="tel"
                                            id="phone"
                                            value={shippingInfo.phone}
                                            onChange={(e) => handleShippingChange('phone', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            required
                                        />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                                            Street Address *
                                        </label>
                                        <input
                                            type="text"
                                            id="address"
                                            value={shippingInfo.address}
                                            onChange={(e) => handleShippingChange('address', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-2">
                                            City *
                                        </label>
                                        <input
                                            type="text"
                                            id="city"
                                            value={shippingInfo.city}
                                            onChange={(e) => handleShippingChange('city', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-2">
                                            State *
                                        </label>
                                        <input
                                            type="text"
                                            id="state"
                                            value={shippingInfo.state}
                                            onChange={(e) => handleShippingChange('state', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700 mb-2">
                                            ZIP Code *
                                        </label>
                                        <input
                                            type="text"
                                            id="zipCode"
                                            value={shippingInfo.zipCode}
                                            onChange={(e) => handleShippingChange('zipCode', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-2">
                                            Country *
                                        </label>
                                        <select
                                            id="country"
                                            value={shippingInfo.country}
                                            onChange={(e) => handleShippingChange('country', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            required
                                        >
                                            <option value="US">United States</option>
                                            <option value="CA">Canada</option>
                                            <option value="UK">United Kingdom</option>
                                            <option value="AU">Australia</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            {/* Payment Information */}
                            <div className="content-section">
                                <h2 className="text-xl font-semibold text-gray-900 mb-6">Payment Information</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="md:col-span-2">
                                        <label htmlFor="nameOnCard" className="block text-sm font-medium text-gray-700 mb-2">
                                            Name on Card *
                                        </label>
                                        <input
                                            type="text"
                                            id="nameOnCard"
                                            value={paymentInfo.nameOnCard}
                                            onChange={(e) => handlePaymentChange('nameOnCard', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            required
                                        />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700 mb-2">
                                            Card Number *
                                        </label>
                                        <input
                                            type="text"
                                            id="cardNumber"
                                            value={paymentInfo.cardNumber}
                                            onChange={(e) => handlePaymentChange('cardNumber', e.target.value)}
                                            placeholder="1234 5678 9012 3456"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700 mb-2">
                                            Expiry Date *
                                        </label>
                                        <input
                                            type="text"
                                            id="expiryDate"
                                            value={paymentInfo.expiryDate}
                                            onChange={(e) => handlePaymentChange('expiryDate', e.target.value)}
                                            placeholder="MM/YY"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="cvv" className="block text-sm font-medium text-gray-700 mb-2">
                                            CVV *
                                        </label>
                                        <input
                                            type="text"
                                            id="cvv"
                                            value={paymentInfo.cvv}
                                            onChange={(e) => handlePaymentChange('cvv', e.target.value)}
                                            placeholder="123"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Security Notice */}
                                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                                    <div className="flex items-center text-sm text-gray-600">
                                        <svg className="w-4 h-4 mr-2 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                                        </svg>
                                        Your payment information is secure and encrypted
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Order Summary */}
                        <div className="lg:col-span-1">
                            <div className="content-section sticky top-8">
                                <h2 className="text-xl font-semibold text-gray-900 mb-6">Order Summary</h2>

                                {/* Cart Items */}
                                <div className="space-y-4 mb-6">
                                    {items.map((item) => (
                                        <div key={item.id} className="flex items-center space-x-4">
                                            <div className="flex-shrink-0">
                                                <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden">
                                                    {item.image_url ? (
                                                        <Image
                                                            src={item.image_url}
                                                            alt={item.name}
                                                            width={64}
                                                            height={64}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                                                                <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                                                            </svg>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="flex-grow">
                                                <h3 className="font-medium text-gray-900 text-sm">{item.name}</h3>
                                                <p className="text-gray-600 text-xs">{item.category}</p>
                                                <div className="flex justify-between items-center mt-1">
                                                    <span className="text-gray-600 text-sm">Qty: {item.quantity}</span>
                                                    <span className="font-semibold text-gray-900 text-sm">
                                                        ${((typeof item.price === 'string' ? parseFloat(item.price) : item.price) * item.quantity).toFixed(2)}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Order Totals */}
                                <div className="space-y-3 mb-6 border-t pt-4">
                                    <div className="flex justify-between text-gray-600">
                                        <span>Subtotal ({totalItems} items)</span>
                                        <span>${orderSummary.subtotal.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-gray-600">
                                        <span>Shipping</span>
                                        <span>
                                            {orderSummary.shipping === 0 ? (
                                                <span className="text-green-600">Free</span>
                                            ) : (
                                                `$${orderSummary.shipping.toFixed(2)}`
                                            )}
                                        </span>
                                    </div>
                                    <div className="flex justify-between text-gray-600">
                                        <span>Tax</span>
                                        <span>${orderSummary.tax.toFixed(2)}</span>
                                    </div>
                                    <div className="border-t pt-3">
                                        <div className="flex justify-between text-xl font-semibold text-gray-900">
                                            <span>Total</span>
                                            <span>${orderSummary.total.toFixed(2)}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Free Shipping Notice */}
                                {orderSummary.subtotal < 100 && (
                                    <div className="mb-6 p-3 bg-blue-50 rounded-lg">
                                        <p className="text-sm text-blue-800">
                                            Add ${(100 - orderSummary.subtotal).toFixed(2)} more for free shipping!
                                        </p>
                                    </div>
                                )}

                                {/* Place Order Button */}
                                <button
                                    onClick={handlePlaceOrder}
                                    disabled={isLoading}
                                    className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 mb-4"
                                >
                                    {isLoading ? (
                                        <div className="flex items-center justify-center">
                                            <div className="loading-spinner mr-2"></div>
                                            Processing Order...
                                        </div>
                                    ) : (
                                        `Place Order - $${orderSummary.total.toFixed(2)}`
                                    )}
                                </button>

                                {/* Back to Cart */}
                                <Link
                                    href="/cart"
                                    className="block w-full text-center bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
                                >
                                    Back to Cart
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default CheckoutPage;