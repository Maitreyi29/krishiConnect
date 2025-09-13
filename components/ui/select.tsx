import React, { useState, useContext, createContext, useEffect, useRef } from "react"

interface SelectContextType {
  value: string
  onValueChange: (value: string) => void
  isOpen: boolean
  setIsOpen: (open: boolean) => void
}

const SelectContext = createContext<SelectContextType | null>(null)

export function Select({ value, onValueChange, children, className = "" }: any) {
  const [isOpen, setIsOpen] = useState(false)
  const selectRef = useRef<HTMLDivElement>(null)
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])
  
  return (
    <SelectContext.Provider value={{ value, onValueChange, isOpen, setIsOpen }}>
      <div ref={selectRef} className={`relative inline-block ${className}`}>{children}</div>
    </SelectContext.Provider>
  )
}

export function SelectTrigger({ children, className = "", ...props }: any) {
  const context = useContext(SelectContext)
  const base =
    "inline-flex w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-base shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring cursor-pointer"
  
  return (
    <button 
      className={`${base} ${className}`} 
      onClick={() => context?.setIsOpen(!context.isOpen)}
      {...props}
    >
      {children}
    </button>
  )
}

export function SelectValue({ placeholder }: { placeholder?: string }) {
  const context = useContext(SelectContext)
  
  const getDisplayValue = () => {
    if (!context?.value) return placeholder || "Select..."
    
    const languageMap: { [key: string]: string } = {
      "english": "🇬🇧 English",
      "hindi": "🇮🇳 हिंदी",
      "tamil": "🇮🇳 தமிழ்",
      "bengali": "🇮🇳 বাংলা",
      "marathi": "🇮🇳 मराठी",
      "gujarati": "🇮🇳 ગુજરાતી",
      "punjabi": "🇮🇳 ਪੰਜਾਬੀ",
      "kannada": "🇮🇳 ಕನ್ನಡ",
      "telugu": "🇮🇳 తెలుగు",
      "bhojpuri": "🇮🇳 भोजपुरी",
      "odia": "🇮🇳 ଓଡ଼ିଆ"
    }
    
    return languageMap[context.value] || "🇬🇧 English"
  }
  
  return <span>{getDisplayValue()}</span>
}

export function SelectContent({ children, className = "" }: any) {
  const context = useContext(SelectContext)
  
  if (!context?.isOpen) return null
  
  return (
    <div className={`absolute z-50 mt-2 min-w-[12rem] rounded-md border border-border bg-popover p-2 shadow-lg ${className}`}>
      {children}
    </div>
  )
}

export function SelectItem({ value, children, className = "", onSelect, ...props }: any) {
  const context = useContext(SelectContext)
  
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (context?.onValueChange) {
      context.onValueChange(value)
    }
    context?.setIsOpen(false)
    
    if (onSelect) {
      onSelect(value)
    }
  }
  
  return (
    <div 
      className={`cursor-pointer rounded-sm px-3 py-2 text-base hover:bg-muted transition-colors duration-200 ${className}`} 
      onClick={handleClick}
      {...props}
    >
      {children}
    </div>
  )
}