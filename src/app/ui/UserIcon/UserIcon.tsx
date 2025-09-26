import React from "react"
import { FaUserCircle } from "react-icons/fa"
import Link from "next/link"

import "./UserIcon.css"

interface UserIconProps {
  user?: {
    id: string
    name: string
    email: string
    role: "user" | "admin"
  } | null
}

export default function UserIcon({ user }: UserIconProps) {
  // Determine the appropriate link destination based on authentication state
  const href = user ? "/me" : "/auth"
  const ariaLabel = user
    ? `Go to ${user.name}'s dashboard`
    : "Sign in or create account"

  return (
    <Link
      href={href}
      className="user-icon-link"
      aria-label={ariaLabel}
    >
      <FaUserCircle className="user-icon" aria-hidden="true" />
      {user && <span className="user-name-mobile">{user.name}</span>}
    </Link>
  )
}
