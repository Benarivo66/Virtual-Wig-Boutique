import React from "react";
import Link from "next/link";
import styles from "./Sidenav.module.css";

function Sidenav() {
  return (
    <nav className={styles.sidenav} aria-label="sidebar navigation">
      <h2 className={styles.sidenavTitle}>Dashboard Management</h2>
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
        <li>
          <Link
            className={styles.sidenavLink}
            href="/dashboard/product/create"
            aria-label="create products"
          >
            Create a product
          </Link>
        </li>
      </ul>
    </nav>
  );
}

export default Sidenav;