import type { Metadata } from "next";
import Image from "next/image";
import styles from "./page.module.css";
import HeroCard from "./ui/HeroCard/HeroCard";
import ProductCard from "./ui/ProductCard/ProductCard";


import { Suspense } from "react";

import "./page.css";
// import { fetchFilteredProductsWithRating } from "@/app/lib/data";

export const metadata: Metadata = {
  title: "Home",
  description: "Browse unique handmade products on Virtual Wig Boutique.",
};

export default async function Home(props: {
  searchParams?: Promise<{
    query?: string;
    page?: string;
  }>;
}) {
  const searchParams = props.searchParams ? await props.searchParams : {};
  const query = searchParams?.query || "";
  // const products = (await fetchFilteredProductsWithRating(query)) || [];

  return (
    <div className={styles.page}>
      
      <main className={styles.main}>
        <HeroCard />
        <section className="product-section">
          <h2>Products</h2>
          <Suspense fallback={<div>Loading...</div>}>
            {/* <div className="products">
              {products.map((product, index) => (
                <ProductCard
                  key={index}
                  id={product.id}
                  title={product.title}
                  description={product.description}
                  price={product.price}
                  rating={product.average_rating}
                  photoSrc={product.image_url}
                />
              ))}
            </div> */}
            {/* <Products query={query} /> */}
          </Suspense>
        </section>
        {/* <AboutUs /> */}
      </main>
    </div>
  );
}