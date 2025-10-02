'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import type { ProductField } from '../definitions';
import {
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
    refreshCart: () => void;   // ✅ added
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
    const { user } = useAuth();

    // Get user-specific cart key
    const getCartKey = useCallback(() => {
        return user ? `cart_${user.id}` : 'cart';
    }, [user]);

    // Load cart from localStorage
    const loadCart = useCallback(() => {
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
    }, [getCartKey]);

    // Run loadCart whenever user changes
    useEffect(() => {
        loadCart();
    }, [loadCart]);

    // Calculate totals
    const totalItems = getTotalItems(items);
    const totalPrice = getTotalPrice(items);

    // Refresh cart state manually (✅ exposed to context)
    const refreshCart = useCallback(() => {
        loadCart();
    }, [loadCart]);

    // Add item
    const addItem = useCallback(async (product: ProductField, quantity: number = 1) => {
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
    }, [items, getCartKey]);

    // Remove item
    const removeItem = useCallback((productId: string) => {
        const cartKey = getCartKey();
        const updatedCart = items.filter(item => item.id !== productId);

        if (typeof window !== 'undefined') {
            localStorage.setItem(cartKey, JSON.stringify(updatedCart));
        }
        setItems(updatedCart);
    }, [items, getCartKey]);

    // Update quantity
    const updateQuantity = useCallback((productId: string, quantity: number) => {
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
    }, [items, getCartKey]);

    // Clear cart
    const clearCart = useCallback(() => {
        const cartKey = getCartKey();
        if (typeof window !== 'undefined') {
            localStorage.removeItem(cartKey);
        }
        setItems([]);
    }, [getCartKey]);

    const value: CartContextType = {
        items,
        totalItems,
        totalPrice,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        refreshCart,   // ✅ exposed
        isLoading,
    };

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
}
