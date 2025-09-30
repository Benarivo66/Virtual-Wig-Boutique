import React from "react";
import Link from "next/link";
import styles from "./Sidenav.module.css";

function Sidenav() {
  return (
    <nav className={styles.sidenav} aria-label="sidebar navigation">
      <h2 className={styles.sidenavTitle}>Admin Management</h2>
      <ul className={styles.sidenavList}>
        <li>
          <Link
            className={styles.sidenavLink}
            href="/admin/products"
            aria-label="View products"
          >
            View products
          </Link>
        </li>
        <li>
          <Link
            className={styles.sidenavLink}
            href="/admin/product/create"
            aria-label="create products"
          >
            Create a product
          </Link>
           </li>
          <li>
            <Link
            className={styles.sidenavLink}
            href="/admin/requests"
            aria-label="view request"
          >
            View requests
          </Link>
          </li>
       
      </ul>
    </nav>
  );
}

export default Sidenav;