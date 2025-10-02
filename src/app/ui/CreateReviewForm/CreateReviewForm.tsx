"use client";

import { useActionState } from "react";
import { useState, useEffect } from "react";
import "./CreateReviewForm.css";
import { createReview, State } from "@/app/lib/actions";

function CreateReviewForm({
  productId,
  userId,
  onReviewSubmitted,
}: {
  productId: string;
  userId: string;
  onReviewSubmitted?: () => void;
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
    // Reset submission state when form is submitted again
    setHasSubmitted(false);
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