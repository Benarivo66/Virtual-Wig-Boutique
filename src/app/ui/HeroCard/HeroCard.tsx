"use client"

import "./HeroCard.css"
import Image from "next/image"
import { useState } from "react"

function HeroComponent() {
  const [imageLoaded, setImageLoaded] = useState(false)

  const handleShopNow = () => {
    // Navigate to products page with new arrivals filter
    window.location.href = "/products?category=New%20Arrivals"
  }

  const handleLearnMore = () => {
    // Navigate to products page
    window.location.href = "/products"
  }

  const handleSpecialOffer = () => {
    // Copy promo code to clipboard and show notification
    navigator.clipboard
      .writeText("WELCOME20")
      .then(() => {
        // Create a temporary notification
        const notification = document.createElement("div")
        notification.textContent = "Promo code WELCOME20 copied to clipboard!"
        notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #10b981;
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        font-weight: 500;
        z-index: 9999;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        animation: slideIn 0.3s ease-out;
      `

        // Add animation keyframes
        if (!document.querySelector("#promo-notification-styles")) {
          const style = document.createElement("style")
          style.id = "promo-notification-styles"
          style.textContent = `
          @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
          }
        `
          document.head.appendChild(style)
        }

        document.body.appendChild(notification)

        // Remove notification after 3 seconds
        setTimeout(() => {
          notification.remove()
        }, 3000)
      })
      .catch(() => {
        // Fallback: scroll to products section
        handleShopNow()
      })
  }

  return (
    <div className="hero-component">
      <div className="hero-component__left">
        <div className="hero-component__left__wrapper">
          <h1 className="hero-component__left__wrapper__main-text">
            Transform Your Look with Premium Wigs
          </h1>
          <p className="hero-component__left__wrapper__sub-text">
            Discover our curated collection of high-quality wigs. From elegant
            straight styles to voluminous curls, find your perfect match.
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
              aria-label="Browse our product collection"
            >
              <span className="button-icon" aria-hidden="true">
                🛍️
              </span>
              Shop Now
            </button>
            <button
              className="hero-component__left__wrapper__call-to-action secondary"
              onClick={handleLearnMore}
              type="button"
              aria-label="View all products in our collection"
            >
              <span className="button-icon" aria-hidden="true">
                👀
              </span>
              View Collection
            </button>
          </div>
          <div className="hero-component__left__wrapper__offer">
            <p className="offer-text">
              <span className="offer-highlight" aria-hidden="true">
                🎉 Special Offer:
              </span>{" "}
              Get 20% off your first order with code <strong>WELCOME20</strong>
            </p>
            <button
              className="offer-button"
              onClick={handleSpecialOffer}
              type="button"
              aria-label="Copy promo code WELCOME20 to clipboard"
            >
              Copy Code
            </button>
          </div>
        </div>
      </div>
      <div className="hero-component__right">
        <div className="hero-image-container">
          <Image
            width={1000}
            height={667}
            priority
            className={`hero-component__right__hero-image ${
              imageLoaded ? "loaded" : ""
            }`}
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
  )
}

export default HeroComponent
