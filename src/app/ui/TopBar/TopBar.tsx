import React from "react";
import { FaShoppingCart, FaSearch } from "react-icons/fa";
import "./TopBar.css";
import Link from "next/link";
import { auth } from "@/auth";
import UserIcon from "../UserIcon";
import TopBarClient from "./TopBarClient";

interface TopBarProps {
  showSearch?: boolean;
  onSearch?: (query: string) => void;
}

export default async function TopBar({ showSearch = true, onSearch }: TopBarProps) {
  const session = await auth();
  const user = session?.user ? {
    id: session.user.id as string,
    name: session.user.name as string,
    email: session.user.email as string,
    role: (session.user as any).role as "user" | "admin"
  } : null;

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
          href={"/admin/cart"}
          aria-label="View shopping cart"
          className="topbar-cart-link"
        >
          <FaShoppingCart className="topbar-icon" aria-hidden="true" />
          <span className="sr-only">Shopping Cart</span>
        </Link>

        <UserIcon user={user} />
      </nav>
    </header>
  );
}
