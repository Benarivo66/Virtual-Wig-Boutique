import { FaRegStar, FaStar } from "react-icons/fa";
import "./ProductReviews.css";
import CreateReviewForm from "@/app/ui/CreateReviewForm/CreateReviewForm";

function ProductReviews({
  productId,
  userId,
  productReviews,
  onReviewSubmitted, // Add this prop
}: {
  productId: string;
  userId: string;
  productReviews: any;
  onReviewSubmitted?: () => void; // Make it optional
}) {
  return (
    <>
      <div className="product-reviews">
        <h2 className="text-2xl font-bold mb-6">Customer Reviews</h2>
        
        {/* Review Form - Only show if user is logged in */}
        {userId ? (
          <CreateReviewForm 
            productId={productId} 
            userId={userId} 
            onReviewSubmitted={onReviewSubmitted} // Pass it down
          />
        ) : (
          <div className="mb-8 p-4 bg-gray-50 rounded-lg">
            <p className="text-gray-600">
              Please log in to leave a review.
            </p>
          </div>
        )}

        {/* Reviews List */}
        <div className="reviews-list">
          <h3 className="text-xl font-semibold mb-4">
            Reviews ({productReviews.length})
          </h3>
          
          {productReviews.length > 0 ? (
            <div className="space-y-6">
              {productReviews.map((review: any) => (
                <div key={review.id} className="review bg-white p-6 rounded-lg shadow-sm border">
                  {/* Star Rating */}
                  <div className="star-ratings flex items-center mb-3">
                    <div className="flex text-yellow-400 mr-2">
                      {Array.from({ length: review.rating }, (_, i) => (
                        <FaStar key={`full-${i}`} className="text-lg" />
                      ))}
                      {Array.from({ length: 5 - review.rating }, (_, i) => (
                        <FaRegStar key={`empty-${i}`} className="text-lg" />
                      ))}
                    </div>
                    <span className="text-sm text-gray-600">
                      {review.rating}.0 out of 5
                    </span>
                  </div>

                  {/* Review Content */}
                  <p className="review_content text-gray-700 mb-4 leading-relaxed">
                    {review.review}
                  </p>

                  {/* Reviewer Info */}
                  <div className="flex justify-between items-center text-sm text-gray-500">
                    <span className="user font-medium">
                      {review.user_name || "Anonymous"}
                    </span>
                    <span className="date">
                      {new Date(review.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="text-gray-400 mb-2">
                <FaRegStar className="text-4xl mx-auto" />
              </div>
              <p className="text-gray-600">No reviews yet for this product.</p>
              <p className="text-gray-500 text-sm mt-1">
                Be the first to share your experience!
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default ProductReviews;