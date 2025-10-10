"use server"

import { z } from "zod"
import postgres from "postgres"
import { redirect } from "next/navigation"

export type State = {
  errors?: {
    [key: string]: string[]
  }
  message?: string | null
}

const sql = postgres(process.env.POSTGRES_URL!, { ssl: "require" })

const CreateProductSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  price: z.coerce.number().positive("Price must be positive"),
  category: z.string().min(1, "Category is required"),
  image_url: z.string().optional(),
  video_url: z.string().optional(),
})

export async function createProduct(prevState: any, formData: FormData) {
  const validatedFields = CreateProductSchema.safeParse({
    name: formData.get("name"),
    description: formData.get("description"),
    price: formData.get("price"),
    category: formData.get("category"),
    image_url: formData.get("image_url"),
    video_url: formData.get("video_url"),
  })

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing or invalid fields. Failed to create product.",
    }
  }

  const { name, description, price, category, image_url, video_url } =
    validatedFields.data

  try {
    await sql`
      INSERT INTO products (name, description, price, category, image_url, video_url)
      VALUES (${name}, ${description}, ${price}, ${category}, ${
      image_url || null
    }, ${video_url || null})
    `
  } catch (error) {
    console.error("Database Error:", error)
    return {
      errors: {},
      message: "Database Error: Failed to create product.",
    }
  }

  redirect("/admin/products")
}

const CreateUserSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["user", "admin"]).default("user"),
})

export async function createUser(prevState: any, formData: FormData) {
  const validatedFields = CreateUserSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
    role: formData.get("role") || "user",
  })

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing or invalid fields. Failed to create user.",
    }
  }

  const { name, email, password, role } = validatedFields.data

  try {
    // Hash the password
    const bcrypt = await import("bcrypt")
    const hashedPassword = await bcrypt.hash(password, 10)

    // Check if user already exists
    const existingUser = await sql`
      SELECT id FROM users WHERE email = ${email}
    `

    if (existingUser.length > 0) {
      return {
        errors: { email: ["User with this email already exists"] },
        message: "User already exists.",
      }
    }

    // Create the user
    await sql`
      INSERT INTO users (name, email, password, role)
      VALUES (${name}, ${email}, ${hashedPassword}, ${role})
    `

    return {
      errors: {},
      message: "User created successfully! You can now log in.",
    }
  } catch (error) {
    console.error("Database Error:", error)
    return {
      errors: {},
      message: "Database Error: Failed to create user.",
    }
  }
}

// Fixed the CreateReviewSchema in actions.ts
const CreateReviewSchema = z.object({
  productId: z.string().min(1, "Product ID is required"),
  userId: z.string().min(1, "User ID is required"),
  content: z.string().min(1, "Review content is required"), // This maps to 'review' in database
  rating: z.coerce.number().min(1).max(5, "Rating must be between 1 and 5"),
})

// Helper function to check if user has purchased the product using your request tables
async function checkUserPurchase(userId: string, productId: string): Promise<boolean> {
  try {
    const purchase = await sql`
      SELECT r.id 
      FROM request r
      JOIN request_product rp ON r.id = rp.request_id
      WHERE r.user_id = ${userId} 
        AND rp.product_id = ${productId}
        AND r.status = 'paid'
    `;
    return purchase.length > 0;
  } catch (error) {
    console.error("Error checking purchase:", error);
    return false;
  }
}

// Function to check purchase status (for UI components)
export async function getUserPurchaseStatus(userId: string, productId: string): Promise<boolean> {
  return await checkUserPurchase(userId, productId);
}

// Updated createReview function with purchase verification
export async function createReview(
  prevState: State,
  formData: FormData
): Promise<State> {
  const validatedFields = CreateReviewSchema.safeParse({
    productId: formData.get("productId"),
    userId: formData.get("userId"),
    content: formData.get("content"),
    rating: formData.get("rating"),
  })

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing or invalid fields. Failed to create review.",
    }
  }

  const { productId, userId, content, rating } = validatedFields.data

  try {
    // Check if user has purchased the product using your request system
    const hasPurchased = await checkUserPurchase(userId, productId);
    
    if (!hasPurchased) {
      return {
        errors: {},
        message: "You must purchase this product before submitting a review.",
      }
    }

    // Check if user has already reviewed this product
    const existingReview = await sql`
      SELECT id FROM ratings 
      WHERE user_id = ${userId} AND product_id = ${productId}
    `

    if (existingReview.length > 0) {
      return {
        errors: {},
        message: "You have already reviewed this product.",
      }
    }

    // Insert the new review with purchase verification
    await sql`
      INSERT INTO ratings (product_id, user_id, rating, review, created_at, purchase_verified)
      VALUES (${productId}, ${userId}, ${rating}, ${content}, NOW(), true)
    `

    // Update product stats
    try {
      await sql`
        UPDATE products 
        SET 
          average_rating = (
            SELECT COALESCE(AVG(rating::numeric), 0) 
            FROM ratings 
            WHERE product_id = ${productId}
          ),
          review_count = (
            SELECT COUNT(*) 
            FROM ratings 
            WHERE product_id = ${productId}
          )
        WHERE id = ${productId}
      `
    } catch (updateError) {
      console.warn('Error updating product stats, updating only average_rating:', updateError)
      await sql`
        UPDATE products 
        SET 
          average_rating = (
            SELECT COALESCE(AVG(rating::numeric), 0) 
            FROM ratings 
            WHERE product_id = ${productId}
          )
        WHERE id = ${productId}
      `
    }

    return {
      message: "Review created successfully!",
    }
  } catch (error) {
    console.error("Database Error:", error)
    return {
      errors: {},
      message: "Database Error: Failed to create review.",
    }
  }
}