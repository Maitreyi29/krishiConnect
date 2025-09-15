"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { apiClient } from "@/lib/api"
import {
  Bug,
  Cloud,
  DollarSign,
  FileText,
  FlaskConical,
  HelpCircle,
  Languages,
  LogOut,
  MessageCircle,
  Mic,
  Search,
  Sprout,
  Users,
  ChevronDown,
  Tractor,
  Bot,
  X,
} from "lucide-react"

interface DashboardProps {
  farmerName: string
  onLogout: () => void
}

interface ChatContext {
  type?: 'weather' | 'crop' | 'pest' | 'market' | 'schemes' | 'soil' | 'general'
  data?: any
  location?: string
}

const featuresData = [
  {
    icon: Cloud,
    labels: {
      hindi: "मौसम पूर्वानुमान",
      english: "Weather Forecast",
      tamil: "வானிலை முன்னறிவிப்பு",
      bengali: "আবহাওয়া পূর্বাভাস",
      marathi: "हवामान अंदाज",
      gujarati: "હવામાન આગાહી",
      punjabi: "ਮੌਸਮ ਦੀ ਭਵਿੱਖਬਾਣੀ",
      kannada: "ಹವಾಮಾನ ಮುನ್ನೋಟ",
      telugu: "వాతావరణ అంచనా",
      bhojpuri: "मौसम के अनुमान",
      odia: "ପାଣିପାଗ ପୂର୍ବାନୁମାନ"
    },
    gradient: "from-blue-400 to-cyan-500",
    hoverGradient: "hover:from-blue-500 hover:to-cyan-600",
  },
  {
    icon: Sprout,
    labels: {
      hindi: "फसल सुझाव",
      english: "Crop Advice",
      tamil: "பயிர் ஆலோசனை",
      bengali: "ফসল পরামর্শ",
      marathi: "पीक सल्ला",
      gujarati: "પાક સલાહ",
      punjabi: "ਫਸਲ ਸਲਾਹ",
      kannada: "ಬೆಳೆ ಸಲಹೆ",
      telugu: "పంట సలహా",
      bhojpuri: "फसल के सलाह",
      odia: "ଫସଲ ପରାମର୍ଶ"
    },
    gradient: "from-green-400 to-emerald-500",
    hoverGradient: "hover:from-green-500 hover:to-emerald-600",
  },
  {
    icon: Bug,
    labels: {
      hindi: "कीट नियंत्रण",
      english: "Pest Control",
      tamil: "பூச்சி கட்டுப்பாடு",
      bengali: "কীটপতঙ্গ নিয়ন্ত্রণ",
      marathi: "कीड नियंत्रण",
      gujarati: "જંતુ નિયંત્રણ",
      punjabi: "ਕੀੜੇ ਨਿਯੰਤਰਣ",
      kannada: "ಕೀಟ ನಿಯಂತ್ರಣ",
      telugu: "కీటక నియంత్రణ",
      bhojpuri: "कीड़ा नियंत्रण",
      odia: "କୀଟ ନିୟନ୍ତ୍ରଣ"
    },
    gradient: "from-red-400 to-pink-500",
    hoverGradient: "hover:from-red-500 hover:to-pink-600",
  },
  {
    icon: DollarSign,
    labels: {
      hindi: "मंडी भाव",
      english: "Market Prices",
      tamil: "சந்தை விலை",
      bengali: "বাজার দাম",
      marathi: "बाजार भाव",
      gujarati: "બજાર ભાવ",
      punjabi: "ਮਾਰਕੀਟ ਰੇਟ",
      kannada: "ಮಾರುಕಟ್ಟೆ ಬೆಲೆ",
      telugu: "మార్కెట్ ధరలు",
      bhojpuri: "बाजार के भाव",
      odia: "ବଜାର ଦର"
    },
    gradient: "from-yellow-400 to-orange-500",
    hoverGradient: "hover:from-yellow-500 hover:to-orange-600",
  },
  {
    icon: FileText,
    labels: {
      hindi: "सरकारी योजनाएं",
      english: "Government Schemes",
      tamil: "அரசு திட்டங்கள்",
      bengali: "সরকারি প্রকল্প",
      marathi: "सरकारी योजना",
      gujarati: "સરકારી યોજનાઓ",
      punjabi: "ਸਰਕਾਰੀ ਸਕੀਮਾਂ",
      kannada: "ಸರ್ಕಾರಿ ಯೋಜನೆಗಳು",
      telugu: "ప్రభుత్వ పథకాలు",
      bhojpuri: "सरकारी योजना",
      odia: "ସରକାରୀ ଯୋଜନା"
    },
    gradient: "from-purple-400 to-violet-500",
    hoverGradient: "hover:from-purple-500 hover:to-violet-600",
  },
  {
    icon: Users,
    labels: {
      hindi: "किसान समुदाय",
      english: "Farmer Community",
      tamil: "விவசாயி சமூகம்",
      bengali: "কৃষক সম্প্রদায়",
      marathi: "शेतकरी समुदाय",
      gujarati: "ખેડૂત સમુદાય",
      punjabi: "ਕਿਸਾਨ ਭਾਈਚਾਰਾ",
      kannada: "ರೈತ ಸಮುದಾಯ",
      telugu: "రైతు సమాజం",
      bhojpuri: "किसान समुदाय",
      odia: "କୃଷକ ସମ୍ପ୍ରଦାୟ"
    },
    gradient: "from-pink-400 to-rose-500",
    hoverGradient: "hover:from-pink-500 hover:to-rose-600",
  },
  {
    icon: FlaskConical,
    labels: {
      hindi: "मिट्टी स्वास्थ्य",
      english: "Soil Health",
      tamil: "மண் ஆரோக்கியம்",
      bengali: "মাটির স্বাস্থ্য",
      marathi: "माती आरोग्य",
      gujarati: "માટીની તંદુરસ્તી",
      punjabi: "ਮਿੱਟੀ ਦੀ ਸਿਹਤ",
      kannada: "ಮಣ್ಣಿನ ಆರೋಗ್ಯ",
      telugu: "నేల ఆరోగ్యం",
      bhojpuri: "माटी के सेहत",
      odia: "ମାଟିର ସ୍ୱାସ୍ଥ୍ୟ"
    },
    gradient: "from-amber-400 to-yellow-500",
    hoverGradient: "hover:from-amber-500 hover:to-yellow-600",
  },
  {
    icon: MessageCircle,
    labels: {
      hindi: "AI भाषा सहायक",
      english: "AI Language Assistant",
      tamil: "AI மொழி உதவியாளர்",
      bengali: "AI ভাষা সহায়ক",
      marathi: "AI भाषा सहाय्यक",
      gujarati: "AI ભાષા સહાયક",
      punjabi: "AI ਭਾਸ਼ਾ ਸਹਾਇਕ",
      kannada: "AI ಭಾಷಾ ಸಹಾಯಕ",
      telugu: "AI భాషా సహాయకుడు",
      bhojpuri: "AI भाषा सहायक",
      odia: "AI ଭାଷା ସହାୟକ"
    },
    gradient: "from-indigo-400 to-blue-500",
    hoverGradient: "hover:from-indigo-500 hover:to-blue-600",
  },
  {
    icon: HelpCircle,
    labels: {
      hindi: "सहायता डेस्क",
      english: "Help Desk",
      tamil: "உதவி மையம்",
      bengali: "সাহায্য ডেস্ক",
      marathi: "मदत डेस्क",
      gujarati: "મદદ ડેસ્ક",
      punjabi: "ਮਦਦ ਡੈਸਕ",
      kannada: "ಸಹಾಯ ಡೆಸ್ಕ್",
      telugu: "సహాయ డెస్క్",
      bhojpuri: "सहायता डेस्क",
      odia: "ସାହାଯ୍ୟ ଡେସ୍କ"
    },
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
  const router = useRouter()
  const [language, setLanguage] = useState("english")
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0)
  const [askQuery, setAskQuery] = useState("")
  const [userLocation, setUserLocation] = useState<string>('')

  // Get features with dynamic labels based on language
  const getFeatures = () => {
    return featuresData.map(feature => ({
      ...feature,
      label: feature.labels[language as keyof typeof feature.labels] || feature.labels.english
    }))
  }

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentQuoteIndex((prev) => (prev + 1) % farmerQuotes.length)
    }, 10000) // 10 seconds

    return () => clearInterval(interval)
  }, [])

  const handleLanguageChange = (newLanguage: string) => {
    console.log('Language changing to:', newLanguage)
    setLanguage(newLanguage)
    // Force re-render by updating state
    setTimeout(() => {
      console.log('Language state updated to:', newLanguage)
    }, 100)
  }

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
        return `ନମସ୍କାର ${farmerName} 👋 | କୃଷକ ସାଥୀ – annData`
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

  const getSearchPlaceholder = () => {
    switch (language) {
      case "hindi":
        return "🤖 annData से कुछ भी पूछें..."
      case "tamil":
        return "🤖 annData இல் எதைவேணும் கேளுங்கள்..."
      case "bengali":
        return "🤖 annData এর কাছে যে কোনো কিছু জিজ্ঞাসা করুন..."
      case "marathi":
        return "🤖 annData ला काहीही विचारा..."
      case "gujarati":
        return "🤖 annData ને કાંઈ પૂછો..."
      case "punjabi":
        return "🤖 annData ਤੋਂ ਕੁਝ ਵੀ ਪੁੱਛੋ..."
      case "kannada":
        return "🤖 annData ಗೆ ಯಾವುದಾದರೂ ಕೇಳಿ..."
      case "telugu":
        return "🤖 annData ను ఎమైనా అడగండి..."
      case "bhojpuri":
        return "🤖 annData से कुछ भी पूछीं..."
      case "odia":
        return "🤖 annData କୁ କିଛି ପୁଛନ୍ତୁ..."
      default:
        return "🤖 Ask annData anything..."
    }
  }

  const getButtonTexts = () => {
    switch (language) {
      case "hindi":
        return {
          voice: "🎙️ आवाज़",
          logout: "🚪 लॉगआउट",
          madeWith: "किसानों के लिए प्यार से बनाया गया",
          forFarmers: "किसानों के लिए प्यार से बनाया गया"
        }
      case "tamil":
        return {
          voice: "🎙️ குரல்",
          logout: "🚪 வெளியேறு",
          madeWith: "விவசாயிகளுக்காக அன்புடன் செய்யப்பட்டது",
          forFarmers: "விவசாயிகளுக்காக அன்புடன் செய்யப்பட்டது"
        }
      case "bengali":
        return {
          voice: "🎙️ কণ্ঠস্বর",
          logout: "🚪 লগআউট",
          madeWith: "কৃষকদের জন্য ভালোবাসা দিয়ে তৈরি",
          forFarmers: "কৃষকদের জন্য ভালোবাসা দিয়ে তৈরি"
        }
      case "marathi":
        return {
          voice: "🎙️ आवाज",
          logout: "🚪 लॉगआउट",
          madeWith: "शेतकऱ्यांसाठी प्रेमाने बनविलेले",
          forFarmers: "शेतकऱ्यांसाठी प्रेमाने बनविलेले"
        }
      case "gujarati":
        return {
          voice: "🎙️ અવાજ",
          logout: "🚪 લોગઆઉટ",
          madeWith: "ખેડૂતો માટે પ્રેમથી બનાવેલ",
          forFarmers: "ખેડૂતો માટે પ્રેમથી બનાવેલ"
        }
      case "punjabi":
        return {
          voice: "🎙️ ਆਵਾਜ਼",
          logout: "🚪 ਲੋਗਆਉਟ",
          madeWith: "ਕਿਸਾਨਾਂ ਲਈ ਪਿਆਰ ਨਾਲ ਬਣਾਇਆ ਗਿਆ",
          forFarmers: "ਕਿਸਾਨਾਂ ਲਈ ਪਿਆਰ ਨਾਲ ਬਣਾਇਆ ਗਿਆ"
        }
      case "kannada":
        return {
          voice: "🎙️ ಧ್ವನಿ",
          logout: "🚪 ಲಾಗ್ಔಟ್",
          madeWith: "ರೈತರಿಗಾಗಿ ಪ್ರೀತಿಯಿಂದ ತಯಾರಿಸಲಾಗಿದೆ",
          forFarmers: "ರೈತರಿಗಾಗಿ ಪ್ರೀತಿಯಿಂದ ತಯಾರಿಸಲಾಗಿದೆ"
        }
      case "telugu":
        return {
          voice: "🎙️ వాయిస్",
          logout: "🚪 లాగ్అవుట్",
          madeWith: "రైతుల కోసం ప్రేమతో తయారు చేయబడింది",
          forFarmers: "రైతుల కోసం ప్రేమతో తయారు చేయబడింది"
        }
      case "bhojpuri":
        return {
          voice: "🎙️ आवाज़",
          logout: "🚪 लॉगआउट",
          madeWith: "किसान लोगन खातिर प्यार से बनावल गइल बा",
          forFarmers: "किसान लोगन खातिर प्यार से बनावल गइल बा"
        }
      case "odia":
        return {
          voice: "🎙️ ସ୍ୱର",
          logout: "🚪 ଲଗଆଉଟ",
          madeWith: "କୃଷକମାନଙ୍କ ପାଇଁ ଭଲପାଇବାରେ ତିଆରି",
          forFarmers: "କୃଷକମାନଙ୍କ ପାଇଁ ଭଲପାଇବାରେ ତିଆରି"
        }
      default:
        return {
          voice: "🎙️ Voice",
          logout: "🚪 Logout",
          madeWith: "Made with ❤️ for farmers",
          forFarmers: "Made with ❤️ for farmers"
        }
    }
  }

  const getAlertMessages = () => {
    switch (language) {
      case "hindi":
        return {
          voiceAssistant: "आवाज़ सहायक जल्द आ रहा है!",
          featureComingSoon: "सुविधा जल्द आ रही है!",
          youAsked: "आपने पूछा:",
          aiResponse: "AI जवाब जल्द आ रहा है!"
        }
      case "tamil":
        return {
          voiceAssistant: "குரல் துணை வேகமாக வருகிறது!",
          featureComingSoon: "அம்சம் வேகமாக வருகிறது!",
          youAsked: "நீங்கள் கேட்டீர்கள்:",
          aiResponse: "AI பதில் வேகமாக வருகிறது!"
        }
      case "bengali":
        return {
          voiceAssistant: "ভয়েস সহায়ক শীঘ্রই আসছে!",
          featureComingSoon: "বৈশিষ্ট্য শীঘ্রই আসছে!",
          youAsked: "আপনি জিজ্ঞাসা করেছেন:",
          aiResponse: "AI উত্তর শীঘ্রই আসছে!"
        }
      case "marathi":
        return {
          voiceAssistant: "व्हॉइस असिस्टंट लवकरच येत आहे!",
          featureComingSoon: "वैशिष्ट्य लवकरच येत आहे!",
          youAsked: "तुम्ही विचारले:",
          aiResponse: "AI उत्तर लवकरच येत आहे!"
        }
      case "gujarati":
        return {
          voiceAssistant: "વૉઇસ આસિસ્ટન્ટ જલ્દી આવી રહ્યું છે!",
          featureComingSoon: "ફીચર જલ્દી આવી રહ્યું છે!",
          youAsked: "તમે પૂછ્યું:",
          aiResponse: "AI જવાબ જલ્દી આવી રહ્યો છે!"
        }
      case "punjabi":
        return {
          voiceAssistant: "ਵਾਇਸ ਅਸਿਸਟੈਂਟ ਜਲਦੀ ਆ ਰਿਹਾ ਹੈ!",
          featureComingSoon: "ਫੀਚਰ ਜਲਦੀ ਆ ਰਿਹਾ ਹੈ!",
          youAsked: "ਤੁਸੀਂ ਪੁੱਛਿਆ:",
          aiResponse: "AI ਜਵਾਬ ਜਲਦੀ ਆ ਰਿਹਾ ਹੈ!"
        }
      case "kannada":
        return {
          voiceAssistant: "ವಾಯ್ಸ್ ಅಸಿಸ್ಟೆಂಟ್ ಶೀಘ್ರದಲ್ಲೇ ಬರುತ್ತಿದೆ!",
          featureComingSoon: "ವೈಶಿಷ್ಟ್ಯ ಶೀಘ್ರದಲ್ಲೇ ಬರುತ್ತಿದೆ!",
          youAsked: "ನೀವು ಕೇಳಿದ್ದೀರಿ:",
          aiResponse: "AI ಉತ್ತರ ಶೀಘ್ರದಲ್ಲೇ ಬರುತ್ತಿದೆ!"
        }
      case "telugu":
        return {
          voiceAssistant: "వాయిస్ అసిస్టెంట్ త్వరలో వస్తోంది!",
          featureComingSoon: "ఫీచర్ త్వరలో వస్తోంది!",
          youAsked: "మీరు అడిగారు:",
          aiResponse: "AI సమాధానం త్వరలో వస్తోంది!"
        }
      case "bhojpuri":
        return {
          voiceAssistant: "आवाज़ सहायक जल्दी आ रहल बा!",
          featureComingSoon: "सुविधा जल्दी आ रहल बा!",
          youAsked: "राउर पूछनी:",
          aiResponse: "AI जवाब जल्दी आ रहल बा!"
        }
      case "odia":
        return {
          voiceAssistant: "ଭଏସ୍ ଆସିଷ୍ଟାଣ୍ଟ ଶୀଘ୍ର ଆସୁଛି!",
          featureComingSoon: "ଫିଚର ଶୀଘ୍ର ଆସୁଛି!",
          youAsked: "ଆପଣ ପଚାରିଲେ:",
          aiResponse: "AI ଉତ୍ତର ଶୀଘ୍ର ଆସୁଛି!"
        }
      default:
        return {
          voiceAssistant: "Voice assistant coming soon!",
          featureComingSoon: "feature coming soon!",
          youAsked: "You asked:",
          aiResponse: "AI response coming soon!"
        }
    }
  }

  const handleFeatureClick = async (feature: string, featureType: string) => {
    // Handle weather card specifically
    if (featureType === 'weather') {
      await handleWeatherCardClick()
      return
    }
    
    // Handle other AI-powered features
    if (['crop', 'pest', 'market', 'schemes', 'soil'].includes(featureType)) {
      const params = new URLSearchParams({
        type: featureType,
        location: userLocation || 'India'
      })
      router.push(`/chat?${params.toString()}`)
      return
    }
    
    // For other features, show coming soon message
    const messages = getAlertMessages()
    alert(`${feature} ${messages.featureComingSoon}`)
  }

  const handleWeatherCardClick = async () => {
    try {
      // Get user's location (you can enhance this with geolocation API)
      const location = userLocation || 'Delhi' // Default location
      
      // Fetch current weather data
      const weatherResponse = await apiClient.getCurrentWeather(location)
      
      const params = new URLSearchParams({
        type: 'weather',
        location: location
      })
      
      if (weatherResponse.success) {
        params.append('weatherData', encodeURIComponent(JSON.stringify(weatherResponse.data)))
      }
      
      router.push(`/chat?${params.toString()}`)
    } catch (error) {
      console.error('Weather fetch error:', error)
      // Still navigate to chat but without weather data
      const params = new URLSearchParams({
        type: 'weather',
        location: userLocation || 'Delhi'
      })
      router.push(`/chat?${params.toString()}`)
    }
  }

  const handleAskAnnData = () => {
    if (askQuery.trim()) {
      const params = new URLSearchParams({
        type: 'general',
        query: askQuery.trim()
      })
      router.push(`/chat?${params.toString()}`)
      setAskQuery("")
    }
  }

  const handleChatOpen = () => {
    router.push('/chat')
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-green-50 to-amber-50 animate-gradient-x"></div>
      <div className="absolute inset-0 opacity-20" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2334d399' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
      }}></div>
      
      {/* Floating Elements */}
      <div className="absolute top-10 right-10 w-20 h-20 bg-green-200/10 rounded-full blur-xl animate-float"></div>
      <div className="absolute bottom-10 left-10 w-24 h-24 bg-amber-200/10 rounded-full blur-xl animate-float-delayed"></div>
      
      {/* Top Navigation Bar */}
      <header className="bg-white/95 backdrop-blur-md border-b-2 border-primary/20 shadow-xl relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="flex items-center justify-between flex-wrap gap-4 sm:gap-0">
            <Select value={language} onValueChange={handleLanguageChange}>
              <SelectTrigger className="w-32 sm:w-40 h-10 sm:h-12 text-sm sm:text-base border-2 border-primary/30 bg-white/90 backdrop-blur-sm shadow-lg rounded-xl hover:shadow-xl transition-all duration-300">
                <SelectValue placeholder="Select Language" />
              </SelectTrigger>
              <SelectContent className="bg-white/95 backdrop-blur-md border-2 border-primary/20 shadow-xl rounded-xl">
                <SelectItem value="english" className="hover:bg-green-50">🇬🇧 English</SelectItem>
                <SelectItem value="hindi" className="hover:bg-green-50">🇮🇳 हिंदी</SelectItem>
                <SelectItem value="tamil" className="hover:bg-green-50">🇮🇳 தமிழ்</SelectItem>
                <SelectItem value="bengali" className="hover:bg-green-50">🇮🇳 বাংলা</SelectItem>
                <SelectItem value="marathi" className="hover:bg-green-50">🇮🇳 मराठी</SelectItem>
                <SelectItem value="gujarati" className="hover:bg-green-50">🇮🇳 ગુજરાતી</SelectItem>
                <SelectItem value="punjabi" className="hover:bg-green-50">🇮🇳 ਪੰਜਾਬੀ</SelectItem>
                <SelectItem value="kannada" className="hover:bg-green-50">🇮🇳 ಕನ್ನಡ</SelectItem>
                <SelectItem value="telugu" className="hover:bg-green-50">🇮🇳 తెలుగు</SelectItem>
                <SelectItem value="bhojpuri" className="hover:bg-green-50">🇮🇳 भोजपुरी</SelectItem>
                <SelectItem value="odia" className="hover:bg-green-50">🇮🇳 ଓଡ଼ିଆ</SelectItem>
              </SelectContent>
            </Select>

            {/* App Title */}
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold flex items-center gap-2 sm:gap-3 order-first sm:order-none w-full sm:w-auto justify-center sm:justify-start">
              <Tractor className="h-6 w-6 sm:h-8 sm:w-8 text-amber-600 animate-pulse" />
              <span className="bg-gradient-to-r from-green-600 via-emerald-600 to-amber-600 bg-clip-text text-transparent font-extrabold tracking-wide">
                annData
              </span>
              <span className="text-lg sm:text-xl animate-bounce">🌾</span>
            </h1>

            {/* Voice Button and Logout */}
            <div className="flex items-center gap-2 sm:gap-3">
              <Button
                variant="outline"
                size="sm"
                className="border-2 border-blue-500 text-blue-600 hover:bg-blue-500 hover:text-white bg-white/90 backdrop-blur-sm shadow-lg rounded-xl h-10 sm:h-12 px-2 sm:px-4 transition-all duration-300 hover:scale-105"
                onClick={() => alert(getAlertMessages().voiceAssistant)}
              >
                <Mic className="h-4 w-4 sm:h-5 sm:w-5 sm:mr-2" />
                <span className="hidden sm:inline">{getButtonTexts().voice}</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={onLogout}
                className="border-2 border-red-500 text-red-600 hover:bg-red-500 hover:text-white bg-white/90 backdrop-blur-sm shadow-lg rounded-xl h-10 sm:h-12 px-2 sm:px-4 transition-all duration-300 hover:scale-105"
              >
                <LogOut className="h-4 w-4 sm:h-5 sm:w-5 sm:mr-2" />
                <span className="hidden sm:inline">{getButtonTexts().logout}</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 relative z-10">
        {/* Welcome Section */}
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 sm:mb-6 text-balance bg-gradient-to-r from-green-600 via-emerald-600 to-amber-600 bg-clip-text text-transparent px-2">{getGreeting()}</h2>
          <div className="bg-gradient-to-r from-white/90 to-white/80 backdrop-blur-md rounded-xl sm:rounded-2xl p-4 sm:p-6 max-w-2xl mx-auto border-2 border-primary/30 mb-6 sm:mb-8 shadow-xl hover:shadow-2xl transition-all duration-300">
            <p className="text-lg sm:text-xl lg:text-2xl font-bold text-green-700 px-2">{getMissionTagline()}</p>
          </div>

          <div className="max-w-2xl mx-auto mb-6 sm:mb-8 px-2">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-green-400/20 to-blue-400/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <Input
                type="text"
                placeholder={getSearchPlaceholder()}
                value={askQuery}
                onChange={(e) => setAskQuery(e.target.value)}
                className="h-14 sm:h-16 text-base sm:text-lg border-2 border-primary/30 focus:border-primary rounded-xl sm:rounded-2xl pr-14 sm:pr-16 pl-4 sm:pl-6 bg-white/90 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 relative z-10"
                onKeyPress={(e) => e.key === "Enter" && handleAskAnnData()}
              />
              <Button
                onClick={handleAskAnnData}
                className="absolute right-1 sm:right-2 top-1 sm:top-2 h-12 sm:h-12 px-3 sm:px-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg rounded-lg sm:rounded-xl transition-all duration-300 hover:scale-105"
                disabled={!askQuery.trim()}
              >
                <Search className="h-4 w-4 sm:h-5 sm:w-5" />
              </Button>
            </div>
          </div>

          {/* Rotating Quotes */}
          <div className="bg-gradient-to-r from-green-50 via-emerald-50 to-green-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 max-w-2xl mx-auto border-2 border-green-200/50 shadow-lg">
            <p className="text-sm sm:text-base lg:text-lg font-semibold text-green-800 italic text-balance flex items-center justify-center gap-1 sm:gap-2 flex-wrap px-2">
              <span className="text-xl">🌱</span>
              "{getCurrentQuote()}"
              <span className="text-lg sm:text-xl">🌾</span>
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 max-w-7xl mx-auto px-2">
          {getFeatures().map((feature, index) => {
            const IconComponent = feature.icon
            // Map feature types based on index
            const featureTypes = ['weather', 'crop', 'pest', 'market', 'schemes', 'community', 'soil', 'general', 'help']
            const featureType = featureTypes[index] || 'general'
            
            return (
              <Card
                key={index}
                className={`cursor-pointer transition-all duration-500 transform hover:scale-105 sm:hover:scale-110 hover:shadow-2xl border-0 bg-gradient-to-br ${feature.gradient} ${feature.hoverGradient} text-white overflow-hidden h-40 sm:h-44 lg:h-48 rounded-2xl sm:rounded-3xl relative group`}
                onClick={() => handleFeatureClick(feature.label, featureType)}
              >
                {/* Card Glow Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                <CardContent className="p-4 sm:p-6 lg:p-8 text-center h-full flex flex-col justify-center relative z-10">
                  <div className="flex justify-center mb-3 sm:mb-4 lg:mb-6">
                    <div className="bg-white/25 p-3 sm:p-4 lg:p-6 rounded-full backdrop-blur-sm shadow-lg border-2 border-white/30 group-hover:scale-110 transition-transform duration-300">
                      <IconComponent className="h-8 w-8 sm:h-10 sm:w-10 lg:h-14 lg:w-14" />
                    </div>
                  </div>
                  <h3 className="text-xs sm:text-sm lg:text-base font-bold text-balance leading-tight group-hover:scale-105 transition-transform duration-300 px-1">{feature.label}</h3>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Footer */}
        <div className="text-center mt-12 sm:mt-16">
          <div className="bg-gradient-to-r from-green-50 via-emerald-50 to-amber-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 max-w-2xl mx-auto border-2 border-green-200/30 shadow-lg">
            <p className="text-base sm:text-lg font-semibold text-green-700 flex items-center justify-center gap-1 sm:gap-2 flex-wrap">
              <span className="text-xl">🌱</span>
              {getButtonTexts().madeWith}
              <span className="text-lg sm:text-xl">👨‍🌾</span>
            </p>
            <p className="text-sm sm:text-base font-medium text-green-600 mt-2 text-center">
              {language !== 'english' ? getButtonTexts().forFarmers : ''}
            </p>
          </div>
        </div>
      </main>

      {/* Floating Chat Button */}
      <Button
        className="fixed bottom-6 right-6 z-50 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white shadow-xl rounded-full p-4 transition-all duration-300 hover:scale-110 animate-bounce"
        onClick={handleChatOpen}
      >
        <Bot className="h-6 w-6" />
      </Button>
    </div>
  )
}
