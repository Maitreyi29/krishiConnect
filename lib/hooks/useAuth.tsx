"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { apiClient } from '../api';

interface User {
  id: string;
  email?: string;
  name?: string;
  mobile?: string;
  language?: string;
  location?: any;
  farmingDetails?: any;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (userData: any) => Promise<boolean>;
  logout: () => Promise<void>;
  updateProfile: (updates: any) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      if (typeof window !== 'undefined') {
        const savedUser = localStorage.getItem('krishiconnect_user');
        const token = localStorage.getItem('krishiconnect_token');
        
        if (savedUser && token) {
          setUser(JSON.parse(savedUser));
        }
      }
    } catch (error) {
      console.error('Error checking user:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      const result = await apiClient.login(email, password);
      
      if (result.success && result.user) {
        setUser(result.user);
        if (typeof window !== 'undefined') {
          localStorage.setItem('krishiconnect_user', JSON.stringify(result.user));
          localStorage.setItem('krishiconnect_token', result.token);
        }
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

  const register = async (userData: any): Promise<boolean> => {
    try {
      setIsLoading(true);
      const result = await apiClient.register(userData);
      
      if (result.success && result.user) {
        setUser(result.user);
        if (typeof window !== 'undefined') {
          localStorage.setItem('krishiconnect_user', JSON.stringify(result.user));
          localStorage.setItem('krishiconnect_token', result.token);
        }
        return true;
      }
      return false;
    } catch (error) {
      console.error('Registration error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      apiClient.logout();
      setUser(null);
      if (typeof window !== 'undefined') {
        localStorage.removeItem('krishiconnect_user');
        localStorage.removeItem('krishiconnect_token');
      }
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const updateProfile = async (updates: any): Promise<boolean> => {
    try {
      const result = await apiClient.updateProfile(updates);
      if (result.success && result.user) {
        setUser(result.user);
        if (typeof window !== 'undefined') {
          localStorage.setItem('krishiconnect_user', JSON.stringify(result.user));
        }
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
    register,
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
