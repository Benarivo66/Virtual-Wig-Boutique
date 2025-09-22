"use client";

import "./HeroCard.css";
import Image from "next/image";
import { useState } from "react";

function HeroComponent() {
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleShopNow = () => {
    // Scroll to products section
    const productsSection = document.querySelector('[data-section="products"]');
    if (productsSection) {
      productsSection.scrollIntoView({ behavior: 'smooth' });
    } else {
      // Fallback: scroll down by viewport height
      window.scrollBy({ top: window.innerHeight * 0.8, behavior: 'smooth' });
    }
  };

  const handleLearnMore = () => {
    // Navigate to about page or show more info
    window.location.href = '/dashboard/products';
  };

  return (
    <div className="hero-component">
      <div className="hero-component__left">
        <div className="hero-component__left__wrapper">
          <h1 className="hero-component__left__wrapper__main-text">
            Transform Your Look with Premium Wigs
          </h1>
          <p className="hero-component__left__wrapper__sub-text">
            Discover our curated collection of high-quality wigs. From elegant straight styles to voluminous curls, find your perfect match.
          </p>
          <div className="hero-component__left__wrapper__features">
            <div className="feature-item">
              <span className="feature-icon">✨</span>
              <span>Premium Quality</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">🚚</span>
              <span>Free Shipping</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">💯</span>
              <span>30-Day Returns</span>
            </div>
          </div>
          <div className="hero-component__left__wrapper__actions">
            <button
              className="hero-component__left__wrapper__call-to-action primary"
              onClick={handleShopNow}
              type="button"
            >
              Shop Now
            </button>
            <button
              className="hero-component__left__wrapper__call-to-action secondary"
              onClick={handleLearnMore}
              type="button"
            >
              View Collection
            </button>
          </div>
          <div className="hero-component__left__wrapper__offer">
            <p className="offer-text">
              <span className="offer-highlight">Special Offer:</span> Get 20% off your first order with code <strong>WELCOME20</strong>
            </p>
          </div>
        </div>
      </div>
      <div className="hero-component__right">
        <div className="hero-image-container">
          <Image
            width={1000}
            height={667}
            priority
            className={`hero-component__right__hero-image ${imageLoaded ? 'loaded' : ''}`}
            src="/images/hero-image.webp"
            alt="Beautiful woman showcasing premium wig collection at Virtual Wig Boutique"
            onLoad={() => setImageLoaded(true)}
          />
          <div className="hero-image-overlay">
            <div className="hero-badge">
              <span className="badge-text">New Collection</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HeroComponent;
