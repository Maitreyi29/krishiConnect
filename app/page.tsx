
"use client"

import { useState } from "react"
import LoginPage from "@/components/LoginPage"
import Dashboard from "@/components/Dashboard"

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [farmerName, setFarmerName] = useState("")

  const handleLogin = (name: string) => {
    setFarmerName(name)
    setIsLoggedIn(true)
  }

  const handleLogout = () => {
    setIsLoggedIn(false)
    setFarmerName("")
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-green-50 to-amber-50">
      {!isLoggedIn ? (
        <LoginPage onLogin={handleLogin} />
      ) : (
        <Dashboard farmerName={farmerName} onLogout={handleLogout} />
      )}
    </main>
  )
}
