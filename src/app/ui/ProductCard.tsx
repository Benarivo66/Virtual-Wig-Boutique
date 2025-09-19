"use client";

import Image from "next/image";
import { FaRegStar } from "react-icons/fa";
import { addToCart } from "@/app/lib/cart";

type ProductCardProps = {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  average_rating?: number | null;
  image_url: string;
  video_url: string | null
  
};

export default function ProductCard({
  id,
  name,
  description,
  price,
  average_rating,
  image_url,
  video_url,
  category
}: ProductCardProps) {
  const product = {
    id,
    name,
    description,
    price,
    category,
    image_url,
    video_url,
    average_rating
  };

  return (
    <div className="bg-tertiary2 shadow-md rounded-2xl p-4 flex flex-col">
      <a href={`/product/${id}`} className="group">
        <div className="w-full bg-tertiary2 flex flex-col items-center justify-center rounded-xl overflow-hidden">
  {video_url && (
    <video
      src={video_url}
      controls
      className="object-contain max-h-64 w-auto mb-2 rounded-lg"
    />
  )}
  {image_url && (
    <Image
      src={image_url}
      alt={name}
      width={400}
      height={320}
      className="object-contain max-h-64 w-auto transition-transform duration-300 group-hover:scale-105 rounded-lg"
    />
  )}
</div>


        {/* Details */}
        <div className="mt-4">
          <h2 className="text-xl font-semibold text-tertiary1">{name}</h2>
          <p className="text-sm text-tertiary1 mt-1 line-clamp-2">{description}</p>
          <p className="text-sm text-tertiary1 mt-1 line-clamp-2"><b>Category: </b>{category}</p>
          <div className="flex items-center justify-between mt-3">
            <span className="text-lg font-bold text-secondary">${price}</span>
            {average_rating && (
              <span className="flex items-center text-sm text-tertiary1">
                {average_rating} <FaRegStar className="ml-1 text-yellow-500" />
              </span>
            )}
          </div>
        </div>
      </a>

      {/* Add to Cart */}
      <button
        className="mt-4 py-2 px-4 rounded-lg bg-secondary text-white font-medium hover:bg-primary transition"
        onClick={(e) => {
          e.preventDefault();
          addToCart(product);
          alert(`Added ${name} to cart!`);
        }}
      >
        Add to Cart
      </button>
    </div>
  );
}
