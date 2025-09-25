import { FaRegStar, FaStar } from "react-icons/fa";
import "./ProductReviews.css";
import CreateReviewForm from "@/app/ui/CreateReviewForm/CreateReviewForm";

function ProductReviews({
  productId,
  userId,
  productReviews,
}: {
  productId: string;
  userId: string;
  productReviews: any;
}) {
  return (
    <>
      <div className="product-reviews">
        <h2>Reviews</h2>
        <CreateReviewForm productId={productId} userId={userId} />

        {productReviews.length > 0 ? (
          productReviews.map((review: any) => (
            <div key={review.id} className="review">
              <p className="star-ratings">
                {Array.from({ length: review.rating }, (_, i) => ( // Changed from review.rating to review.rating
                  <span key={i}>
                    <FaStar />
                  </span>
                ))}
                {Array.from({ length: 5 - review.rating }, (_, i) => ( // Changed from review.rating to review.rating
                  <span key={i}>
                    <FaRegStar />
                  </span>
                ))}
              </p>
              <h3 className="review_title">{review.title}</h3>
              <p className="review_content">{review.review}</p>
              <p className="user">{review.user_name || "Anonymous"} </p> {/* Changed from review.name to review.user_name */}
              <p className="date">
                {new Date(review.created_at).toLocaleDateString()}
              </p>
            </div>
          ))
        ) : (
          <p>No reviews available for this product.</p>
        )}
      </div>
    </>
  );
}

export default ProductReviews;