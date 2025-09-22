"use client";

import { useState } from "react";
import "./PromotionalBanner.css";

interface PromotionalBannerProps {
    title: string;
    description: string;
    primaryButtonText: string;
    secondaryButtonText?: string;
    onPrimaryClick: () => void;
    onSecondaryClick?: () => void;
    backgroundColor?: string;
    textColor?: string;
    showCloseButton?: boolean;
    onClose?: () => void;
    loading?: boolean;
}

export default function PromotionalBanner({
    title,
    description,
    primaryButtonText,
    secondaryButtonText,
    onPrimaryClick,
    onSecondaryClick,
    backgroundColor = "from-purple-600 to-pink-600",
    textColor = "text-white",
    showCloseButton = false,
    onClose,
    loading = false
}: PromotionalBannerProps) {
    const [isVisible, setIsVisible] = useState(true);

    const handleClose = () => {
        setIsVisible(false);
        if (onClose) {
            onClose();
        }
    };

    if (!isVisible) {
        return null;
    }

    if (loading) {
        return (
            <div className="promotional-banner-skeleton">
                <div className="skeleton-content">
                    <div className="skeleton-title"></div>
                    <div className="skeleton-description"></div>
                    <div className="skeleton-buttons">
                        <div className="skeleton-button"></div>
                        <div className="skeleton-button"></div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={`promotional-banner bg-gradient-to-r ${backgroundColor} ${textColor}`}>
            {showCloseButton && (
                <button
                    className="close-button"
                    onClick={handleClose}
                    aria-label="Close promotional banner"
                    type="button"
                >
                    <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                        />
                    </svg>
                </button>
            )}

            <div className="banner-content">
                <div className="banner-text">
                    <h2 className="banner-title">{title}</h2>
                    <p className="banner-description">{description}</p>
                </div>

                <div className="banner-actions">
                    <button
                        className="banner-button primary"
                        onClick={onPrimaryClick}
                        type="button"
                    >
                        {primaryButtonText}
                    </button>
                    {secondaryButtonText && onSecondaryClick && (
                        <button
                            className="banner-button secondary"
                            onClick={onSecondaryClick}
                            type="button"
                        >
                            {secondaryButtonText}
                        </button>
                    )}
                </div>
            </div>

            {/* Decorative elements */}
            <div className="banner-decoration">
                <div className="decoration-circle circle-1"></div>
                <div className="decoration-circle circle-2"></div>
                <div className="decoration-circle circle-3"></div>
            </div>
        </div>
    );
}