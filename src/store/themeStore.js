import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useThemeStore = create(
  persist(
    (set, get) => ({
      theme: 'dark',
      accentColor: 'cyan',
      glassIntensity: 'medium',
      animationsEnabled: true,
      reducedMotion: false,

      initTheme: () => {
        const saved = localStorage.getItem('finanalytics-theme')
        if (saved) {
          const parsed = JSON.parse(saved)
          set(parsed)
        }

        // Apply theme to document
        const { theme } = get()
        if (theme === 'dark') {
          document.documentElement.classList.add('dark')
        } else {
          document.documentElement.classList.remove('dark')
        }
      },

      setTheme: (theme) => {
        set({ theme })
        if (theme === 'dark') {
          document.documentElement.classList.add('dark')
        } else {
          document.documentElement.classList.remove('dark')
        }
      },

      setAccentColor: (color) => set({ accentColor: color }),
      toggleAnimations: () => set(state => ({ animationsEnabled: !state.animationsEnabled })),
      toggleReducedMotion: () => set(state => ({ reducedMotion: !state.reducedMotion })),
    }),
    {
      name: 'finanalytics-theme',
    }
  )
)
