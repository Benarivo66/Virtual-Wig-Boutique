'use client';

import { useCart } from './lib/contexts';
import type { ProductField } from './lib/definitions';

// Test component to verify cart functionality
export default function TestCart() {
    const { items, totalItems, totalPrice, addItem, removeItem, updateQuantity, clearCart, isLoading } = useCart();

    const testProduct: ProductField = {
        id: 'test-1',
        name: 'Test Wig',
        description: 'A test wig for cart functionality',
        price: 99.99,
        category: 'Straight',
        image_url: '/test.jpg'
    };

    return (
        <div style={{ padding: '20px', border: '1px solid #ccc', margin: '20px' }}>
            <h3>Cart Test Component</h3>
            <p>Total Items: {totalItems}</p>
            <p>Total Price: ${totalPrice.toFixed(2)}</p>
            <p>Loading: {isLoading ? 'Yes' : 'No'}</p>

            <div>
                <button onClick={() => addItem(testProduct)}>Add Test Product</button>
                <button onClick={() => removeItem('test-1')}>Remove Test Product</button>
                <button onClick={() => updateQuantity('test-1', 3)}>Set Quantity to 3</button>
                <button onClick={clearCart}>Clear Cart</button>
            </div>

            <div>
                <h4>Cart Items:</h4>
                {items.map(item => (
                    <div key={item.id}>
                        {item.name} - Quantity: {item.quantity} - Price: ${(item.price * item.quantity).toFixed(2)}
                    </div>
                ))}
            </div>
        </div>
    );
}