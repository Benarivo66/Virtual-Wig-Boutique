"use client";

import React, { useState } from "react";
import Link from "next/link";
import styles from "./Sidenav.module.css";

function Sidenav() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  return (
    <>
      {/* Hamburger Button (Visible on mobile) */}
      <button
        className={styles.hamburger}
        onClick={toggleMenu}
        aria-label="Toggle sidebar menu"
        aria-expanded={isOpen}
      >
        <span className={isOpen ? styles.barOpen : styles.bar}></span>
        <span className={isOpen ? styles.barOpen : styles.bar}></span>
        <span className={isOpen ? styles.barOpen : styles.bar}></span>
      </button>

      {/* Sidebar */}
      <nav
        className={`${styles.sidenav} ${isOpen ? styles.open : ""}`}
        aria-label="sidebar navigation"
      >
        <h2 className={styles.sidenavTitle}>Admin Management</h2>
        <ul className={styles.sidenavList}>
          <li>
            <Link
              className={styles.sidenavLink}
              href="/admin/products"
              onClick={closeMenu}
            >
              View products
            </Link>
          </li>
          <li>
            <Link
              className={styles.sidenavLink}
              href="/admin/product/create"
              onClick={closeMenu}
            >
              Create a product
            </Link>
          </li>
          <li>
            <Link
              className={styles.sidenavLink}
              href="/admin/requests"
              onClick={closeMenu}
            >
              View requests
            </Link>
          </li>
        </ul>
      </nav>
    </>
  );
}

export default Sidenav;
