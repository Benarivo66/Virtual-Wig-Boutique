"use client"

import { UserField } from "@/app/lib/definitions"

interface OrderItem {
  id: string
  productName: string
  quantity: number
  price: number
}

interface Order {
  id: string
  createdAt: string
  status: "pending" | "completed" | "cancelled"
  totalAmount: number
  items: OrderItem[]
}

interface UserOrdersProps {
  user: UserField
  orders: Order[]
}

export default function UserOrders({ user, orders }: UserOrdersProps) {
  // No more internal state or useEffect - data comes from parent

  if (!orders || orders.length === 0) {
    return (
      <div className="p-8 text-center text-gray-500">
        <div className="max-w-md mx-auto">
          <div className="text-6xl mb-4 text-gray-300">📦</div>
          <h3 className="text-xl font-semibold text-gray-600 mb-2">No orders yet</h3>
         <p className="text-gray-500 mb-6">You haven&apos;t placed any orders yet.</p>
          <a 
            href="/products" 
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Start Shopping
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Order ID
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Items
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Date
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Total
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    #{order.id.slice(-8).toUpperCase()}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    <div className="space-y-1">
                      {order.items.slice(0, 2).map((item) => (
                        <div key={item.id} className="flex justify-between">
                          <span className="text-gray-700">{item.productName}</span>
                          <span className="text-gray-500 ml-4">
                            Qty: {item.quantity}
                          </span>
                        </div>
                      ))}
                      {order.items.length > 2 && (
                        <div className="text-xs text-gray-500 italic">
                          +{order.items.length - 2} more items
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(order.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                    ${order.totalAmount.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full
                      ${
                        order.status === "completed"
                          ? "bg-green-100 text-green-800 border border-green-200"
                          : order.status === "cancelled"
                          ? "bg-red-100 text-red-800 border border-red-200"
                          : "bg-yellow-100 text-yellow-800 border border-yellow-200"
                      }`}
                    >
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Summary */}
      <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
        <div className="flex flex-col sm:flex-row justify-between items-center">
          <div className="text-center sm:text-left mb-4 sm:mb-0">
            <h3 className="text-lg font-semibold text-blue-900">Order Summary</h3>
            <p className="text-blue-700">
              {orders.length} order{orders.length !== 1 ? 's' : ''} • {' '}
              {orders.reduce((total, order) => total + order.items.length, 0)} total items
            </p>
          </div>
          <div className="text-center sm:text-right">
            <p className="text-2xl font-bold text-blue-900">
              ${orders.reduce((total, order) => total + order.totalAmount, 0).toFixed(2)}
            </p>
            <p className="text-sm text-blue-700">Total spent</p>
          </div>
        </div>
      </div>

      {/* Help Section */}
      <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Need help with your orders?</h3>
        <p className="text-gray-600 mb-4">
          If you have any questions about your orders or need to request a return, 
          please contact our customer support team.
        </p>
        <div className="flex flex-wrap gap-3">
          <a 
            href="/contact" 
            className="px-4 py-2 bg-gray-800 text-white text-sm rounded hover:bg-gray-900 transition-colors"
          >
            Contact Support
          </a>
          <a 
            href="/help/returns" 
            className="px-4 py-2 bg-white text-gray-700 text-sm rounded border border-gray-300 hover:bg-gray-50 transition-colors"
          >
            Return Policy
          </a>
          <a 
            href="/help/shipping" 
            className="px-4 py-2 bg-white text-gray-700 text-sm rounded border border-gray-300 hover:bg-gray-50 transition-colors"
          >
            Shipping Info
          </a>
        </div>
      </div>
    </div>
  )
}