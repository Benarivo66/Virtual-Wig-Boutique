"use client"

import { useState } from "react"
import {
  FaUser,
  FaShoppingBag,
  FaHeart,
  FaCog,
  FaSignOutAlt,
  FaEdit,
} from "react-icons/fa"
import { useAuth } from "@/app/lib/hooks/useAuth"
import type { UserField } from "@/app/lib/definitions"
import Link from "next/link"
import "./UserDashboard.css"
import UserOrders from "./UserOrders"

interface UserDashboardProps {
  user: UserField
}

export default function UserDashboard({ user }: UserDashboardProps) {
  const [activeTab, setActiveTab] = useState<
    "overview" | "orders" | "wishlist" | "settings"
  >("overview")
  const { logout } = useAuth()

  const handleSignOutClick = async () => {
    try {
      await logout()
    } catch (error) {
      console.error("Logout failed:", error)
    }
  }

  return (
    <div className="user-dashboard">
      <div className="dashboard-container">
        {/* Header */}
        <div className="dashboard-header">
          <div className="user-welcome">
            <div className="user-avatar">
              <FaUser />
            </div>
            <div className="user-info">
              <h1 className="user-greeting">Welcome back, {user.name}!</h1>
              <p className="user-email">{user.email}</p>
              {user.role === "admin" && (
                <span className="admin-badge">Admin</span>
              )}
            </div>
          </div>
          <div className="header-actions">
            {user.role === "admin" && (
              <Link href="/admin" className="admin-link">
                <FaCog />
                Admin Dashboard
              </Link>
            )}
            <button onClick={handleSignOutClick} className="signout-button">
              <FaSignOutAlt />
              Sign Out
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="dashboard-nav">
          <button
            className={`nav-tab ${activeTab === "overview" ? "active" : ""}`}
            onClick={() => setActiveTab("overview")}
          >
            <FaUser />
            Overview
          </button>
          <button
            className={`nav-tab ${activeTab === "orders" ? "active" : ""}`}
            onClick={() => setActiveTab("orders")}
          >
            <FaShoppingBag />
            Orders
          </button>
          <button
            className={`nav-tab ${activeTab === "wishlist" ? "active" : ""}`}
            onClick={() => setActiveTab("wishlist")}
          >
            <FaHeart />
            Wishlist
          </button>
          <button
            className={`nav-tab ${activeTab === "settings" ? "active" : ""}`}
            onClick={() => setActiveTab("settings")}
          >
            <FaCog />
            Settings
          </button>
        </div>

        {/* Content */}
        <div className="dashboard-content">
          {activeTab === "overview" && (
            <div className="overview-content">
              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-icon">
                    <FaShoppingBag />
                  </div>
                  <div className="stat-info">
                    <h3>Total Orders</h3>
                    <p className="stat-number">0</p>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">
                    <FaHeart />
                  </div>
                  <div className="stat-info">
                    <h3>Wishlist Items</h3>
                    <p className="stat-number">0</p>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">
                    <FaUser />
                  </div>
                  <div className="stat-info">
                    <h3>Account Status</h3>
                    <p className="stat-text">Active</p>
                  </div>
                </div>
              </div>

              <div className="recent-activity">
                <h2>Recent Activity</h2>
                <div className="activity-placeholder">
                  <p>No recent activity to show.</p>
                  <Link href="/" className="shop-link">
                    Start shopping to see your activity here!
                  </Link>
                </div>
              </div>
            </div>
          )}

          {activeTab === "orders" && (
            <div className="orders-content">
              <div className="section-header">
                <h2>Your Orders</h2>
                <p>Track and manage your purchases</p>
              </div>
              <UserOrders user={user} />
            </div>
          )}

          {activeTab === "wishlist" && (
            <div className="wishlist-content">
              <div className="section-header">
                <h2>Your Wishlist</h2>
                <p>Items saved for later</p>
              </div>
              <div className="wishlist-placeholder">
                <FaHeart className="placeholder-icon" />
                <h3>Your wishlist is empty</h3>
                <p>
                  Save items you love to your wishlist for easy access later.
                </p>
                <Link href="/" className="shop-button">
                  Browse Products
                </Link>
              </div>
            </div>
          )}

          {activeTab === "settings" && (
            <div className="settings-content">
              <div className="section-header">
                <h2>Account Settings</h2>
                <p>Manage your account information and preferences</p>
              </div>

              <div className="settings-section">
                <h3>Personal Information</h3>
                <div className="setting-item">
                  <div className="setting-info">
                    <label>Full Name</label>
                    <span>{user.name}</span>
                  </div>
                  <button className="edit-button">
                    <FaEdit />
                    Edit
                  </button>
                </div>
                <div className="setting-item">
                  <div className="setting-info">
                    <label>Email Address</label>
                    <span>{user.email}</span>
                  </div>
                  <button className="edit-button">
                    <FaEdit />
                    Edit
                  </button>
                </div>
              </div>

              <div className="settings-section">
                <h3>Security</h3>
                <div className="setting-item">
                  <div className="setting-info">
                    <label>Password</label>
                    <span>••••••••</span>
                  </div>
                  <button className="edit-button">
                    <FaEdit />
                    Change
                  </button>
                </div>
              </div>

              <div className="settings-section">
                <h3>Account Actions</h3>
                <button className="danger-button">Delete Account</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
