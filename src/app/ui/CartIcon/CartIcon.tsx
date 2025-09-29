'use client';

import React, { useEffect, useState } from 'react';
import { FaShoppingCart } from 'react-icons/fa';
import { useCart } from '@/app/lib/contexts/CartContext';
import './CartIcon.css';

interface CartIconProps {
    className?: string;
    showCount?: boolean;
}

export default function CartIcon({ className = '', showCount = true }: CartIconProps) {
    const { totalItems } = useCart();
    const [isAnimating, setIsAnimating] = useState(false);
    const [prevCount, setPrevCount] = useState(totalItems);

    // Trigger bounce animation when cart count changes
    useEffect(() => {
        if (totalItems > prevCount) {
            setIsAnimating(true);
            const timer = setTimeout(() => {
                setIsAnimating(false);
            }, 600); // Animation duration

            return () => clearTimeout(timer);
        }
        setPrevCount(totalItems);
    }, [totalItems, prevCount]);

    return (
        <div className={`cart-icon-container ${className}`}>
            <div className={`cart-icon-wrapper ${isAnimating ? 'cart-bounce' : ''}`}>
                <FaShoppingCart
                    className="cart-icon"
                    aria-hidden="true"
                />
                {showCount && totalItems > 0 && (
                    <span
                        className={`cart-badge ${isAnimating ? 'cart-badge-pulse' : ''}`}
                        aria-label={`${totalItems} items in cart`}
                    >
                        {totalItems > 99 ? '99+' : totalItems}
                    </span>
                )}
            </div>
            <span className="sr-only">
                Shopping Cart {totalItems > 0 ? `(${totalItems} items)` : '(empty)'}
            </span>
        </div>
    );
}