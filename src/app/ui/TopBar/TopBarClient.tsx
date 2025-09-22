"use client"

import React, { useState, useEffect, useCallback } from "react";
import { FaSearch } from "react-icons/fa";

interface TopBarClientProps {
    showSearch?: boolean;
    onSearch?: (query: string) => void;
}

export default function TopBarClient({ showSearch = true, onSearch }: TopBarClientProps) {
    const [searchQuery, setSearchQuery] = useState("");
    const [isSearchFocused, setIsSearchFocused] = useState(false);

    // Debounced search functionality
    const debounceSearch = useCallback(
        (query: string) => {
            const timeoutId = setTimeout(() => {
                // Call the onSearch prop if provided
                if (onSearch) {
                    onSearch(query);
                }

                // Also dispatch a custom event for global search handling
                const searchEvent = new CustomEvent('search-update', {
                    detail: { query }
                });
                window.dispatchEvent(searchEvent);
            }, 300); // 300ms debounce delay

            return () => clearTimeout(timeoutId);
        },
        [onSearch]
    );

    useEffect(() => {
        const cleanup = debounceSearch(searchQuery);
        return cleanup;
    }, [searchQuery, debounceSearch]);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
    };

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Call the onSearch prop if provided
        if (onSearch) {
            onSearch(searchQuery);
        }

        // Also dispatch a custom event for global search handling
        const searchEvent = new CustomEvent('search-update', {
            detail: { query: searchQuery }
        });
        window.dispatchEvent(searchEvent);
    };

    const handleSearchFocus = () => {
        setIsSearchFocused(true);
    };

    const handleSearchBlur = () => {
        setIsSearchFocused(false);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Escape') {
            setSearchQuery('');
            (e.target as HTMLInputElement).blur();
        }
    };

    if (!showSearch) {
        return null;
    }

    return (
        <div className="topbar-search">
            <form onSubmit={handleSearchSubmit} className="search-form" role="search">
                <div className={`search-input-container ${isSearchFocused ? 'focused' : ''}`}>
                    <FaSearch className="search-icon" aria-hidden="true" />
                    <input
                        type="text"
                        placeholder="Search for wigs..."
                        value={searchQuery}
                        onChange={handleSearchChange}
                        onFocus={handleSearchFocus}
                        onBlur={handleSearchBlur}
                        onKeyDown={handleKeyDown}
                        className="search-input"
                        aria-label="Search products"
                        aria-describedby="search-help"
                        autoComplete="off"
                    />
                    <div id="search-help" className="sr-only">
                        Type to search for wigs. Press Escape to clear search.
                    </div>
                </div>
            </form>
        </div>
    );
}