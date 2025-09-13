"use client"

import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { useAuth } from '../lib/hooks/useAuth';
import { apiClient } from '../lib/api';
import { Mic, Wheat, Tractor } from "lucide-react"

interface LoginPageProps {
  onLogin: (name: string) => void
}

export default function LoginPage({ onLogin }: LoginPageProps) {
  const [name, setName] = useState("")
  const [mobile, setMobile] = useState("")
  const [language, setLanguage] = useState("english")
  const [isVoiceMode, setIsVoiceMode] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [isCreateAccount, setIsCreateAccount] = useState(false)
  const [location, setLocation] = useState({ state: "", district: "" })
  const [farmingDetails, setFarmingDetails] = useState({ landSize: "", cropTypes: "", farmingExperience: "" })
  const { login, voiceLogin } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !mobile.trim()) {
      setError("Please enter both name and mobile number")
      return
    }

    setIsLoading(true)
    setError("")

    try {
      if (isCreateAccount) {
        const success = await handleRegistration()
        if (success) {
          onLogin(name.trim())
        }
      } else {
        const success = await login(name.trim(), mobile.trim())
        if (success) {
          onLogin(name.trim())
        } else {
          setError("Login failed. Please try again.")
        }
      }
    } catch (error) {
      setError("An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  const validateRegistrationForm = (): string | null => {
    if (!name.trim()) {
      return language === 'english' ? 'Name is required' : 'नाम आवश्यक है';
    }
    
    if (!mobile.trim()) {
      return language === 'english' ? 'Mobile number is required' : 'मोबाइल नंबर आवश्यक है';
    }
    
    const mobileRegex = /^[6-9]\d{9}$/;
    if (!mobileRegex.test(mobile.trim())) {
      return language === 'english' ? 'Please enter a valid Indian mobile number' : 'कृपया एक वैध भारतीय मोबाइल नंबर दर्ज करें';
    }
    
    if (farmingDetails.landSize && isNaN(parseFloat(farmingDetails.landSize))) {
      return language === 'english' ? 'Land size must be a valid number' : 'भूमि का आकार एक वैध संख्या होना चाहिए';
    }
    
    if (farmingDetails.farmingExperience && isNaN(parseInt(farmingDetails.farmingExperience))) {
      return language === 'english' ? 'Farming experience must be a valid number' : 'कृषि अनुभव एक वैध संख्या होना चाहिए';
    }
    
    return null;
  }

  const handleRegistration = async (): Promise<boolean> => {
    try {
      // Validate form before submission
      const validationError = validateRegistrationForm();
      if (validationError) {
        setError(validationError);
        return false;
      }

      const registrationData = {
        name: name.trim(),
        mobile: mobile.trim(),
        language,
        location: {
          state: location.state,
          district: location.district
        },
        farmingDetails: {
          landSize: farmingDetails.landSize ? parseFloat(farmingDetails.landSize) : undefined,
          cropTypes: farmingDetails.cropTypes ? farmingDetails.cropTypes.split(',').map(c => c.trim()) : [],
          farmingExperience: farmingDetails.farmingExperience ? parseInt(farmingDetails.farmingExperience) : undefined
        }
      }

      const response = await apiClient.register(registrationData)
      
      if (response.success) {
        setError("")
        return true
      } else {
        setError(response.message || "Registration failed")
        return false
      }
    } catch (error) {
      setError("Registration failed. Please try again.")
      return false
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
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-green-50 to-amber-50 animate-gradient-x"></div>
      <div className="absolute inset-0 opacity-30" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2334d399' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
      }}></div>
      
      {/* Floating Elements */}
      <div className="absolute top-20 left-20 w-32 h-32 bg-green-200/20 rounded-full blur-xl animate-float"></div>
      <div className="absolute bottom-20 right-20 w-40 h-40 bg-amber-200/20 rounded-full blur-xl animate-float-delayed"></div>
      <div className="absolute top-1/2 left-10 w-24 h-24 bg-emerald-300/20 rounded-full blur-lg animate-pulse"></div>
      
      <div className="fixed left-2 top-2 sm:left-4 sm:top-4 z-10">
        <Select value={language} onValueChange={setLanguage}>
          <SelectTrigger className="w-32 sm:w-40 h-10 sm:h-12 text-sm sm:text-base border-2 border-primary/30 bg-white/95 backdrop-blur-md shadow-lg rounded-xl hover:shadow-xl transition-all duration-300">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-white/95 backdrop-blur-md border-2 border-primary/20 shadow-xl rounded-xl">
            <SelectItem value="english" onSelect={setLanguage} className="hover:bg-green-50">🇬🇧 English</SelectItem>
            <SelectItem value="hindi" onSelect={setLanguage} className="hover:bg-green-50">🇮🇳 हिंदी</SelectItem>
            <SelectItem value="tamil" onSelect={setLanguage} className="hover:bg-green-50">🇮🇳 தமிழ்</SelectItem>
            <SelectItem value="bengali" onSelect={setLanguage} className="hover:bg-green-50">🇮🇳 বাংলা</SelectItem>
            <SelectItem value="marathi" onSelect={setLanguage} className="hover:bg-green-50">🇮🇳 मराठी</SelectItem>
            <SelectItem value="gujarati" onSelect={setLanguage} className="hover:bg-green-50">🇮🇳 ગુજરાતી</SelectItem>
            <SelectItem value="punjabi" onSelect={setLanguage} className="hover:bg-green-50">🇮🇳 ਪੰਜਾਬੀ</SelectItem>
            <SelectItem value="kannada" onSelect={setLanguage} className="hover:bg-green-50">🇮🇳 ಕನ್ನಡ</SelectItem>
            <SelectItem value="telugu" onSelect={setLanguage} className="hover:bg-green-50">🇮🇳 తెలుగు</SelectItem>
            <SelectItem value="bhojpuri" onSelect={setLanguage} className="hover:bg-green-50">🇮🇳 भोजपुरी</SelectItem>
            <SelectItem value="odia" onSelect={setLanguage} className="hover:bg-green-50">🇮🇳 ଓଡ଼ିଆ</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card className="w-full max-w-sm sm:max-w-md lg:max-w-lg border-0 shadow-2xl bg-white/98 backdrop-blur-md relative z-10 rounded-2xl sm:rounded-3xl overflow-hidden transform hover:scale-[1.02] transition-all duration-500">
        {/* Card Glow Effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-green-400/10 via-emerald-400/10 to-amber-400/10 animate-pulse"></div>
        
        <CardHeader className="text-center space-y-4 sm:space-y-6 relative p-4 sm:p-6">
          <div className="flex justify-center">
            <div className="bg-gradient-to-br from-green-100 to-emerald-100 p-4 sm:p-6 rounded-full shadow-lg border-2 sm:border-4 border-white/50 animate-bounce-slow">
              <Wheat className="h-12 w-12 sm:h-16 sm:w-16 text-green-600" />
            </div>
          </div>
          <CardTitle className="text-2xl sm:text-3xl lg:text-4xl font-bold flex items-center justify-center gap-2 sm:gap-3">
            <Tractor className="h-6 w-6 sm:h-8 sm:w-8 lg:h-10 lg:w-10 text-amber-600 animate-pulse" />
            <span className="bg-gradient-to-r from-green-600 via-emerald-600 to-amber-600 bg-clip-text text-transparent font-extrabold tracking-wide">annData</span>
            <span className="text-lg sm:text-xl lg:text-2xl animate-bounce">🌾</span>
          </CardTitle>
          <div className="space-y-4">
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-green-200/50">
              <p className="text-lg sm:text-xl font-bold text-green-700 text-balance leading-relaxed">
                🌱 From Soil to Market – All Guidance in One Place 🏪
              </p>
            </div>
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-amber-200/50">
              <p className="text-base sm:text-lg font-semibold text-amber-800 text-balance">
                📱 Enter your details or use voice to login
                <br />
                <span className="text-sm sm:text-base font-medium text-amber-700">अपना विवरण दर्ज करें या आवाज़ का उपयोग करें</span>
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6 sm:space-y-8 relative p-4 sm:p-6">
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            <div className="relative">
              <Input
                type="text"
                placeholder={`📱 ${placeholders.mobile} / Mobile Number`}
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                className="h-14 sm:h-16 lg:h-18 text-base sm:text-lg border-2 border-primary/30 focus:border-primary rounded-xl sm:rounded-2xl pl-12 sm:pl-14 bg-white/90 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 relative z-10"
                required
              />
              <Tractor className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 sm:h-6 sm:w-6 text-primary/70 z-20" />
            </div>

            <div className="relative">
              <Input
                type="text"
                placeholder={`👤 ${placeholders.name} / Your Name`}
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="h-14 sm:h-16 lg:h-18 text-base sm:text-lg border-2 border-primary/30 focus:border-primary rounded-xl sm:rounded-2xl pl-12 sm:pl-14 bg-white/90 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 relative z-10"
                required
              />
              <Mic className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 sm:h-6 sm:w-6 text-primary/70 z-20" />
            </div>
            {isCreateAccount && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    type="text"
                    placeholder={language === 'english' ? '🏛️ State' : '🏛️ राज्य'}
                    value={location.state}
                    onChange={(e) => setLocation({...location, state: e.target.value})}
                    className="h-12 text-base border-2 border-primary/30 focus:border-primary rounded-xl bg-white/90 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300"
                  />
                  <Input
                    type="text"
                    placeholder={language === 'english' ? '🏘️ District' : '🏘️ जिला'}
                    value={location.district}
                    onChange={(e) => setLocation({...location, district: e.target.value})}
                    className="h-12 text-base border-2 border-primary/30 focus:border-primary rounded-xl bg-white/90 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    type="number"
                    placeholder={language === 'english' ? '🌾 Land Size (acres)' : '🌾 भूमि का आकार (एकड़)'}
                    value={farmingDetails.landSize}
                    onChange={(e) => setFarmingDetails({...farmingDetails, landSize: e.target.value})}
                    className="h-12 text-base border-2 border-primary/30 focus:border-primary rounded-xl bg-white/90 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300"
                  />
                  <Input
                    type="number"
                    placeholder={language === 'english' ? '📅 Years of Experience' : '📅 अनुभव के वर्ष'}
                    value={farmingDetails.farmingExperience}
                    onChange={(e) => setFarmingDetails({...farmingDetails, farmingExperience: e.target.value})}
                    className="h-12 text-base border-2 border-primary/30 focus:border-primary rounded-xl bg-white/90 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300"
                  />
                </div>

                <Input
                  type="text"
                  placeholder={language === 'english' ? '🌱 Crops (comma separated)' : '🌱 फसलें (अल्पविराम से अलग करें)'}
                  value={farmingDetails.cropTypes}
                  onChange={(e) => setFarmingDetails({...farmingDetails, cropTypes: e.target.value})}
                  className="h-12 text-base border-2 border-primary/30 focus:border-primary rounded-xl bg-white/90 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300"
                />
              </>
            )}
            {error && (
              <div className="text-red-500 text-sm text-center mb-4 p-2 bg-red-50 rounded-lg">
                {error}
              </div>
            )}
            
            <Button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold py-3 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 
                (isCreateAccount ? "Creating Account..." : "Logging in...") : 
                (isCreateAccount ? 
                  (language === 'english' ? '🌟 Create Account' : '🌟 खाता बनाएं') : 
                  placeholders.login
                )
              }
            </Button>

            {isCreateAccount && (
              <Button
                type="button"
                onClick={() => setIsCreateAccount(false)}
                className="w-full bg-gray-500 hover:bg-gray-600 text-white font-semibold py-3 rounded-xl transition-all duration-300"
              >
                {language === 'english' ? '← Back to Login' : '← लॉगिन पर वापस जाएं'}
              </Button>
            )}
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t-2 border-gradient-to-r from-green-200 via-emerald-300 to-amber-200" />
            </div>
            <div className="relative flex justify-center text-sm font-semibold">
              <span className="bg-white px-4 py-1 text-gray-600 rounded-full border border-gray-200 shadow-sm">✨ {language === 'english' ? 'OR' : 'या'} ✨</span>
            </div>
          </div>

          <Button
            type="button"
            onClick={handleVoiceLogin}
            className="w-full h-14 sm:h-16 lg:h-18 text-lg sm:text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-xl hover:shadow-2xl transform hover:scale-[1.02] transition-all duration-300 rounded-xl sm:rounded-2xl border-0 relative overflow-hidden group animate-pulse-slow"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <span className="relative z-10 flex items-center justify-center gap-1 sm:gap-2">
              <span className="text-lg sm:text-xl lg:text-2xl animate-bounce">🎙️</span>
              {placeholders.voice}
              <span className="text-lg sm:text-xl lg:text-2xl animate-bounce animation-delay-150">🎙️</span>
            </span>
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t-2 border-gradient-to-r from-green-200 via-emerald-300 to-amber-200" />
            </div>
            <div className="relative flex justify-center text-sm font-semibold">
              <span className="bg-white px-4 py-1 text-gray-600 rounded-full border border-gray-200 shadow-sm">
                {language === 'english' ? 'New User?' : 'नए उपयोगकर्ता?'}
              </span>
            </div>
          </div>

          <Button
            type="button"
            onClick={() => setIsCreateAccount(true)}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            {language === 'english' ? '🌟 Create New Account' : '🌟 नया खाता बनाएं'}
          </Button>

          <div className="text-center">
            <div className="bg-gradient-to-r from-green-50 via-emerald-50 to-green-50 p-3 sm:p-4 rounded-xl sm:rounded-2xl border-2 border-green-200/50 shadow-lg">
              <p className="text-xs sm:text-sm font-semibold text-green-700 flex items-center justify-center gap-1 sm:gap-2 flex-wrap">
                <span className="text-base sm:text-lg">📱</span>
                Works even without internet (via SMS & IVR)
                <span className="text-base sm:text-lg">📶</span>
              </p>
              <p className="text-xs sm:text-sm font-medium text-green-600 mt-1 text-center">
                बिना इंटरनेट भी काम करता है (SMS और IVR के माध्यम से)
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
