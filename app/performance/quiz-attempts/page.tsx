"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function QuizAttemptsPage() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to the performance page with the attempts tab selected
    router.push("/performance?tab=attempts")
  }, [router])

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500"></div>
      <p className="ml-4 text-gray-300">Redirecting to performance dashboard...</p>
    </div>
  )
}
