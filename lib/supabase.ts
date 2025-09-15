import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://tegpctsrpuanbtzgitek.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRlZ3BjdHNycHVhbmJ0emdpdGVrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc4NzA1MDQsImV4cCI6MjA3MzQ0NjUwNH0.WJCRMjH-WibbNwl43_-vTvQRMr493eQhVCuX7aTt8so'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Authentication service
export class SupabaseAuthService {
  // Sign up with email and password
  async signUp(email: string, password: string, userData: any) {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: userData.name,
            mobile: userData.mobile,
            language: userData.language || 'english',
            location: userData.location || {},
            farmingDetails: userData.farmingDetails || {}
          }
        }
      })

      if (error) throw error

      return {
        success: true,
        user: data.user,
        session: data.session,
        message: 'Registration successful'
      }
    } catch (error: any) {
      return {
        success: false,
        message: error.message || 'Registration failed'
      }
    }
  }

  // Sign in with email and password
  async signIn(email: string, password: string) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) throw error

      return {
        success: true,
        user: data.user,
        session: data.session,
        message: 'Login successful'
      }
    } catch (error: any) {
      return {
        success: false,
        message: error.message || 'Login failed'
      }
    }
  }

  // Sign out
  async signOut() {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error

      return {
        success: true,
        message: 'Logged out successfully'
      }
    } catch (error: any) {
      return {
        success: false,
        message: error.message || 'Logout failed'
      }
    }
  }

  // Get current user
  async getCurrentUser() {
    try {
      const { data: { user }, error } = await supabase.auth.getUser()
      if (error) throw error

      return {
        success: true,
        user
      }
    } catch (error: any) {
      return {
        success: false,
        message: error.message || 'Failed to get user'
      }
    }
  }

  // Get current session
  async getCurrentSession() {
    try {
      const { data: { session }, error } = await supabase.auth.getSession()
      if (error) throw error

      return {
        success: true,
        session
      }
    } catch (error: any) {
      return {
        success: false,
        message: error.message || 'Failed to get session'
      }
    }
  }

  // Listen to auth state changes
  onAuthStateChange(callback: (event: string, session: any) => void) {
    return supabase.auth.onAuthStateChange(callback)
  }

  // Update user profile
  async updateProfile(updates: any) {
    try {
      const { data, error } = await supabase.auth.updateUser({
        data: updates
      })

      if (error) throw error

      return {
        success: true,
        user: data.user,
        message: 'Profile updated successfully'
      }
    } catch (error: any) {
      return {
        success: false,
        message: error.message || 'Profile update failed'
      }
    }
  }
}

export const authService = new SupabaseAuthService()
