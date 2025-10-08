"use client";

import { useActionState } from "react";
import { useState, useEffect } from "react";
import "./CreateReviewForm.css";
import { createReview, State } from "@/app/lib/actions";

function CreateReviewForm({
  productId,
  userId,
  onReviewSubmitted,
  hasPurchased = false, // New prop to check purchase status
}: {
  productId: string;
  userId: string;
  onReviewSubmitted?: () => void;
  hasPurchased?: boolean; // Add purchase status
}) {
  const initialState: State = { message: null, errors: {} };
  const [state, formAction] = useActionState(createReview, initialState);
  const [rating, setRating] = useState(5);
  const [content, setContent] = useState("");
  const [hasSubmitted, setHasSubmitted] = useState(false);

  // Reset form when state changes to success
  useEffect(() => {
    if (state?.message && !state.errors && !hasSubmitted) {
      setHasSubmitted(true);
      setContent("");
      setRating(5);
      
      // Call the callback after a short delay to ensure state is updated
      setTimeout(() => {
        if (onReviewSubmitted) {
          onReviewSubmitted();
        }
      }, 100);
    }
  }, [state, onReviewSubmitted, hasSubmitted]);

  // Reset hasSubmitted when form is reset
  useEffect(() => {
    if (!state?.message && hasSubmitted) {
      setHasSubmitted(false);
    }
  }, [state, hasSubmitted]);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    if (!userId) {
      e.preventDefault();
      alert("You must be signed in to submit a review.");
      return;
    }
    
    if (!hasPurchased) {
      e.preventDefault();
      alert("You must purchase this product before submitting a review.");
      return;
    }
    
    // Reset submission state when form is submitted again
    setHasSubmitted(false);
  }

  // If user hasn't purchased, show a message instead of the form
  if (!hasPurchased) {
    return (
      <div className="review-form bg-white p-6 rounded-lg shadow-sm border mb-8">
        <div className="text-center py-8">
          <div className="text-yellow-500 text-4xl mb-4">🛒</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Purchase to Review
          </h3>
          <p className="text-gray-600 mb-4">
            You need to purchase this product before you can write a review.
          </p>
          <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3 inline-block">
            <p className="text-yellow-700 text-sm">
              Only verified purchasers can submit reviews.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <form 
      className="review-form bg-white p-6 rounded-lg shadow-sm border mb-8" 
      action={formAction} 
      onSubmit={handleSubmit}
    >
      {/* Hidden fields for productId and userId */}
      <input type="hidden" name="productId" value={productId} />
      <input type="hidden" name="userId" value={userId} />

      <fieldset className="review-form__fieldset space-y-6">
        <legend className="review-form__legend text-xl font-semibold text-gray-900 mb-4">
          Write Your Review
        </legend>

        {/* Verified Purchaser Badge */}
        <div className="bg-green-50 border border-green-200 rounded-md p-3 inline-flex items-center">
          <span className="text-green-600 text-sm font-medium">✓ Verified Purchaser</span>
        </div>

        {/* Star Rating */}
        <div className="review-form__group">
          <label className="review-form__label block text-sm font-medium text-gray-700 mb-3" htmlFor="review-rating">
            Your Rating: <span className="text-blue-600 font-semibold">{rating} star{rating !== 1 ? 's' : ''}</span>
          </label>
          <div className="flex items-center space-x-4">
            <input
              className="review-form__input review-form__input--range flex-1"
              id="review-rating"
              name="rating"
              type="range"
              min="1"
              max="5"
              step="1"
              value={rating}
              onChange={(e) => setRating(Number(e.target.value))}
              list="rating-tickmarks"
            />
            <div className="flex space-x-1">
              {[1, 2, 3, 4, 5].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => setRating(num)}
                  className={`text-2xl ${
                    num <= rating ? 'text-yellow-400' : 'text-gray-300'
                  } hover:text-yellow-500 transition-colors`}
                >
                  ★
                </button>
              ))}
            </div>
          </div>
          <datalist id="rating-tickmarks" className="flex justify-between mt-2">
            {[1, 2, 3, 4, 5].map((num) => (
              <option key={num} value={num} label={String(num)} />
            ))}
          </datalist>
        </div>

        {/* Review Content */}
        <div className="review-form__group">
          <label className="review-form__label block text-sm font-medium text-gray-700 mb-2" htmlFor="review-content">
            Your Review
          </label>
          <textarea
            className="review-form__input review-form__input--textarea w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            id="review-content"
            name="content"
            rows={5}
            placeholder="Share your experience with this product... What did you like? What could be improved?"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
        </div>
      </fieldset>

      {/* Success Message */}
      {state?.message && !state.errors && (
        <div className="review-form__success mb-4 p-3 bg-green-50 border border-green-200 rounded-md">
          <p className="text-green-700 text-sm">{state.message}</p>
        </div>
      )}

      {/* Error Messages */}
      {state?.errors && Object.keys(state.errors).length > 0 && (
        <div className="review-form__errors mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
          {Object.entries(state.errors).map(([field, messages]) => (
            <p key={field} className="review-form__error text-red-700 text-sm">
              {messages.join(", ")}
            </p>
          ))}
        </div>
      )}

      {/* Purchase Required Message */}
      {state?.message && state.message.includes("must purchase") && (
        <div className="review-form__errors mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
          <p className="text-yellow-700 text-sm">{state.message}</p>
        </div>
      )}

      <button 
        className="review-form__submit w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 font-medium transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
        type="submit"
        disabled={!content.trim()}
      >
        Submit Review
      </button>
    </form>
  );
}

export default CreateReviewForm;