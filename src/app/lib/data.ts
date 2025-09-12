import postgres from 'postgres';
import {
    ProductField
} from './definitions';

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