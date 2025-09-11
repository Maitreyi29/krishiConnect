"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import {
  Cloud,
  Sprout,
  DollarSign,
  FileText,
  Users,
  FlaskConical,
  MessageCircle,
  HelpCircle,
  Mic,
  LogOut,
  Search,
  Tractor,
} from "lucide-react"

interface DashboardProps {
  farmerName: string
  onLogout: () => void
}

const features = [
  {
    icon: Cloud,
    label: "मौसम / Weather / வானிலை",
    gradient: "from-blue-400 to-cyan-500",
    hoverGradient: "hover:from-blue-500 hover:to-cyan-600",
  },
  {
    icon: Sprout,
    label: "फसल सुझाव / Crop Suggestion / பயிர் பரிந்துரை",
    gradient: "from-green-400 to-emerald-500",
    hoverGradient: "hover:from-green-500 hover:to-emerald-600",
  },
  {
    icon: DollarSign,
    label: "मंडी भाव / Market Prices / சந்தை விலை",
    gradient: "from-yellow-400 to-orange-500",
    hoverGradient: "hover:from-yellow-500 hover:to-orange-600",
  },
  {
    icon: FileText,
    label: "सरकारी योजनाएं / Govt Schemes / அரசு திட்டங்கள்",
    gradient: "from-purple-400 to-violet-500",
    hoverGradient: "hover:from-purple-500 hover:to-violet-600",
  },
  {
    icon: Users,
    label: "किसान समुदाय / Community / விவசாயி சமூகம்",
    gradient: "from-pink-400 to-rose-500",
    hoverGradient: "hover:from-pink-500 hover:to-rose-600",
  },
  {
    icon: FlaskConical,
    label: "मिट्टी स्वास्थ्य / Soil Health / மண் ஆரோக்கியம்",
    gradient: "from-amber-400 to-yellow-500",
    hoverGradient: "hover:from-amber-500 hover:to-yellow-600",
  },
  {
    icon: MessageCircle,
    label: "AI भाषा सहायक / AI Lingual Talk / AI மொழி உதவி",
    gradient: "from-indigo-400 to-blue-500",
    hoverGradient: "hover:from-indigo-500 hover:to-blue-600",
  },
  {
    icon: HelpCircle,
    label: "सहायता डेस्क / Help Desk / உதவி மையம்",
    gradient: "from-teal-400 to-green-500",
    hoverGradient: "hover:from-teal-500 hover:to-green-600",
  },
]

const farmerQuotes = [
  {
    hindi: "खेती एक कला है, किसान एक कलाकार है।",
    english: "Farming is an art, the farmer is an artist.",
    tamil: "விவசாயம் ஒரு கலை, விவசாயி ஒரு கலைஞர்.",
  },
  {
    hindi: "मेहनत का फल हमेशा मीठा होता है।",
    english: "The fruit of hard work is always sweet.",
    tamil: "கடின உழைப்பின் பலன் எப்போதும் இனிமையானது.",
  },
  {
    hindi: "धरती माता का सम्मान करो, वो तुम्हें सब कुछ देगी।",
    english: "Respect Mother Earth, she will give you everything.",
    tamil: "பூமி தாயை மதிக்கவும், அவள் உங்களுக்கு எல்லாவற்றையும் தருவாள்.",
  },
  {
    hindi: "बीज में छुपा है पूरा जंगल।",
    english: "A whole forest is hidden in a seed.",
    tamil: "ஒரு விதையில் முழு காடும் மறைந்துள்ளது.",
  },
]

export default function Dashboard({ farmerName, onLogout }: DashboardProps) {
  const [language, setLanguage] = useState("english")
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0)
  const [askQuery, setAskQuery] = useState("")

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentQuoteIndex((prev) => (prev + 1) % farmerQuotes.length)
    }, 10000) // 10 seconds

    return () => clearInterval(interval)
  }, [])

  const getGreeting = () => {
    switch (language) {
      case "hindi":
        return `नमस्ते ${farmerName} 👋 | किसान का साथी – annData`
      case "tamil":
        return `வணக்கம் ${farmerName} 👋 | விவசாயியின் துணை – annData`
      case "bengali":
        return `নমস্কার ${farmerName} 👋 | কৃষকের সাথী – annData`
      case "marathi":
        return `नमस्कार ${farmerName} 👋 | शेतकऱ्याचा साथी – annData`
      case "gujarati":
        return `નમસ્તે ${farmerName} 👋 | ખેડૂતનો સાથી – annData`
      case "punjabi":
        return `ਸਤ ਸ੍ਰੀ ਅਕਾਲ ${farmerName} 👋 | ਕਿਸਾਨ ਦਾ ਸਾਥੀ – annData`
      case "kannada":
        return `ನಮಸ್ಕಾರ ${farmerName} 👋 | ರೈತನ ಸಹಾಯಕ – annData`
      case "telugu":
        return `నమస్కారం ${farmerName} 👋 | రైతు మిత్రుడు – annData`
      case "bhojpuri":
        return `प्रणाम ${farmerName} 👋 | किसान के साथी – annData`
      case "odia":
        return `ନମସ୍କାର ${farmerName} 👋 | କୃଷକଙ୍କ ସାଥୀ – annData`
      default:
        return `Hello ${farmerName} 👋 | Farmer's Companion – annData`
    }
  }

  const getMissionTagline = () => {
    switch (language) {
      case "hindi":
        return "annData – तकनीक के साथ किसानों को सशक्त बनाना"
      case "tamil":
        return "annData – தொழில்நுட்பத்துடன் விவசாயிகளை வலுப்படுத்துதல்"
      case "bengali":
        return "annData – প্রযুক্তির সাথে কৃষকদের ক্ষমতায়ন"
      case "marathi":
        return "annData – तंत्रज्ञानासह शेतकऱ्यांना सक्षम करणे"
      case "gujarati":
        return "annData – ટેકનોલોજી સાથે ખેડૂતોને સશક્ત બનાવવું"
      case "punjabi":
        return "annData – ਤਕਨਾਲੋਜੀ ਨਾਲ ਕਿਸਾਨਾਂ ਨੂੰ ਸਸ਼ਕਤ ਬਣਾਉਣਾ"
      case "kannada":
        return "annData – ತಂತ್ರಜ್ಾನದೊಂದಿಗೆ ರೈತರನ್ನು ಸಬಲೀಕರಣ"
      case "telugu":
        return "annData – సాంకేతికతతో రైతులను శక్తివంతం చేయడం"
      case "bhojpuri":
        return "annData – तकनीक से किसान के सशक्तिकरण"
      case "odia":
        return "annData – ପ୍ରଯୁକ୍ତିବିଦ୍ୟା ସହିତ କୃଷକମାନଙ୍କୁ ସଶକ୍ତିକରଣ"
      default:
        return "annData – Empowering Farmers with Technology"
    }
  }

  const getCurrentQuote = () => {
    const quote = farmerQuotes[currentQuoteIndex]
    switch (language) {
      case "hindi":
      case "bengali":
      case "marathi":
      case "gujarati":
      case "punjabi":
      case "kannada":
      case "telugu":
      case "bhojpuri":
      case "odia":
        return quote.hindi
      default:
        return quote.english
    }
  }

  const handleFeatureClick = (feature: string) => {
    alert(`${feature} feature coming soon! / ${feature} सुविधा जल्द आ रही है!`)
  }

  const handleAskAnnData = () => {
    if (askQuery.trim()) {
      alert(`You asked: "${askQuery}". AI response coming soon! / आपने पूछा: "${askQuery}". AI जवाब जल्द आ रहा है!`)
      setAskQuery("")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-amber-50">
      {/* Top Navigation Bar */}
      <header className="bg-white/90 backdrop-blur-sm border-b-2 border-primary/20 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger className="w-36 h-10 border-2 border-primary/20">
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

            {/* App Title */}
            <h1 className="text-2xl font-bold text-primary flex items-center gap-2">
              <Tractor className="h-6 w-6 text-amber-600" />
              <span className="bg-gradient-to-r from-green-600 to-amber-600 bg-clip-text text-transparent">
                annData
              </span>
            </h1>

            {/* Voice Button and Logout */}
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground bg-transparent"
                onClick={() => alert("Voice assistant coming soon! / आवाज़ सहायक जल्द आ रहा है!")}
              >
                <Mic className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={onLogout}
                className="border-2 border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground bg-transparent"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-primary mb-4 text-balance">{getGreeting()}</h2>
          <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 max-w-xl mx-auto border-2 border-primary/20 mb-6">
            <p className="text-xl font-bold text-primary">{getMissionTagline()}</p>
          </div>

          <div className="max-w-md mx-auto mb-6">
            <div className="relative">
              <Input
                type="text"
                placeholder="👉 Ask annData anything... / annData से कुछ भी पूछें..."
                value={askQuery}
                onChange={(e) => setAskQuery(e.target.value)}
                className="h-14 text-lg border-2 border-primary/20 focus:border-primary pr-12 pl-4"
                onKeyPress={(e) => e.key === "Enter" && handleAskAnnData()}
              />
              <Button
                onClick={handleAskAnnData}
                className="absolute right-1 top-1 h-12 px-4 bg-primary hover:bg-primary/90"
                disabled={!askQuery.trim()}
              >
                <Search className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Rotating Quotes */}
          <div className="bg-green-50 rounded-lg p-3 max-w-lg mx-auto border border-green-200">
            <p className="text-sm font-medium text-green-800 italic text-balance">"{getCurrentQuote()}"</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {features.map((feature, index) => {
            const IconComponent = feature.icon
            return (
              <Card
                key={index}
                className={`cursor-pointer transition-all duration-300 transform hover:scale-105 hover:shadow-xl border-2 border-white/50 bg-gradient-to-br ${feature.gradient} ${feature.hoverGradient} text-white overflow-hidden h-40`}
                onClick={() => handleFeatureClick(feature.label)}
              >
                <CardContent className="p-6 text-center h-full flex flex-col justify-center">
                  <div className="flex justify-center mb-4">
                    <div className="bg-white/20 p-4 rounded-full backdrop-blur-sm">
                      <IconComponent className="h-12 w-12" />
                    </div>
                  </div>
                  <h3 className="text-sm font-bold text-balance leading-tight">{feature.label}</h3>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Footer */}
        <div className="text-center mt-12 text-muted-foreground">
          <p className="text-sm">Made with ❤️ for farmers | किसानों के लिए प्यार से बनाया गया</p>
        </div>
      </main>
    </div>
  )
}
