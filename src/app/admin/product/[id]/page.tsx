// import ProductDetails from "@/app/ui/ProductDetails/ProductDetails";
// import ProductReviews from "@/app/ui/ProductReviews/ProductReviews";
// import { fetchProductById, fetchRatingsAndReviewsByID } from "@/app/lib/data";
// import "./page.css";

type Props = {
  params: Promise<{ id: string }>;
};

// export default async function Page(props: Props) {
//   const { id } = await props.params;
//   const product = await fetchProductById(id);
//   const productReviews = await fetchRatingsAndReviewsByID(id);
//   const userId = "";

    // Debug information
    console.log('=== SESSION DEBUG ===');
    console.log('Full session:', JSON.stringify(session, null, 2));
    console.log('User object:', session?.user);
    console.log('User ID from session:', session?.user?.id);
    console.log('User exists:', !!session?.user);
    console.log('=====================');

    if (!product) {
      return <div>Product not found</div>;
    }

    return (
      <div className="product-page">
        <ProductDetails product={product} />
        <ProductReviews
          productId={product.id}
          userId={userId}
          productReviews={productReviews}
        />
      </div>
    );
  } catch (error) {
    console.error('Error loading product page:', error);
    return <div>Error loading product details</div>;
  }
}