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
import { useAuth } from '../hooks/useAuth';

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
    const { user, isLoading: authLoading } = useAuth();

    // Get user-specific cart key
    const getCartKey = useCallback(() => {
        return user ? `cart_${user.id}` : 'cart';
    }, [user]);

    // Load cart from localStorage when auth state changes
    useEffect(() => {
        if (!authLoading) {
            const cartKey = getCartKey();
            if (typeof window !== 'undefined') {
                try {
                    const cart = JSON.parse(localStorage.getItem(cartKey) || '[]');
                    const processedCart = cart.map((item: any) => ({
                        ...item,
                        price: typeof item.price === 'string' ? parseFloat(item.price) : item.price,
                        quantity: typeof item.quantity === 'string' ? parseInt(item.quantity, 10) : item.quantity
                    }));
                    setItems(processedCart);
                } catch {
                    setItems([]);
                }
            }
        }
    }, [user, authLoading, getCartKey]);

    // Calculate totals
    const totalItems = getTotalItems(items);
    const totalPrice = getTotalPrice(items);

    // Refresh cart state from localStorage with user-specific key
    const refreshCart = useCallback(() => {
        if (!authLoading) {
            const cartKey = getCartKey();
            if (typeof window !== 'undefined') {
                try {
                    const cart = JSON.parse(localStorage.getItem(cartKey) || '[]');
                    const processedCart = cart.map((item: any) => ({
                        ...item,
                        price: typeof item.price === 'string' ? parseFloat(item.price) : item.price,
                        quantity: typeof item.quantity === 'string' ? parseInt(item.quantity, 10) : item.quantity
                    }));
                    setItems(processedCart);
                } catch {
                    setItems([]);
                }
            }
        }
    }, [authLoading, getCartKey]);

    // Add item to cart with user-specific storage
    const addItem = useCallback(async (product: ProductField, quantity: number = 1) => {
        if (authLoading) return;

        setIsLoading(true);
        try {
            const cartKey = getCartKey();
            const currentCart = [...items];
            const existingIndex = currentCart.findIndex(item => item.id === product.id);

            if (existingIndex > -1) {
                currentCart[existingIndex].quantity += quantity;
            } else {
                currentCart.push({ ...product, quantity });
            }

            if (typeof window !== 'undefined') {
                localStorage.setItem(cartKey, JSON.stringify(currentCart));
            }
            setItems(currentCart);
        } catch (error) {
            console.error('Error adding item to cart:', error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    }, [items, authLoading, getCartKey]);

    // Remove item from cart with user-specific storage
    const removeItem = useCallback((productId: string) => {
        if (authLoading) return;

        const cartKey = getCartKey();
        const updatedCart = items.filter(item => item.id !== productId);

        if (typeof window !== 'undefined') {
            localStorage.setItem(cartKey, JSON.stringify(updatedCart));
        }
        setItems(updatedCart);
    }, [items, authLoading, getCartKey]);

    // Update item quantity with user-specific storage
    const updateQuantity = useCallback((productId: string, quantity: number) => {
        if (authLoading) return;

        const cartKey = getCartKey();
        const updatedCart = items.map(item => {
            if (item.id === productId) {
                return quantity <= 0 ? null : { ...item, quantity };
            }
            return item;
        }).filter(Boolean) as CartItem[];

        if (typeof window !== 'undefined') {
            localStorage.setItem(cartKey, JSON.stringify(updatedCart));
        }
        setItems(updatedCart);
    }, [items, authLoading, getCartKey]);

    // Clear entire cart with user-specific storage
    const clearCart = useCallback(() => {
        if (authLoading) return;

        const cartKey = getCartKey();
        if (typeof window !== 'undefined') {
            localStorage.removeItem(cartKey);
        }
        setItems([]);
    }, [authLoading, getCartKey]);

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