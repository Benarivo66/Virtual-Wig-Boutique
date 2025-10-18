"use client"

import { useState, useEffect } from "react"
import {
  FaUser,
  FaShoppingBag,
  FaHeart,
  FaCog,
  FaSignOutAlt,
  FaEdit,
  FaStar,
  FaExclamationTriangle,
} from "react-icons/fa"
import { useAuth } from "@/app/lib/hooks/useAuth"
import type { UserField } from "@/app/lib/definitions"
import Link from "next/link"
import "./UserDashboard.css"
import UserOrders from "./UserOrders"

interface OrderItem {
  product_id: string;
  name: string;
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  total_amount: number;
  status: string;
  payment_reference: string;
  created_at: string;
  address?: string;
  phone?: string;
  items: OrderItem[];
}

interface UserDashboardProps {
  user: UserField
}

export default function UserDashboard({ user }: UserDashboardProps) {
  const [activeTab, setActiveTab] = useState<
    "overview" | "orders" | "wishlist" | "settings"
  >("overview")
  const [orders, setOrders] = useState<Order[]>([])
  const [ordersLoading, setOrdersLoading] = useState(true)
  const [availableProducts, setAvailableProducts] = useState<any[]>([])
  const { logout } = useAuth()

  // Fetch orders when component mounts or when user changes
  useEffect(() => {
    async function fetchOrders() {
      try {
        setOrdersLoading(true)
        
        const response = await fetch('/api/orders', {
          credentials: 'include',
        })
        
        if (response.ok) {
          const data = await response.json()
          setOrders(data)
        } else {
          console.error('Failed to fetch orders:', response.status)
          setOrders([])
        }
      } catch (error) {
        console.error('Error fetching orders:', error)
        setOrders([])
      } finally {
        setOrdersLoading(false)
      }
    }

    if (user) {
      fetchOrders()
    }
  }, [user])

  // Fetch available products for review suggestions
  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await fetch('/api/products')
        if (response.ok) {
          const products = await response.json()
          setAvailableProducts(products.slice(0, 6)) // Show first 6 products
        }
      } catch (error) {
        console.error('Failed to fetch products:', error)
      }
    }
    
    fetchProducts()
  }, [])

  const handleSignOutClick = async () => {
    try {
      await logout()
    } catch (error) {
      console.error("Logout failed:", error)
    }
  }

  // Helper function to validate product IDs
  const isValidProductId = (productId: string) => {
    return productId && productId !== 'undefined' && productId.length > 10;
  };

  // Transform orders data for UserOrders component
  const transformOrdersForDisplay = () => {
    return orders.map(order => ({
      id: order.id,
      createdAt: order.created_at,
      status: order.status as "pending" | "completed" | "cancelled",
      totalAmount: order.total_amount,
      items: order.items.map(item => ({
        id: item.product_id,
        productName: item.name,
        quantity: item.quantity,
        price: item.price
      }))
    }));
  };

  // Update the overview stats with real order count
  const totalOrders = orders.length
  const totalOrderItems = orders.reduce((sum, order) => sum + order.items.length, 0)

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
            Orders ({orders.length})
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
                    <p className="stat-number">{totalOrders}</p>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">
                    <FaShoppingBag />
                  </div>
                  <div className="stat-info">
                    <h3>Order Items</h3>
                    <p className="stat-number">{totalOrderItems}</p>
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
                <h2>Recent Orders</h2>
                {orders.length === 0 ? (
                  <div className="activity-placeholder">
                    <p>No recent orders to show.</p>
                    <Link href="/" className="shop-link">
                      Start shopping to see your orders here!
                    </Link>
                  </div>
                ) : (
                  <div className="recent-orders-list">
                    {orders.slice(0, 3).map((order) => (
                      <div key={order.id} className="recent-order-item">
                        <div className="order-header">
                          <span className="order-reference">Order #{order.payment_reference}</span>
                          <span className="order-amount">${order.total_amount.toFixed(2)}</span>
                        </div>
                        <div className="order-details">
                          <span className="order-date">
                            {new Date(order.created_at).toLocaleDateString()}
                          </span>
                          <span className={`order-status ${order.status}`}>
                            {order.status}
                          </span>
                        </div>
                        <div className="order-items">
                          {order.items.length > 0 ? (
                            order.items.slice(0, 2).map((item, index) => (
                              <span key={index} className="order-item-name">
                                {item.name} × {item.quantity}
                              </span>
                            ))
                          ) : (
                            <span className="text-gray-500 italic">No products in this order</span>
                          )}
                          {order.items.length > 2 && (
                            <span className="more-items">+{order.items.length - 2} more</span>
                          )}
                        </div>
                        {/* Review Button for Recent Orders */}
                        {order.items.length > 0 ? (
                          <div className="order-actions">
                            {order.items.map((item, index) => (
                              <Link 
                                key={index}
                                href={isValidProductId(item.product_id) ? `/product/${item.product_id}?review=true` : '#'}
                                className={`review-link ${!isValidProductId(item.product_id) ? 'opacity-50 cursor-not-allowed' : ''}`}
                                onClick={(e) => !isValidProductId(item.product_id) && e.preventDefault()}
                              >
                                <FaStar />
                                Review {item.name}
                              </Link>
                            ))}
                          </div>
                        ) : (
                          <div className="order-actions">
                            <span className="text-sm text-gray-500 italic">No products available for review</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Products You Can Review Section */}
                {availableProducts.length > 0 && (
                  <div className="available-products-section mt-8">
                    <h3 className="text-lg font-semibold mb-4">Featured Products</h3>
                    <p className="text-gray-600 mb-4">Browse our products and make your first purchase to leave reviews!</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {availableProducts.map((product) => (
                        <div key={product.id} className="bg-white p-4 rounded-lg border hover:shadow-md transition-shadow">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <h4 className="font-medium text-gray-900">{product.name}</h4>
                              <p className="text-sm text-gray-600">{product.category}</p>
                              <p className="text-lg font-semibold text-green-600 mt-1">
                                ${Number(product.price).toFixed(2)}
                              </p>
                            </div>
                            <Link 
                              href={`/product/${product.id}`}
                              className="ml-4 px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
                            >
                              View
                            </Link>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="text-center mt-4">
                      <Link 
                        href="/products"
                        className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        <FaShoppingBag className="mr-2" />
                        Browse All Products
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

 {activeTab === "orders" && (
  <div className="orders-content">
    <div className="section-header">
      <h2>Your Orders</h2>
      <p>Track and manage your purchases</p>
    </div>
    
    {/* Add UserOrders component with transformed data */}
    {ordersLoading ? (
      <div className="loading-state">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        <p>Loading your orders...</p>
      </div>
    ) : (
      <UserOrders 
        user={user} 
        orders={transformOrdersForDisplay()} 
      />
    )}
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