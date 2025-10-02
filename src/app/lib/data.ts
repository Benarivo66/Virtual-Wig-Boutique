import postgres from "postgres"
import { ProductField, UserField } from "./definitions"
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
    // First try to find by UUID
    let product = await sql<ProductField[]>`
      SELECT *
      FROM products
      WHERE id::text = ${id}
    `

    // If no product found and id looks like a slug, try to find by name
    if (
      !product.length &&
      !id.match(
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
      )
    ) {
      const slugToName = id
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ")
      product = await sql<ProductField[]>`
        SELECT *
        FROM products
        WHERE LOWER(name) = LOWER(${slugToName})
      `
    }

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
  `

  const requestsWithProducts = await Promise.all(
    requests.map(async (req) => {
      const products = await sql`
        SELECT * FROM request_product WHERE request_id = ${req.id};
      `
      return { ...req, products }
    })
  )

  return requestsWithProducts
}
