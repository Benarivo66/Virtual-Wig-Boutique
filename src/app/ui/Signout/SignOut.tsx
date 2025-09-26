"use client";

import React from "react";
import { useAuth } from "@/app/lib/hooks/useAuth";
import styles from "./SignOut.module.css";

function SignOut() {
  const { logout } = useAuth();

  const handleSignOut = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <button onClick={handleSignOut} className={styles.signOutButton}>
      {/* <PowerIcon className="w-6" /> */}
      <div className={styles.signOutText}>Sign Out</div>
    </button>
  );
}

export default SignOut;