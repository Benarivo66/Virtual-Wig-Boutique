"use client";

import React from "react";
import "./TopBar.css";
import Link from "next/link";
import { useAuth } from "@/app/lib/hooks/useAuth";
import UserIcon from "../UserIcon";
import TopBarClient from "./TopBarClient";
import CartIcon from "../CartIcon";

interface TopBarProps {
  showSearch?: boolean;
  onSearch?: (query: string) => void;
}

export default function TopBar({ showSearch = true, onSearch }: TopBarProps) {
  const { user } = useAuth();

  return (
    <header className="topbar" role="banner">
      <Link
        className="topbar-logo"
        href={"/"}
        aria-label="Virtual Wig Boutique - Go to homepage"
      >
        Virtual Wig Boutique
      </Link>

      <TopBarClient showSearch={showSearch} onSearch={onSearch} />

      <nav className="topbar-actions" role="navigation" aria-label="User actions">
        <Link
          href={"/cart"}
          aria-label="View shopping cart"
          className="topbar-cart-link"
        >
          <CartIcon />
        </Link>

        <UserIcon user={user} />
      </nav>
    </header>
  );
}
