// "use client";

// import "./ProductCard.css";
// import Image from "next/image";
// import { FaRegStar } from "react-icons/fa";
// import { addToCart } from "@/app/lib/cart";

// type ProductCardProps = {
//   id: string;
//   title: string;
//   description: string;
//   price: string | number;
//   rating: string | number | null | undefined;
//   photoSrc: string;
// };

// function ProductCard({
//   id,
//   title,
//   description,
//   price,
//   rating,
//   photoSrc,
// }: ProductCardProps) {
//   const product = {
//     id,
//     title,
//     description,
//     price: Number(price),
//     image_url: photoSrc,
//     category: "", // Not available in props
//     user_id: "", // Not available in props
//   };
//   return (
//     <div className="product-card">
//       <a href={"product/" + id}>
//         <div className="product-card__product-image-wrapper">
//           <Image
//             src={photoSrc}
//             alt={title}
//             width={400}
//             height={320}
//             quality={80}
//             sizes="(max-width: 600px) 100vw, 400px"
//             loading="lazy"
//             className="product-card__product-image-wrapper__product-image"
//           />
//         </div>
//         <div className="product-card__product-details">
//           <div className="product-card__product-details__top">
//             <p className="product-card__product-details__top__product-title">
//               {title}
//             </p>
//             <p className="product-card__product-details__top__rating">
//               {rating} {rating && <FaRegStar />}{" "}
//             </p>
//           </div>
//           <p className="product-card__product-details__product-description">
//             {description}
//           </p>
//           <span className="product-card__product-details__product-price">
//             ${price}
//           </span>
//           <button
//             className="product-card__product-details__add-to-cart-button"
//             onClick={(e) => {
//               e.preventDefault();
//               addToCart(product);
//               alert(`Added ${title} to cart!`);
//             }}
//           >
//             Add to Cart
//           </button>
//         </div>
//       </a>
//     </div>
//   );
// }

// export default ProductCard;


"use client";

import Image from "next/image";
import { FaRegStar } from "react-icons/fa";
import { addToCart } from "@/app/lib/cart";

type ProductCardProps = {
  id: string;
  name: string;
  description: string;
  price: number;
  rating?: number | null;
  image_url: string;
  category: string | null;
};

export default function ProductCard({
  id,
  name,
  description,
  price,
  rating,
  image_url,
  category
}: ProductCardProps) {
  const product = {
    id,
    name,
    description,
    price,
    image_url,
    category
  };

  return (
    <div className="bg-tertiary2 shadow-md rounded-2xl p-4 flex flex-col">
      <a href={`/product/${id}`} className="group">
        {/* Product Image */}
        <div className="w-full h-64 bg-tertiary2 flex items-center justify-center rounded-xl overflow-hidden">
          <Image
            src={`/products/${image_url?.split("/").at(-1)?.toLowerCase()}`}
            alt={name}
            width={400}
            height={320}
            className="object-contain max-h-64 w-auto transition-transform duration-300 group-hover:scale-105"
          />
        </div>

        {/* Details */}
        <div className="mt-4">
          <h2 className="text-xl font-semibold text-tertiary1">{name}</h2>
          <p className="text-sm text-tertiary1 mt-1 line-clamp-2">{description}</p>
          <p className="text-sm text-tertiary1 mt-1 line-clamp-2"><b>Category: </b>{category}</p>
          <div className="flex items-center justify-between mt-3">
            <span className="text-lg font-bold text-secondary">${price}</span>
            {rating && (
              <span className="flex items-center text-sm text-tertiary1">
                {rating} <FaRegStar className="ml-1 text-yellow-500" />
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
