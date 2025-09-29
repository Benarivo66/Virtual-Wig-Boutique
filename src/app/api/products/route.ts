import { NextResponse } from 'next/server';
import { products as placeholderProducts } from '@/app/lib/placeholder-data';

// Import postgres and data functions only on server side
async function fetchProductsFromDB() {
    try {
        // Dynamic import to avoid bundling postgres in client
        const { fetchProducts } = await import('@/app/lib/data');
        return await fetchProducts();
    } catch (error) {
        console.warn('Database fetch failed:', error);
        throw error;
    }
}

export async function GET() {
    try {
        // Try to fetch from database
        const products = await fetchProductsFromDB();
        return NextResponse.json(products);
    } catch (error) {
        console.warn('Database fetch failed, using placeholder data:', error);
        // Fallback to placeholder data
        return NextResponse.json(placeholderProducts);
    }
}