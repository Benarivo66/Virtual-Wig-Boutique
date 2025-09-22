import postgres from 'postgres';
import {
  ProductField
} from './definitions';
import { products as placeholderProducts } from './placeholder-data';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

export async function fetchProducts() {
  try {
    const products = await sql<ProductField[]>`
      SELECT
       *
      FROM wig_products
      ORDER BY name ASC
    `;

    return products;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch all products.');
  }
}

export function getUniqueCategories(products: ProductField[]): string[] {
  const categories = products.map(product => product.category);
  return [...new Set(categories)].sort();
}

export function getCategoriesFromPlaceholderData(): string[] {
  return getUniqueCategories(placeholderProducts as ProductField[]);
}