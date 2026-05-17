import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      deviceFingerprint: null,
      sessionToken: null,
      licenseStatus: 'trial',

      login: async (credentials) => {
        set({ isLoading: true })
        try {
          // Simulate API call - replace with real auth
          await new Promise(r => setTimeout(r, 1500))

          const mockUser = {
            id: 'usr_' + Math.random().toString(36).substr(2, 9),
            email: credentials.email,
            name: credentials.email.split('@')[0],
            avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${credentials.email}`,
            role: 'admin',
            plan: 'enterprise',
            createdAt: new Date().toISOString(),
            lastLogin: new Date().toISOString(),
            preferences: {
              theme: 'dark',
              language: 'en',
              currency: 'USD',
              timezone: 'UTC',
            }
          }

          set({
            user: mockUser,
            isAuthenticated: true,
            isLoading: false,
            sessionToken: 'tok_' + Math.random().toString(36).substr(2, 16),
            licenseStatus: 'active'
          })

          return { success: true }
        } catch (error) {
          set({ isLoading: false })
          return { success: false, error: error.message }
        }
      },

      googleLogin: async () => {
        set({ isLoading: true })
        await new Promise(r => setTimeout(r, 2000))

        const mockUser = {
          id: 'usr_google_' + Math.random().toString(36).substr(2, 9),
          email: 'user@gmail.com',
          name: 'Google User',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=google',
          role: 'admin',
          plan: 'enterprise',
          createdAt: new Date().toISOString(),
          lastLogin: new Date().toISOString(),
        }

        set({
          user: mockUser,
          isAuthenticated: true,
          isLoading: false,
          sessionToken: 'tok_google_' + Math.random().toString(36).substr(2, 16),
          licenseStatus: 'active'
        })

        return { success: true }
      },

      logout: () => {
        set({
          user: null,
          isAuthenticated: false,
          sessionToken: null,
        })
      },

      refreshSession: async () => {
        // Token refresh logic
        const { sessionToken } = get()
        if (sessionToken) {
          set({
            sessionToken: 'tok_refreshed_' + Math.random().toString(36).substr(2, 16)
          })
        }
      },

      updateUser: (updates) => {
        set(state => ({
          user: state.user ? { ...state.user, ...updates } : null
        }))
      },
    }),
    {
      name: 'finanalytics-auth',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        sessionToken: state.sessionToken,
        licenseStatus: state.licenseStatus,
      }),
    }
  )
)
