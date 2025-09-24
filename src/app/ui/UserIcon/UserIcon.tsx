import React from "react";
import { FaUserCircle } from "react-icons/fa";
import Link from "next/link";

import "./UserIcon.css";

interface UserIconProps {
    user?: {
        id: string;
        name: string;
        email: string;
        role: "user" | "admin";
    } | null;
}

export default function UserIcon({ user }: UserIconProps) {
    return (
        <Link
            href="/me"
            className="user-icon-link"
            aria-label={user ? `Go to ${user.name}'s dashboard` : "Go to user dashboard"}
        >
            <FaUserCircle className="user-icon" aria-hidden="true" />
            {user && <span className="user-name-mobile">{user.name}</span>}
        </Link>
    );
}