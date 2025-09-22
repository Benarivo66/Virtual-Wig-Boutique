import { ProductField } from './definitions';

export function getUniqueCategories(products: ProductField[]): string[] {
    const categories = products.map(product => product.category);
    return [...new Set(categories)].sort();
}

export function getCategoriesFromPlaceholderData(products: ProductField[]): string[] {
    return getUniqueCategories(products);
}