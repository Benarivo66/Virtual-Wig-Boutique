import React from "react";
import { handleSignOut } from "@/app/lib/actions";
import styles from "./SignOut.module.css";

function SignOut() {
  return (
    <form action={handleSignOut}>
      <button className={styles.signOutButton}>
        {/* <PowerIcon className="w-6" /> */}
        <div className={styles.signOutText}>Sign Out</div>
      </button>
    </form>
  );
}

export default SignOut;