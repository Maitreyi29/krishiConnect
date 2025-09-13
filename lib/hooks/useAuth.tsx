"use client"

import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { apiClient } from '../api';

interface User {
  id: string;
  name: string;
  mobile: string;
  language: string;
  location?: {
    state?: string;
    district?: string;
    coordinates?: {
      latitude: number;
      longitude: number;
    };
  };
  farmingDetails?: {
    landSize?: number;
    cropTypes?: string[];
    farmingExperience?: number;
  };
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (name: string, mobile: string) => Promise<boolean>;
  voiceLogin: (audioData: any, name: string) => Promise<boolean>;
  logout: () => void;
  updateProfile: (profileData: Partial<User>) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing user session on mount
    const checkAuthStatus = async () => {
      try {
        const token = localStorage.getItem('krishiconnect_token');
        const savedUser = localStorage.getItem('krishiconnect_user');
        
        if (token && savedUser) {
          const userData = JSON.parse(savedUser);
          setUser(userData);
        }
      } catch (error) {
        console.error('Error checking auth status:', error);
        // Clear invalid data
        localStorage.removeItem('krishiconnect_token');
        localStorage.removeItem('krishiconnect_user');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  const login = async (name: string, mobile: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      const response = await apiClient.login(name, mobile);
      
      if (response.success && response.user) {
        setUser(response.user);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const voiceLogin = async (audioData: any, name: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      const response = await apiClient.voiceLogin(audioData, name);
      
      if (response.success && response.user) {
        setUser(response.user);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Voice login error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    apiClient.logout();
    setUser(null);
  };

  const updateProfile = async (profileData: Partial<User>): Promise<boolean> => {
    try {
      const response = await apiClient.updateProfile(profileData);
      
      if (response.success && response.user) {
        setUser(response.user);
        localStorage.setItem('krishiconnect_user', JSON.stringify(response.user));
        return true;
      }
      return false;
    } catch (error) {
      console.error('Profile update error:', error);
      return false;
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    voiceLogin,
    logout,
    updateProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
