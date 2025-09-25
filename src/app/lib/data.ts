import postgres from 'postgres';
import {
    ProductField,
    RatingField,
    UserField
} from './definitions';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

// UPDATED: Fetch all products WITH average ratings
export async function fetchProducts() {
  try {
    const products = await sql<ProductField[]>`
      SELECT 
        p.*,
        COALESCE(AVG(r.rating), 0) as average_rating,
        COUNT(r.id) as review_count
      FROM wig_products p
      LEFT JOIN ratings r ON p.id = r.product_id
      GROUP BY p.id
      ORDER BY p.name ASC
    `;
    return products;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch all products.');
  }
}

// UPDATED: Fetch single product WITH average ratings
export async function fetchProductById(id: string) {
  try {
    const products = await sql<ProductField[]>`
      SELECT 
        p.*,
        COALESCE(AVG(r.rating), 0) as average_rating,
        COUNT(r.id) as review_count
      FROM wig_products p
      LEFT JOIN ratings r ON p.id = r.product_id
      WHERE p.id = ${id}
      GROUP BY p.id
    `;
    return products[0];
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch product.');
  }
}

// Fetch reviews for a product (keep as is)
export async function fetchRatingsAndReviewsByID(productId: string) {
  try {
    const reviews = await sql<RatingField[]>`
      SELECT r.*, u.name as user_name
      FROM ratings r
      LEFT JOIN wig_users u ON r.user_id = u.id
      WHERE r.product_id = ${productId}
      ORDER BY r.created_at DESC
    `;
    return reviews;
  } catch (error) {
    console.error('Database Error:', error);
    return [];
  }
}

// Fetch user by ID (keep as is)
export async function fetchUserById(id: string) {
  try {
    const users = await sql<UserField[]>`
      SELECT * FROM wig_users WHERE id = ${id}
    `;
    return users[0];
  } catch (error) {
    console.error('Database Error:', error);
    return null;
  }
}

// Calculate average rating for a specific product (keep as is)
export async function calculateAverageRating(productId: string) {
  try {
    const result = await sql`
      SELECT 
        AVG(rating) as average_rating,
        COUNT(*) as total_reviews
      FROM ratings 
      WHERE product_id = ${productId}
    `;
    
    const avgRating = result[0]?.average_rating || 0;
    const totalReviews = result[0]?.total_reviews || 0;
    
    return {
      average_rating: Math.round(avgRating * 10) / 10,
      total_reviews: totalReviews
    };
  } catch (error) {
    console.error('Database Error:', error);
    return { average_rating: 0, total_reviews: 0 };
  }
}

// Update product with average rating (keep as is)
export async function updateProductAverageRating(productId: string) {
  try {
    const { average_rating } = await calculateAverageRating(productId);
    
    await sql`
      UPDATE wig_products 
      SET average_rating = ${average_rating}
      WHERE id = ${productId}
    `;
    
    return average_rating;
  } catch (error) {
    console.error('Database Error:', error);
  }
}