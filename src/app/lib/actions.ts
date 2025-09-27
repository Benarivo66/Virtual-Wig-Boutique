"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import postgres from "postgres";
import { signIn } from "@/auth";
import { AuthError } from "next-auth";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";

const sql = postgres(process.env.POSTGRES_URL!, { ssl: "require" });

const ReviewFormSchema = z.object({
  productId: z.string({
    required_error: "Missing product ID.",
  }),
  userId: z.string({
    required_error: "Missing user ID.",
  }),
  title: z.string().min(1, { message: "Title is required." }),
  rating: z.coerce
    .number()
    .min(1, { message: "Rating must be at least 1 star." })
    .max(5, { message: "Rating cannot exceed 5 stars." }),
  review: z.string().min(1, { message: "Review content is required." }),
});

const UserRegistrationSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(1),
  role: z.enum(["user", "admin"]),
});

const ProductFormSchema = z.object({
  name: z.string().min(1, { message: "Name is required." }),
  description: z.string().min(1, { message: "Description is required." }),
  price: z.coerce.number().min(0, { message: "Price must be positive." }),
  category: z.string().min(1, { message: "Category is required." }),
  image_url: z
    .string()
    .url({ message: "Image URL must be valid." })
    .optional()
    .or(z.literal("")), 
  video_url: z
    .string()
    .url({ message: "Video URL must be valid." })
    .optional()
    .or(z.literal("")),
  average_rating: z.coerce.number().min(0).max(5).optional(), 
});


export type State = {
  errors?: {
    productId?: string[];
    userId?: string[];
    title?: string[];
    rating?: string[];
    review?: string[];
  };
  message?: string | null;
};

export type UserState = {
  errors?: {
    name?: string[];
    password?: string[];
    email?: string[];
    role?: string[];
  };
  message?: string | null;
};

export type ProductState = {
  errors?: {
    name?: string[];
    description?: string[];
    price?: string[];
    category?: string[];
    image_url?: string[];
    video_url?: string[];
    average_rating?: string[];
  };
  message?: string | null;
}


export async function createReview(prevState: State, formData: FormData) {
  // Add debug logging
  console.log('=== CREATE REVIEW DEBUG ===');
  console.log('productId:', formData.get("productId"));
  console.log('userId:', formData.get("userId"));
  console.log('rating:', formData.get("rating"));
  console.log('title:', formData.get("title"));
  console.log('content:', formData.get("content"));
  console.log('==========================');

  // Validate form using Zod
  const validatedFields = ReviewFormSchema.safeParse({
    productId: formData.get("productId"),
    userId: formData.get("userId"),
    title: formData.get("title"),
    rating: formData.get("rating"), // This matches your form field name
    review: formData.get("content"),     // This matches your form field name
  });

  if (!validatedFields.success) {
    console.log('Validation errors:', validatedFields.error.flatten().fieldErrors);
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to Create Review.",
    };
  }

  const { productId, userId, title, rating, review } = validatedFields.data;
  const created_at = new Date().toISOString();

  try {
    // Fix the database insert - use the correct column names
    await sql`
      INSERT INTO ratings (product_id, user_id, title, rating, review, created_at)
      VALUES (${productId}, ${userId}, ${title}, ${rating}, ${review}, ${created_at})
    `;
    
    console.log('Review inserted successfully');
    
    // Update the product's average rating
    // You'll need to import this function
    // await updateProductAverageRating(productId);
    
  } catch (error) {
    console.error('Database Error:', error);
    return {
      message: "Database Error: Failed to Create Review.",
    };
  }

  // Fix the redirect path - it should include /dashboard
  revalidatePath(`/dashboard/product/${productId}`);
  redirect(`/dashboard/product/${productId}`);
}
export async function authenticate(
  prevState: string | undefined,
  formData: FormData
) {
  try {
    await signIn("credentials", formData);
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return "Invalid credentials.";
        default:
          return "Something went wrong.";
      }
    }
    throw error;
  }
}

export async function createUser(prevState: UserState, formData: FormData) {
  const validated = UserRegistrationSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
    name: formData.get("name"),
    role: formData.get("role"),
  });

  if (!validated.success) {
    return {
      errors: validated.error.flatten().fieldErrors,
      message: "Invalid registration fields.",
    };
  }

  const { email, password, name, role } = validated.data;
  const hashedPassword = await bcrypt.hash(password, 10);
  const id = uuidv4();

  try {
    await sql`
      INSERT INTO users (id, email, password, name, role)
      VALUES (${id}, ${email}, ${hashedPassword}, ${name}, ${role})
    `;
    return { message: "User registered successfully." };
  } catch (error) {
    return { message: "Database Error: Failed to register user." };
  }
}

export async function createProduct(
  prevState: ProductState,
  formData: FormData
): Promise<ProductState> {

  const validated = ProductFormSchema.safeParse({
    name: formData.get("name"),
    description: formData.get("description"),
    price: formData.get("price"),
    category: formData.get("category"),
    image_url: formData.get("image_url"),
    video_url: formData.get("video_url") 
  });

  if (!validated.success) {
    return {
      errors: validated.error.flatten().fieldErrors,
      message: "Invalid product fields.",
    };
  }

  const { name, description, price, category, image_url, video_url } = validated.data;
  const id = uuidv4();

  try {
    await sql`
      INSERT INTO products (id, name, description, price, category, image_url, video_url)
      VALUES (${id}, ${name}, ${description}, ${price}, ${category}, ${image_url || null}, ${video_url || null})
`;

    revalidatePath("/dashboard/products");
    return { message: "Product created successfully." };
  } catch (error) {
    console.error("Product creation failed:", error);
    return { message: "Database or upload error: Failed to create product." };
  }
}

