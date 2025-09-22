"use client"

import React, { useState, useEffect, useCallback } from "react";
import { FaUserCircle, FaShoppingCart, FaSearch } from "react-icons/fa";
import "./TopBar.css";
import Link from "next/link";
import SignOut from "../Signout/SignOut";

interface TopBarProps {
  showSearch?: boolean;
  onSearch?: (query: string) => void;
}

export default function TopBar({ showSearch = true, onSearch }: TopBarProps) {
  const [searchQuery, setSearchQuery] = useState("");

  // Debounced search functionality
  const debounceSearch = useCallback(
    (query: string) => {
      const timeoutId = setTimeout(() => {
        if (onSearch) {
          onSearch(query);
        }
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
    if (onSearch) {
      onSearch(searchQuery);
    }
  };

  return (
    <header className="topbar">
      <Link className="topbar-logo" href={"/"}>
        Virtual Wig Boutique
      </Link>

      {showSearch && (
        <div className="topbar-search">
          <form onSubmit={handleSearchSubmit} className="search-form">
            <div className="search-input-container">
              <FaSearch className="search-icon" />
              <input
                type="text"
                placeholder="Search for wigs..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="search-input"
                aria-label="Search products"
              />
            </div>
          </form>
        </div>
      )}

      <div className="topbar-actions">
        <Link href={"/dashboard/cart"}>
          <FaShoppingCart className="topbar-icon" />
        </Link>

        <Link className="topbar-signin" href="/login">
          Sign In
        </Link>
        <SignOut />
      </div>
    </header>
  );
}
