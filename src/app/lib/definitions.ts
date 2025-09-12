export type ProductField = {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image_url?: string;
  video_url?: string;
  average_rating?: number | null;
};

export type UserField = {
  id: string;
  name: string,
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