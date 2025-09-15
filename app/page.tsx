"use client"

import { useAuth } from "../lib/hooks/useAuth"
import LoginPage from "@/components/LoginPage"
import Dashboard from "@/components/Dashboard"

export default function Home() {
  const { user, logout } = useAuth()

  const handleLogin = (name: string) => {
    // The login logic is now handled by the useAuth hook,
    // but we can still perform additional actions here if needed.
    console.log(`${name} has logged in.`)
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-green-50 to-amber-50">
      {!user ? (
        <LoginPage onLogin={handleLogin} />
      ) : (
        <Dashboard farmerName={user.name || "Farmer"} onLogout={logout} />
      )}
    </main>
  )
}
