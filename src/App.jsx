import React, { useState, useEffect, Suspense, lazy } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Toaster } from 'react-hot-toast'
import { useAuthStore } from './store/authStore'
import { useThemeStore } from './store/themeStore'
import { useAppStore } from './store/appStore'

// Eagerly loaded core components
import LoadingScreen from './components/LoadingScreen'
import AuthGuard from './components/auth/AuthGuard'
import FloatingAI from './components/ai/FloatingAI'

// Lazy loaded pages for performance
const LoginPage = lazy(() => import('./components/auth/LoginPage'))
const Dashboard = lazy(() => import('./components/dashboard/Dashboard'))
const Workspace = lazy(() => import('./components/workspace/Workspace'))
const Transactions = lazy(() => import('./components/transactions/Transactions'))
const Analytics = lazy(() => import('./components/charts/Analytics'))
const Reports = lazy(() => import('./components/reports/Reports'))
const Settings = lazy(() => import('./components/Settings'))
const About = lazy(() => import('./components/About'))

function App() {
  const { isAuthenticated, isLoading } = useAuthStore()
  const { theme, initTheme } = useThemeStore()
  const { isAppReady, setAppReady } = useAppStore()
  const [showLoading, setShowLoading] = useState(true)

  useEffect(() => {
    initTheme()
    const timer = setTimeout(() => {
      setShowLoading(false)
      setAppReady(true)
    }, 3000)
    return () => clearTimeout(timer)
  }, [])

  if (showLoading || isLoading) {
    return <LoadingScreen />
  }

  return (
    <div className={`relative w-screen h-screen overflow-hidden ${theme === 'dark' ? 'dark' : ''}`}>
      <div className="absolute inset-0 fin-grid-bg opacity-30 pointer-events-none" />

      {/* Animated background orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-fin-accent/5 rounded-full blur-3xl animate-float-glow" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-fin-purple/5 rounded-full blur-3xl animate-float-glow" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-fin-rose/5 rounded-full blur-3xl animate-float-glow" style={{ animationDelay: '4s' }} />
      </div>

      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: 'rgba(17, 17, 24, 0.95)',
            color: '#fff',
            border: '1px solid rgba(255,255,255,0.1)',
            backdropFilter: 'blur(12px)',
          },
        }}
      />

      <AnimatePresence mode="wait">
        <Suspense fallback={<LoadingScreen mini />}>
          <Routes>
            <Route 
              path="/login" 
              element={!isAuthenticated ? <LoginPage /> : <Navigate to="/dashboard" />} 
            />
            <Route 
              path="/dashboard" 
              element={
                <AuthGuard>
                  <Dashboard />
                </AuthGuard>
              } 
            />
            <Route 
              path="/workspace" 
              element={
                <AuthGuard>
                  <Workspace />
                </AuthGuard>
              } 
            />
            <Route 
              path="/transactions" 
              element={
                <AuthGuard>
                  <Transactions />
                </AuthGuard>
              } 
            />
            <Route 
              path="/analytics" 
              element={
                <AuthGuard>
                  <Analytics />
                </AuthGuard>
              } 
            />
            <Route 
              path="/settings" 
              element={
                <AuthGuard>
                  <Settings />
                </AuthGuard>
              } 
            />
            <Route path="/reports" element={<AuthGuard><Reports /></AuthGuard>} />
            <Route 
              path="/about" 
              element={
                <AuthGuard>
                  <About />
                </AuthGuard>
              } 
            />
            <Route path="/" element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} />} />
          </Routes>
        </Suspense>
      </AnimatePresence>

      {isAuthenticated && <FloatingAI />}
    </div>
  )
}

export default App
