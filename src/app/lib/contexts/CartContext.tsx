'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import type { ProductField } from '../definitions';
import {
    getCart,
    addToCart as addToCartUtil,
    removeItem as removeItemUtil,
    updateQuantity as updateQuantityUtil,
    clearCart as clearCartUtil,
    getTotalItems,
    getTotalPrice,
    type CartItem
} from '../cart';

interface CartContextType {
    items: CartItem[];
    totalItems: number;
    totalPrice: number;
    addItem: (product: ProductField, quantity?: number) => Promise<void>;
    removeItem: (productId: string) => void;
    updateQuantity: (productId: string, quantity: number) => void;
    clearCart: () => void;
    isLoading: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function useCart() {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
}

interface CartProviderProps {
    children: React.ReactNode;
}

export function CartProvider({ children }: CartProviderProps) {
    const [items, setItems] = useState<CartItem[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    // Load cart from localStorage on mount
    useEffect(() => {
        setItems(getCart());
    }, []);

    // Calculate totals
    const totalItems = getTotalItems(items);
    const totalPrice = getTotalPrice(items);

    // Refresh cart state from localStorage
    const refreshCart = useCallback(() => {
        setItems(getCart());
    }, []);

    // Add item to cart
    const addItem = useCallback(async (product: ProductField, quantity: number = 1) => {
        setIsLoading(true);
        try {
            // Add multiple quantities if specified
            for (let i = 0; i < quantity; i++) {
                addToCartUtil(product);
            }
            refreshCart();
        } catch (error) {
            console.error('Error adding item to cart:', error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    }, [refreshCart]);

    // Remove item from cart
    const removeItem = useCallback((productId: string) => {
        removeItemUtil(productId);
        refreshCart();
    }, [refreshCart]);

    // Update item quantity
    const updateQuantity = useCallback((productId: string, quantity: number) => {
        updateQuantityUtil(productId, quantity);
        refreshCart();
    }, [refreshCart]);

    // Clear entire cart
    const clearCart = useCallback(() => {
        clearCartUtil();
        refreshCart();
    }, [refreshCart]);

    const value: CartContextType = {
        items,
        totalItems,
        totalPrice,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        isLoading,
    };

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
}