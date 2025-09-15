"use client"

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import ChatInterface from '@/components/ChatInterface'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Home } from 'lucide-react'

interface ChatContext {
  type?: 'weather' | 'crop' | 'pest' | 'market' | 'schemes' | 'soil' | 'general'
  data?: any
  location?: string
}

export default function ChatPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [context, setContext] = useState<ChatContext>({ type: 'general' })

  useEffect(() => {
    // Get context from URL parameters
    const contextType = searchParams.get('type') as ChatContext['type']
    const location = searchParams.get('location')
    const weatherData = searchParams.get('weatherData')

    setContext({
      type: contextType || 'general',
      location: location || undefined,
      data: weatherData ? JSON.parse(decodeURIComponent(weatherData)) : undefined
    })
  }, [searchParams])

  const handleBack = () => {
    router.push('/')
  }

  const handleHome = () => {
    router.push('/')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-amber-50">
      {/* Header */}
      <div className="bg-white/95 backdrop-blur-md border-b-2 border-primary/20 shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="sm"
                onClick={handleBack}
                className="border-2 border-green-500 text-green-600 hover:bg-green-500 hover:text-white"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleHome}
                className="border-2 border-blue-500 text-blue-600 hover:bg-blue-500 hover:text-white"
              >
                <Home className="h-4 w-4 mr-2" />
                Home
              </Button>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-green-600">
              AnnData AI Assistant
            </h1>
            <div className="w-32"></div> {/* Spacer for centering */}
          </div>
        </div>
      </div>

      {/* Chat Interface */}
      <div className="max-w-6xl mx-auto p-4 h-[calc(100vh-80px)]">
        <div className="h-full bg-white rounded-lg shadow-xl">
          <ChatInterface context={context} />
        </div>
      </div>
    </div>
  )
}
