// 'use client';

// import { useEffect, useState } from 'react';
// import { ProductField } from '@/app/lib/definitions';
// import Image from "next/image";

// export default function ProductsPage({ products }: { products: ProductField[] }) {
//   const [filtered, setFiltered] = useState(products);
//   const [category, setCategory] = useState('');
//   const [minPrice, setMinPrice] = useState('');
//   const [maxPrice, setMaxPrice] = useState('');
//   useEffect(() => {
//     const filteredProducts = products.filter((product) => {
//       const matchesCategory = category
//         ? product.category?.toLowerCase().includes(category.toLowerCase())
//         : true;

//       const matchesMinPrice = minPrice
//         ? product.price >= parseFloat(minPrice)
//         : true;

//       const matchesMaxPrice = maxPrice
//         ? product.price <= parseFloat(maxPrice)
//         : true;

//       return matchesCategory && matchesMinPrice && matchesMaxPrice;
//     });

//     setFiltered(filteredProducts);
//   }, [category, minPrice, maxPrice, products]);

//   return (
//     <div className="p-4">
//       {/* Filter Inputs */}
//       <div className="mb-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
//         <input
//           type="text"
//           placeholder="Filter by category"
//           value={category}
//           onChange={(e) => setCategory(e.target.value)}
//           className="border p-2 rounded w-full"
//         />
//         <input
//           type="number"
//           placeholder="Min price"
//           value={minPrice}
//           onChange={(e) => setMinPrice(e.target.value)}
//           className="border p-2 rounded w-full"
//         />
//         <input
//           type="number"
//           placeholder="Max price"
//           value={maxPrice}
//           onChange={(e) => setMaxPrice(e.target.value)}
//           className="border p-2 rounded w-full"
//         />
//       </div>

//       {/* Product Grid */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//         {filtered.map((product) => (
//           <div
//             key={product.id}
//             className="bg-tertiary2 shadow-md rounded-2xl p-4 flex flex-col"
//           >
//             {/* <img
//               src={`/products/${product.image_url?.split("/").at(-1)?.toLowerCase()}`}
//               alt={product.name}
//               className="w-full h-48 object-cover rounded-lg mb-4"
//             /> */}
//             <Image
//               src={`/products/${product.image_url?.split("/").at(-1)?.toLowerCase()}`}
//               alt={product.name}
//               width={800}
//               height={600}
//               className="w-full h-64 object-contain rounded-xl bg-tertiary2 p-2"
//             />
//             <h2 className="text-xl font-semibold">{product.name}</h2>
//             <p className="text-tertiary1 mt-2">{product.description}</p>
//             <p className="text-sm text-tertiary1 mt-1">{product.category}</p>
//             <p className="text-lg font-bold text-secondary mt-4">${product.price}</p>
//             <p className="text-lg font-bold text-secondary mt-4">Rating: {product.average_rating}</p>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

"use client"

import { useEffect, useState } from "react"
import { ProductField } from "@/app/lib/definitions"
import ProductCard from "@/app/ui/ProductCard"

export default function ProductsPage({
  products,
}: {
  products: ProductField[]
}) {
  const [filtered, setFiltered] = useState(products)
  const [category, setCategory] = useState("")
  const [minPrice, setMinPrice] = useState("")
  const [maxPrice, setMaxPrice] = useState("")
  const [minRating, setMinRating] = useState("")
  const [sortBy, setSortBy] = useState("newest")

  useEffect(() => {
    let filteredProducts = products.filter((product) => {
      const matchesCategory = category
        ? product.category?.toLowerCase().includes(category.toLowerCase())
        : true

      const matchesMinPrice = minPrice
        ? product.price >= parseFloat(minPrice)
        : true

      const matchesMaxPrice = maxPrice
        ? product.price <= parseFloat(maxPrice)
        : true

      const matchesRating = minRating
        ? (product.average_rating || 0) >= parseFloat(minRating)
        : true

      return (
        matchesCategory && matchesMinPrice && matchesMaxPrice && matchesRating
      )
    })

    // Apply sorting
    if (sortBy === "newest") {
      filteredProducts = [...filteredProducts].sort((a, b) => {
        const ratingA = a.average_rating || 0
        const ratingB = b.average_rating || 0
        return ratingB - ratingA
      })
    } else if (sortBy === "price-low") {
      filteredProducts = [...filteredProducts].sort((a, b) => a.price - b.price)
    } else if (sortBy === "price-high") {
      filteredProducts = [...filteredProducts].sort((a, b) => b.price - a.price)
    } else if (sortBy === "rating") {
      filteredProducts = [...filteredProducts].sort(
        (a, b) => (b.average_rating || 0) - (a.average_rating || 0)
      )
    }

    setFiltered(filteredProducts)
  }, [category, minPrice, maxPrice, minRating, sortBy, products])

  const searchParams = new URLSearchParams(window.location.search)
  const categoryParam = searchParams.get("category")

  useEffect(() => {
    if (categoryParam) {
      setCategory(categoryParam)
    }
  }, [categoryParam])

  return (
    <div className="p-4">
      {/* Filter Inputs */}
      <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        <input
          type="text"
          placeholder="Filter by category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border p-2 rounded w-full"
        />
        <input
          type="number"
          placeholder="Min price"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
          className="border p-2 rounded w-full"
        />
        <input
          type="number"
          placeholder="Max price"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
          className="border p-2 rounded w-full"
        />
        <input
          type="number"
          placeholder="Min rating"
          min="0"
          max="5"
          step="0.5"
          value={minRating}
          onChange={(e) => setMinRating(e.target.value)}
          className="border p-2 rounded w-full"
        />
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="border p-2 rounded w-full"
        >
          <option value="newest">New Arrivals</option>
          <option value="price-low">Price: Low to High</option>
          <option value="price-high">Price: High to Low</option>
          <option value="rating">Highest Rated</option>
        </select>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  )
}
