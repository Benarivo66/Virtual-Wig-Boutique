export type ProductField = {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image_url?: string;
  video_url?: string;
  average_rating?: number | null;
  review_count?: number;
};

export type UserField = {
  id: string;
  name: string;
  email: string;
  password: string;
  role: "user" | "admin";
};

export type RatingField = {
  id: string;
  product_id: string;
  review: string;
  rating: number;
  created_at: string;
};

// Add this new type
export type ReviewField = {
  id: string;
  product_id: string;
  user_id: string;
  review: string;  // This is the content field in the database
  rating: number;
  created_at: string;
  user_name?: string; // We'll get this from joining with users table
  title?: string; // Add this if your ratings table has a title column
};