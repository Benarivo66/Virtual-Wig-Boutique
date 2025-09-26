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
      VALUES (${name}, ${description}, ${price}, ${category}, ${image_url || null
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

const CreateReviewSchema = z.object({
  productId: z.string().min(1, "Product ID is required"),
  userId: z.string().min(1, "User ID is required"),
  review: z.string().min(1, "Review is required"),
  rating: z.coerce.number().min(1).max(5, "Rating must be between 1 and 5"),
})

export async function createReview(
  prevState: State,
  formData: FormData
): Promise<State> {
  const validatedFields = CreateReviewSchema.safeParse({
    productId: formData.get("productId"),
    userId: formData.get("userId"),
    review: formData.get("review"),
    rating: formData.get("rating"),
  })

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing or invalid fields. Failed to create review.",
    }
  }

  const { productId, userId, review, rating } = validatedFields.data

  try {
    await sql`
      INSERT INTO wig_ratings (product_id, user_id, review, rating, created_at)
      VALUES (${productId}, ${userId}, ${review}, ${rating}, NOW())
    `

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
