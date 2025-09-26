"use client";

import { useAuth } from "../lib/hooks/useAuth"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import UserDashboard from "../ui/UserDashboard/UserDashboard"
import { UserField } from "../lib/definitions"

export default function MePage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !user) {
      // Redirect to auth page with return URL
      router.push("/auth?returnUrl=/me")
    }
  }, [user, isLoading, router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
          <p className="mt-4 text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null // Will redirect via useEffect
  }

  return <UserDashboard user={user as UserField} />
}
