import React from "react";
import Link from "next/link";
import styles from "./Sidenav.module.css";

function Sidenav() {
  return (
    <nav className={styles.sidenav} aria-label="Profile navigation">
      <h2 className={styles.sidenavTitle}>Profile Management</h2>
      <ul className={styles.sidenavList}>
        <li>
          <Link
            className={styles.sidenavLink}
            href="/dashboard/products"
            aria-label="View products"
          >
            View Products
          </Link>
        </li>
      </ul>
    </nav>
  );
}

export default Sidenav;