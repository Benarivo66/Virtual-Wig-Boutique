import postgres from "postgres"
import { ProductField, UserField, ReviewField } from "./definitions"
import { products as placeholderProducts } from "./placeholder-data"

const sql = postgres(process.env.POSTGRES_URL!, { ssl: "require" })

export async function fetchProducts() {
  try {
    const products = await sql<ProductField[]>`
      SELECT
       *
      FROM products
      ORDER BY name ASC
    `
    return products
  } catch (err) {
    console.error("Database Error:", err)
    throw new Error("Failed to fetch all products.")
  }
}

export async function fetchProductById(id: string) {
  try {
    const product = await sql<ProductField[]>`
      SELECT
       *
      FROM products
      WHERE id = ${id}
    `

    return product[0] || null
  } catch (err) {
    console.error("Database Error:", err)
    throw new Error("Failed to fetch product.")
  }
}

export function getUniqueCategories(products: ProductField[]): string[] {
  const categories = products.map((product) => product.category)
  return [...new Set(categories)].sort()
}

export function getCategoriesFromPlaceholderData(): string[] {
  return getUniqueCategories(placeholderProducts as ProductField[])
}

// User-related database functions

export async function fetchUserByEmail(
  email: string
): Promise<UserField | null> {
  try {
    const users = await sql<UserField[]>`
      SELECT
        id, name, email, password, role
      FROM users
      WHERE email = ${email}
    `

    return users[0] || null
  } catch (err) {
    console.error("Database Error:", err)
    throw new Error("Failed to fetch user by email.")
  }
}

export async function fetchUserById(id: string): Promise<UserField | null> {
  try {
    const users = await sql<UserField[]>`
      SELECT
        id, name, email, password, role
      FROM users
      WHERE id = ${id}
    `

    return users[0] || null
  } catch (err) {
    console.error("Database Error:", err)
    throw new Error("Failed to fetch user by ID.")
  }
}

export async function createUser(
  userData: Omit<UserField, "id">
): Promise<UserField> {
  try {
    const users = await sql<UserField[]>`
      INSERT INTO users (name, email, password, role)
      VALUES (${userData.name}, ${userData.email}, ${userData.password}, ${userData.role})
      RETURNING id, name, email, password, role
    `

    return users[0]
  } catch (err) {
    console.error("Database Error:", err)
    throw new Error("Failed to create user.")
  }
}

export async function getRequests() {
  const requests = await sql`
    SELECT * FROM request ORDER BY created_at DESC;
  `;

  const requestsWithProducts = await Promise.all(
    requests.map(async (req) => {
      const products = await sql`
        SELECT * FROM request_product WHERE request_id = ${req.id};
      `;
      return { ...req, products };
    })
  );

  return requestsWithProducts;
}

// Updated the fetchProductReviews function in data.ts
// In  data.ts file, updated the fetchProductWithReviews function:

export async function fetchProductWithReviews(id: string) {
  try {
    const products = await sql<ProductField[]>`
      SELECT
        p.*,
        COALESCE(AVG(r.rating), 0) as average_rating,
        COUNT(r.id) as review_count
      FROM products p
      LEFT JOIN ratings r ON p.id = r.product_id
      WHERE p.id = ${id}
      GROUP BY p.id
    `

    const product = products[0] || null
    
    // Ensure all numeric fields are properly converted
    if (product) {
      product.average_rating = product.average_rating ? Number(product.average_rating) : 0;
      product.review_count = product.review_count ? Number(product.review_count) : 0;
      product.price = Number(product.price); // Ensure price is also a number
    }
    
    return product
  } catch (err) {
    console.error("Database Error:", err)
    throw new Error("Failed to fetch product with reviews.")
  }
}

export async function fetchProductReviews(productId: string) {
  try {
    const reviews = await sql<ReviewField[]>`
      SELECT 
        r.id,
        r.product_id,
        r.user_id,
        r.rating,
        r.review,
        r.created_at,
        u.name as user_name
      FROM ratings r
      LEFT JOIN users u ON r.user_id = u.id
      WHERE r.product_id = ${productId}
      ORDER BY r.created_at DESC
    `
    return reviews
  } catch (err) {
    console.error("Database Error:", err)
    throw new Error("Failed to fetch product reviews.")
  }
}