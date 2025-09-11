"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Mic, Wheat, Tractor } from "lucide-react"

interface LoginPageProps {
  onLogin: (name: string) => void
}

export default function LoginPage({ onLogin }: LoginPageProps) {
  const [name, setName] = useState("")
  const [mobile, setMobile] = useState("")
  const [language, setLanguage] = useState("english")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (name.trim()) {
      onLogin(name.trim())
    }
  }

  const handleVoiceLogin = () => {
    // Placeholder for voice functionality
    alert("Voice login feature coming soon! / आवाज़ लॉगिन जल्द आ रहा है!")
  }

  const getPlaceholderText = () => {
    switch (language) {
      case "hindi":
        return { name: "आपका नाम", mobile: "मोबाइल नंबर", login: "लॉगिन", voice: "आवाज़ लॉगिन" }
      case "tamil":
        return { name: "உங்கள் பெயர்", mobile: "மொபைல் எண்", login: "உள்நுழைவு", voice: "குரல் உள்நுழைவு" }
      case "bengali":
        return { name: "আপনার নাম", mobile: "মোবাইল নম্বর", login: "লগইন", voice: "ভয়েস লগইন" }
      case "marathi":
        return { name: "तुमचे नाव", mobile: "मोबाइल नंबर", login: "लॉगिन", voice: "आवाज लॉगिन" }
      case "gujarati":
        return { name: "તમારું નામ", mobile: "મોબાઇલ નંબર", login: "લોગિન", voice: "વૉઇસ લોગિન" }
      case "punjabi":
        return { name: "ਤੁਹਾਡਾ ਨਾਮ", mobile: "ਮੋਬਾਈਲ ਨੰਬਰ", login: "ਲਾਗਇਨ", voice: "ਆਵਾਜ਼ ਲਾਗਇਨ" }
      case "kannada":
        return { name: "ನಿಮ್ಮ ಹೆಸರು", mobile: "ಮೊಬೈಲ್ ಸಂಖ್ಯೆ", login: "ಲಾಗಿನ್", voice: "ಧ್ವನಿ ಲಾಗಿನ್" }
      case "telugu":
        return { name: "మీ పేరు", mobile: "మొబైల్ నంబర్", login: "లాగిన్", voice: "వాయిస్ లాగిన్" }
      case "bhojpuri":
        return { name: "राउर नाम", mobile: "मोबाइल नंबर", login: "लॉगिन", voice: "आवाज़ लॉगिन" }
      case "odia":
        return { name: "ଆପଣଙ୍କ ନାମ", mobile: "ମୋବାଇଲ୍ ନମ୍ବର", login: "ଲଗଇନ୍", voice: "ଭଏସ୍ ଲଗଇନ୍" }
      default:
        return { name: "Your Name", mobile: "Mobile Number", login: "Login", voice: "Voice Login" }
    }
  }

  const placeholders = getPlaceholderText()

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-green-50 to-amber-50">
      <div className="fixed left-4 top-4">
        <Select value={language} onValueChange={setLanguage}>
          <SelectTrigger className="w-36 h-10 border-2 border-primary/20 bg-white/90 backdrop-blur-sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="english">English</SelectItem>
            <SelectItem value="hindi">हिंदी</SelectItem>
            <SelectItem value="tamil">தமிழ்</SelectItem>
            <SelectItem value="bengali">বাংলা</SelectItem>
            <SelectItem value="marathi">मराठी</SelectItem>
            <SelectItem value="gujarati">ગુજરાતી</SelectItem>
            <SelectItem value="punjabi">ਪੰਜਾਬੀ</SelectItem>
            <SelectItem value="kannada">ಕನ್ನಡ</SelectItem>
            <SelectItem value="telugu">తెలుగు</SelectItem>
            <SelectItem value="bhojpuri">भोजपुरी</SelectItem>
            <SelectItem value="odia">ଓଡ଼ିଆ</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card className="w-full max-w-md border-2 border-primary shadow-2xl bg-white/95 backdrop-blur-sm">
        <CardHeader className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="bg-primary/10 p-4 rounded-full">
              <Wheat className="h-12 w-12 text-primary" />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold text-primary flex items-center justify-center gap-2">
            <Tractor className="h-8 w-8 text-amber-600" />
            <span className="bg-gradient-to-r from-green-600 to-amber-600 bg-clip-text text-transparent">annData</span>
            🌾
          </CardTitle>
          <div className="space-y-3">
            <p className="text-xl font-bold text-primary text-balance leading-relaxed">
              From Soil to Market – All Guidance in One Place
            </p>
            <p className="text-xl font-bold text-foreground text-balance">
              Enter your details or use voice to login
              <br />
              <span className="text-lg font-semibold">अपना विवरण दर्ज करें या आवाज़ का उपयोग करें</span>
            </p>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <Input
                type="tel"
                placeholder={`${placeholders.mobile} / Mobile Number`}
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                className="h-16 text-lg border-2 border-primary/20 focus:border-primary pl-4"
                maxLength={10}
              />
            </div>
            <div className="relative">
              <Input
                type="text"
                placeholder={`${placeholders.name} / Your Name`}
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="h-16 text-lg border-2 border-primary/20 focus:border-primary pl-12"
                required
              />
              <Mic className="absolute left-3 top-1/2 transform -translate-y-1/2 h-6 w-6 text-primary/60" />
            </div>
            <Button
              type="submit"
              className="w-full h-16 text-xl font-bold bg-primary hover:bg-primary/90"
              disabled={!name.trim()}
            >
              {placeholders.login} / Login
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">या / OR</span>
            </div>
          </div>

          <Button
            type="button"
            onClick={handleVoiceLogin}
            className="w-full h-16 text-xl font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-lg border-2 border-blue-700"
          >
            🎙️ {placeholders.voice} / Voice Login 🎙️
          </Button>

          <div className="text-center">
            <p className="text-sm font-medium text-muted-foreground bg-green-50 p-3 rounded-lg border border-green-200">
              📱 Works even without internet (via SMS & IVR)
              <br />
              <span className="text-xs">बिना इंटरनेट भी काम करता है (SMS और IVR के माध्यम से)</span>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
