"use client"

import React, { useState, useRef, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card } from './ui/card';
import { Send, Mic, MicOff, Volume2, VolumeX, Bot, User, ThumbsUp, ThumbsDown, Copy, Loader2 } from 'lucide-react';
import { useAuth } from '../lib/hooks/useAuth';
import { apiClient } from '../lib/api';
import voiceService from '../lib/voiceService';

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  cached?: boolean;
  suggestions?: string[];
}

interface ChatContext {
  type?: 'weather' | 'crop' | 'pest' | 'market' | 'schemes' | 'soil' | 'general'
  data?: any
  location?: string
}

interface ChatInterfaceProps {
  context?: ChatContext;
}

export default function ChatInterface({ context }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [language, setLanguage] = useState('english');
  const [weatherData, setWeatherData] = useState<any>(null);
  const [selectedCity, setSelectedCity] = useState<string>('');
  const [showCitySelector, setShowCitySelector] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Load chat history on component mount
    loadChatHistory();
    
    // Handle different context types
    if (context?.type === 'weather') {
      handleWeatherContext();
    } else {
      // Add general welcome message
      const welcomeMessage: Message = {
        id: 'welcome',
        type: 'ai',
        content: getContextualWelcomeMessage(),
        timestamp: new Date(),
        suggestions: getContextualSuggestions()
      };
      
      setMessages([welcomeMessage]);
    }
  }, [context]);

  const handleWeatherContext = async () => {
    setIsLoading(true);
    
    try {
      let currentWeatherData = context?.data;
      
      // If no weather data provided, fetch it
      if (!currentWeatherData && context?.location) {
        const weatherResponse = await apiClient.getCurrentWeather(context.location);
        if (weatherResponse.success) {
          currentWeatherData = weatherResponse.data;
        }
      }
      
      setWeatherData(currentWeatherData);
      
      // Create weather-specific welcome message with current conditions
      const weatherMessage: Message = {
        id: 'weather-welcome',
        type: 'ai',
        content: generateWeatherWelcomeMessage(currentWeatherData, context?.location),
        timestamp: new Date(),
        suggestions: [
          "Should I water my crops today?",
          "What crops are best for this weather?",
          "Any weather alerts for farming?",
          "Show me 5-day forecast"
        ]
      };
      
      setMessages([weatherMessage]);
    } catch (error) {
      console.error('Weather context error:', error);
      
      const errorMessage: Message = {
        id: 'weather-error',
        type: 'ai',
        content: `I'm having trouble fetching weather data for ${context?.location || 'your location'}. But I can still help you with weather-related farming questions!`,
        timestamp: new Date(),
        suggestions: [
          "General weather advice for farming",
          "Best practices for different seasons",
          "Crop protection tips"
        ]
      };
      
      setMessages([errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const generateWeatherWelcomeMessage = (weatherData: any, location?: string) => {
    if (!weatherData) {
      return `Hello! I'm AnnData, your AI farming assistant. I can help you with weather-related farming advice for ${location || 'your area'}. What would you like to know?`;
    }

    const { current, location: weatherLocation } = weatherData;
    
    // Handle the actual API response structure
    const locationName = weatherLocation?.name || location || 'your area';
    const temperature = current?.temperature?.current || 'N/A';
    const feelsLike = current?.temperature?.feels_like || 'N/A';
    const condition = current?.weather?.description || current?.weather?.main || 'N/A';
    const humidity = current?.humidity || 'N/A';
    const windSpeed = current?.wind?.speed || 'N/A';
    
    return `🌤️ Current Weather in ${locationName}

Temperature: ${temperature}°C
Condition: ${condition}
Humidity: ${humidity}%
Wind: ${windSpeed} m/s
Feels like: ${feelsLike}°C

Based on these conditions, I can provide farming advice! What would you like to know about farming in this weather?`;
  };

  const getContextualWelcomeMessage = () => {
    switch (context?.type) {
      case 'crop':
        return "Hello! I'm AnnData, your AI farming assistant. I can help you with crop advice, planting schedules, varieties, and growing tips. What crop would you like to know about?";
      case 'pest':
        return "Hello! I'm AnnData, your AI farming assistant. I can help you identify pests, suggest organic control methods, and provide prevention strategies. What pest issue are you facing?";
      case 'market':
        return "Hello! I'm AnnData, your AI farming assistant. I can help you with market prices, trends, and selling strategies. What market information do you need?";
      case 'schemes':
        return "Hello! I'm AnnData, your AI farming assistant. I can help you find government schemes, subsidies, and support programs for farmers. What type of assistance are you looking for?";
      case 'soil':
        return "Hello! I'm AnnData, your AI farming assistant. I can help you with soil health, testing, fertilizers, and soil management. What soil-related question do you have?";
      default:
        return "Hello! I'm AnnData, your AI farming assistant. I can help you with crop advice, pest control, weather information, market prices, and government schemes. What would you like to know about farming today?";
    }
  };

  const getContextualSuggestions = () => {
    switch (context?.type) {
      case 'crop':
        return [
          "Best crops for this season",
          "Crop rotation advice",
          "High-yield varieties",
          "Organic farming tips"
        ];
      case 'pest':
        return [
          "Identify pest by symptoms",
          "Organic pest control methods",
          "Preventive measures",
          "Beneficial insects"
        ];
      case 'market':
        return [
          "Current market prices",
          "Price trends analysis",
          "Best selling strategies",
          "Market demand forecast"
        ];
      case 'schemes':
        return [
          "PM-KISAN scheme details",
          "Crop insurance options",
          "Subsidy programs",
          "Loan schemes for farmers"
        ];
      case 'soil':
        return [
          "Soil testing importance",
          "Organic fertilizers",
          "Soil pH management",
          "Composting techniques"
        ];
      default:
        return [
          "Best crops for this season",
          "How to control pests organically?",
          "Current market prices",
          "Government farming schemes"
        ];
    }
  };

  const loadChatHistory = async () => {
    if (!user?.id) return;
    
    try {
      const response = await apiClient.getChatHistory(user.id, 10);
      if (response.success && response.data) {
        const historyMessages: Message[] = response.data.map((msg: any) => [
          {
            id: `${msg._id}-user`,
            type: 'user' as const,
            content: msg.message,
            timestamp: new Date(msg.createdAt)
          },
          {
            id: `${msg._id}-ai`,
            type: 'ai' as const,
            content: msg.response,
            timestamp: new Date(msg.createdAt),
            cached: msg.cached
          }
        ]).flat();
        
        setMessages(prev => [...historyMessages, ...prev]);
      }
    } catch (error) {
      console.error('Failed to load chat history:', error);
    }
  };

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      // Prepare enhanced user context with weather data
      const userContext = {
        location: context?.location || user?.location,
        language,
        farmingDetails: user?.farmingDetails,
        contextType: context?.type,
        weatherData: weatherData,
        currentWeather: weatherData?.current
      };

      // For weather-related queries, enhance the message with weather context
      let enhancedMessage = inputMessage.trim();
      if (context?.type === 'weather' && weatherData) {
        enhancedMessage = `Weather Context: ${weatherData.location?.name}, ${weatherData.current?.temp_c}°C, ${weatherData.current?.condition?.text}, ${weatherData.current?.humidity}% humidity. 

User Question: ${inputMessage.trim()}`;
      }

      const response = await apiClient.askAnnData(
        enhancedMessage,
        language,
        user?.id,
        userContext
      );

      if (response.success && response.data) {
        const aiMessage: Message = {
          id: response.data.id || Date.now().toString(),
          type: 'ai',
          content: response.data.response,
          timestamp: new Date(response.data.timestamp),
          cached: response.data.cached,
          suggestions: response.data.suggestions || getContextualSuggestions()
        };

        setMessages(prev => [...prev, aiMessage]);
        
        // Automatically speak AI response if voice is enabled
        if (voiceEnabled) {
          speakMessage(response.data.response);
        }
      } else {
        throw new Error(response.message || 'Failed to get AI response');
      }
    } catch (error) {
      console.error('Chat error:', error);
      
      const errorMessage: Message = {
        id: Date.now().toString(),
        type: 'ai',
        content: "I'm sorry, I'm having trouble processing your request right now. Please try again later.",
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputMessage(suggestion);
  };

  const handleFeedback = async (messageId: string, helpful: boolean) => {
    try {
      await apiClient.submitFeedback(messageId, helpful);
    } catch (error) {
      console.error('Failed to submit feedback:', error);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleCityChange = async (newCity: string) => {
    if (!newCity.trim()) return;
    
    setSelectedCity(newCity);
    setIsLoading(true);
    
    try {
      const weatherResponse = await apiClient.getCurrentWeather(newCity);
      
      if (weatherResponse.success) {
        setWeatherData(weatherResponse.data);
        
        const weatherUpdateMessage: Message = {
          id: `weather-update-${Date.now()}`,
          type: 'ai',
          content: generateWeatherWelcomeMessage(weatherResponse.data, newCity),
          timestamp: new Date(),
          suggestions: [
            "Should I water my crops today?",
            "What crops are best for this weather?",
            "Any weather alerts for farming?",
            "Show me 5-day forecast"
          ]
        };
        
        setMessages(prev => [...prev, weatherUpdateMessage]);
      } else {
        const errorMessage: Message = {
          id: `weather-error-${Date.now()}`,
          type: 'ai',
          content: `Sorry, I couldn't fetch weather data for ${newCity}. Please try another city name.`,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, errorMessage]);
      }
    } catch (error) {
      console.error('City weather fetch error:', error);
    } finally {
      setIsLoading(false);
      setShowCitySelector(false);
    }
  };

  const startVoiceInput = async () => {
    if (!voiceService.isSpeechRecognitionSupported()) {
      alert('Speech recognition is not supported in your browser');
      return;
    }

    try {
      setIsListening(true);
      const transcript = await voiceService.speechToText(language);
      setInputMessage(transcript);
    } catch (error) {
      console.error('Voice input error:', error);
      alert('Voice input failed. Please try again.');
    } finally {
      setIsListening(false);
    }
  };

  const stopVoiceInput = () => {
    voiceService.stopListening();
    setIsListening(false);
  };

  const speakMessage = async (text: string) => {
    if (!voiceEnabled) return;
    
    try {
      setIsSpeaking(true);
      await voiceService.textToSpeech(text, language);
    } catch (error) {
      console.error('Text-to-speech error:', error);
    } finally {
      setIsSpeaking(false);
    }
  };

  const toggleVoiceOutput = () => {
    setVoiceEnabled(!voiceEnabled);
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-t-lg">
        <div className="flex items-center gap-2">
          <Bot className="w-6 h-6" />
          <div>
            <h3 className="font-semibold">AnnData AI Assistant</h3>
            <p className="text-sm opacity-90">
              {context?.type === 'weather' ? `Weather & Farming Advice${selectedCity ? ` - ${selectedCity}` : context?.location ? ` - ${context.location}` : ''}` : 
               context?.type ? `${context.type.charAt(0).toUpperCase() + context.type.slice(1)} Assistant` : 
               'Your farming companion'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {context?.type === 'weather' && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowCitySelector(!showCitySelector)}
              className="text-white hover:bg-white/20 border-white/30"
            >
              📍 Change City
            </Button>
          )}
          <select 
            value={language} 
            onChange={(e) => setLanguage(e.target.value)}
            className="px-2 py-1 rounded text-black text-sm"
          >
            <option value="english">English</option>
            <option value="hindi">हिंदी</option>
          </select>
        </div>
      </div>

      {/* City Selector */}
      {showCitySelector && context?.type === 'weather' && (
        <div className="p-4 bg-blue-50 border-b">
          <div className="flex gap-2 items-center">
            <Input
              placeholder="Enter city name (e.g., Mumbai, Delhi, Bangalore)"
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleCityChange(selectedCity)}
              className="flex-1"
            />
            <Button 
              onClick={() => handleCityChange(selectedCity)}
              disabled={!selectedCity.trim() || isLoading}
              size="sm"
            >
              Get Weather
            </Button>
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            {['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Kolkata', 'Hyderabad', 'Pune', 'Ahmedabad'].map(city => (
              <Button
                key={city}
                variant="outline"
                size="sm"
                onClick={() => handleCityChange(city)}
                className="text-xs"
              >
                {city}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] ${message.type === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-800'} rounded-lg p-3`}>
              <div className="flex items-start gap-2">
                {message.type === 'ai' && <Bot className="w-4 h-4 mt-1 flex-shrink-0" />}
                {message.type === 'user' && <User className="w-4 h-4 mt-1 flex-shrink-0" />}
                <div className="flex-1">
                  <div className="whitespace-pre-line leading-relaxed">
                    {message.content.split('\n').map((line, index) => {
                      // Handle different formatting patterns
                      if (line.startsWith('**') && line.endsWith('**')) {
                        // Bold headers
                        return (
                          <div key={index} className="font-bold text-base mb-3 border-b border-gray-300 pb-1">
                            {line.replace(/\*\*/g, '')}
                          </div>
                        );
                      } else if (line.startsWith('🌤️')) {
                        // Weather header
                        return (
                          <div key={index} className="font-bold text-lg mb-4 border-b-2 border-gray-400 pb-2">
                            {line}
                          </div>
                        );
                      } else if (line.includes(':') && (line.includes('Temperature') || line.includes('Condition') || line.includes('Humidity') || line.includes('Wind') || line.includes('Feels like'))) {
                        // Weather data lines
                        const [label, value] = line.split(':');
                        return (
                          <div key={index} className="flex justify-between py-2 border-b border-gray-200">
                            <span className="font-medium">{label.trim()}:</span>
                            <span className="font-semibold">{value?.trim()}</span>
                          </div>
                        );
                      } else if (line.startsWith('*') && line.includes('**')) {
                        // Advice sections with bold titles
                        const cleanLine = line.replace(/\*/g, '');
                        const [title, ...content] = cleanLine.split('**');
                        return (
                          <div key={index} className="mb-3">
                            <div className="font-bold mb-2 border-l-4 border-gray-400 pl-3">{title.trim()}</div>
                            {content.length > 0 && (
                              <div className="ml-4 leading-relaxed">{content.join('').trim()}</div>
                            )}
                          </div>
                        );
                      } else if (line.trim().startsWith('1.') || line.trim().startsWith('2.') || line.trim().startsWith('3.') || line.trim().startsWith('4.') || line.trim().startsWith('5.') || line.trim().startsWith('6.') || line.trim().startsWith('7.')) {
                        // Numbered lists
                        return (
                          <div key={index} className="mb-3 ml-2">
                            <div className="font-semibold mb-1">{line.split(':')[0]}:</div>
                            <div className="ml-4 leading-relaxed">{line.split(':').slice(1).join(':').trim()}</div>
                          </div>
                        );
                      } else if (line.trim().startsWith('•') || line.trim().startsWith('-') || line.trim().startsWith('*')) {
                        // Bullet points
                        return (
                          <div key={index} className="mb-2 ml-4 flex">
                            <span className="mr-2">•</span>
                            <span className="leading-relaxed">{line.replace(/^[•\-*]\s*/, '')}</span>
                          </div>
                        );
                      } else if (line.trim().length > 0) {
                        // Regular text lines
                        return (
                          <div key={index} className="mb-3 leading-relaxed text-justify">
                            {line}
                          </div>
                        );
                      }
                      return <div key={index} className="mb-2"></div>;
                    })}
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs opacity-70">
                      {message.timestamp.toLocaleTimeString()}
                      {message.cached && <span className="ml-1">(cached)</span>}
                    </span>
                    {message.type === 'ai' && (
                      <div className="flex gap-1">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => copyToClipboard(message.content)}
                          className="h-6 w-6 p-0"
                        >
                          <Copy className="w-3 h-3" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleFeedback(message.id, true)}
                          className="h-6 w-6 p-0"
                        >
                          <ThumbsUp className="w-3 h-3" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleFeedback(message.id, false)}
                          className="h-6 w-6 p-0"
                        >
                          <ThumbsDown className="w-3 h-3" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => speakMessage(message.content)}
                          className="h-6 w-6 p-0"
                        >
                          <Volume2 className="w-3 h-3" />
                        </Button>
                      </div>
                    )}
                  </div>
                  
                  {/* Suggestions */}
                  {message.suggestions && message.suggestions.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {message.suggestions.map((suggestion, index) => (
                        <Button
                          key={index}
                          variant="outline"
                          size="sm"
                          onClick={() => handleSuggestionClick(suggestion)}
                          className="text-xs"
                        >
                          {suggestion}
                        </Button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 rounded-lg p-3">
              <div className="flex items-center gap-2">
                <Bot className="w-4 h-4" />
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-sm">AnnData is thinking...</span>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t">
        <div className="flex gap-2">
          <Input
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={isListening ? "Listening... Speak now!" : "Ask me about farming, crops, weather, or anything agricultural..."}
            className={`flex-1 ${isListening ? 'border-red-500 bg-red-50' : ''}`}
            disabled={isLoading || isListening}
          />
          <Button onClick={sendMessage} disabled={isLoading || !inputMessage.trim() || isListening}>
            <Send className="w-4 h-4" />
          </Button>
          <Button 
            variant="outline" 
            onClick={isListening ? stopVoiceInput : startVoiceInput}
            disabled={isLoading}
            className={isListening ? 'bg-red-100 border-red-500' : ''}
          >
            {isListening ? <MicOff className="w-4 h-4 text-red-600" /> : <Mic className="w-4 h-4" />}
          </Button>
          <Button 
            variant="outline" 
            onClick={toggleVoiceOutput}
            className={voiceEnabled ? 'bg-green-100 border-green-500' : 'bg-gray-100'}
          >
            {voiceEnabled ? <Volume2 className="w-4 h-4 text-green-600" /> : <VolumeX className="w-4 h-4" />}
          </Button>
        </div>
        <div className="flex justify-between items-center mt-2">
          <p className="text-xs text-gray-500">
            {isListening ? "🎤 Listening... Click mic to stop" : 
             isSpeaking ? "🔊 Speaking..." :
             "Ask me anything about farming! Use voice input 🎤 or text input."}
          </p>
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <span className={`flex items-center gap-1 ${voiceEnabled ? 'text-green-600' : 'text-gray-400'}`}>
              {voiceEnabled ? <Volume2 className="w-3 h-3" /> : <VolumeX className="w-3 h-3" />}
              Voice {voiceEnabled ? 'On' : 'Off'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
