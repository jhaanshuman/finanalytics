import React, { useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuthStore } from '../store/authStore'
import { useAppStore } from '../store/appStore'
import {
  LayoutDashboard, Wallet, BarChart3, Settings, LogOut,
  ChevronLeft, ChevronRight, Sparkles, User, Bell,
  Grid3X3, FileText, Shield, HelpCircle, Zap, Search,
  Command
} from 'lucide-react'

const Sidebar = () => {
  const { user, logout } = useAuthStore()
  const { sidebarCollapsed, toggleSidebar, addNotification } = useAppStore()
  const location = useLocation()
  const [showUserMenu, setShowUserMenu] = useState(false)

  const navItems = [
    { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard', badge: null },
    { path: '/workspace', icon: Grid3X3, label: 'Workspace', badge: null },
    { path: '/transactions', icon: Wallet, label: 'Transactions', badge: '2.4k' },
    { path: '/analytics', icon: BarChart3, label: 'Analytics', badge: 'NEW' },
    { path: '/reports', icon: FileText, label: 'Reports', badge: null },
  ]

  const bottomItems = [
    { path: '/settings', icon: Settings, label: 'Settings' },
    { path: '/about', icon: HelpCircle, label: 'About' },
  ]

  const handleLogout = () => {
    addNotification({ type: 'info', title: 'Logged out', message: 'See you soon!' })
    logout()
  }

  return (
    <motion.aside
      className="h-screen flex flex-col bg-fin-panel/80 backdrop-blur-xl border-r border-white/5 relative z-40"
      initial={false}
      animate={{ width: sidebarCollapsed ? 72 : 260 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
    >
      {/* Logo */}
      <div className="h-16 flex items-center px-4 border-b border-white/5">
        <motion.div
          className="w-10 h-10 rounded-xl bg-gradient-to-br from-fin-accent to-fin-purple flex items-center justify-center flex-shrink-0"
          whileHover={{ scale: 1.1, rotate: 5 }}
        >
          <span className="text-xl font-bold text-white">F</span>
        </motion.div>

        <AnimatePresence>
          {!sidebarCollapsed && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="ml-3 overflow-hidden"
            >
              <h1 className="text-lg font-bold text-white whitespace-nowrap">FinAnalytics</h1>
              <p className="text-xs text-white/30 whitespace-nowrap">v1.0.0 Enterprise</p>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          onClick={toggleSidebar}
          className="ml-auto p-1.5 rounded-lg bg-white/5 text-white/40 hover:text-white/70 hover:bg-white/10 transition-all"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          {sidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </motion.button>
      </div>

      {/* Search */}
      {!sidebarCollapsed && (
        <div className="px-4 py-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
            <input
              type="text"
              placeholder="Search... (⌘K)"
              className="w-full pl-9 pr-4 py-2 bg-white/5 border border-white/5 rounded-lg text-sm text-white/70 placeholder-white/30 focus:outline-none focus:border-fin-accent/30 focus:ring-1 focus:ring-fin-accent/10 transition-all"
            />
            <Command className="absolute right-3 top-1/2 -translate-y-1/2 w-3 h-3 text-white/20" />
          </div>
        </div>
      )}

      {/* Main Nav */}
      <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto fin-scrollbar">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group relative ${
                isActive
                  ? 'bg-fin-accent/10 text-fin-accent border border-fin-accent/20'
                  : 'text-white/50 hover:text-white/80 hover:bg-white/5'
              }`
            }
          >
            <motion.div whileHover={{ scale: 1.2, rotate: 5 }}>
              <item.icon className="w-5 h-5 flex-shrink-0" />
            </motion.div>

            <AnimatePresence>
              {!sidebarCollapsed && (
                <motion.span
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="text-sm font-medium whitespace-nowrap flex-1"
                >
                  {item.label}
                </motion.span>
              )}
            </AnimatePresence>

            {item.badge && !sidebarCollapsed && (
              <span className={`text-xs px-2 py-0.5 rounded-full ${
                item.badge === 'NEW' 
                  ? 'bg-fin-accent/20 text-fin-accent' 
                  : 'bg-white/10 text-white/50'
              }`}>
                {item.badge}
              </span>
            )}

            {location.pathname === item.path && (
              <motion.div
                layoutId="activeIndicator"
                className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-fin-accent rounded-r-full"
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              />
            )}
          </NavLink>
        ))}

        {/* AI Section */}
        <div className="mt-6 pt-4 border-t border-white/5">
          {!sidebarCollapsed && (
            <p className="px-3 text-xs font-semibold text-white/20 uppercase tracking-wider mb-2">
              AI Intelligence
            </p>
          )}
          <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-white/50 hover:text-fin-amber hover:bg-fin-amber/5 transition-all group">
            <motion.div whileHover={{ scale: 1.2 }}>
              <Sparkles className="w-5 h-5 text-fin-amber" />
            </motion.div>
            <AnimatePresence>
              {!sidebarCollapsed && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-sm font-medium whitespace-nowrap"
                >
                  AI Copilot
                </motion.span>
              )}
            </AnimatePresence>
          </button>
          <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-white/50 hover:text-fin-purple hover:bg-fin-purple/5 transition-all group">
            <motion.div whileHover={{ scale: 1.2 }}>
              <Zap className="w-5 h-5 text-fin-purple" />
            </motion.div>
            <AnimatePresence>
              {!sidebarCollapsed && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-sm font-medium whitespace-nowrap"
                >
                  Predictions
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </div>
      </nav>

      {/* Bottom */}
      <div className="p-2 border-t border-white/5 space-y-1">
        {bottomItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-lg transition-all ${
                isActive
                  ? 'bg-white/10 text-white'
                  : 'text-white/40 hover:text-white/70 hover:bg-white/5'
              }`
            }
          >
            <item.icon className="w-5 h-5 flex-shrink-0" />
            <AnimatePresence>
              {!sidebarCollapsed && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-sm whitespace-nowrap"
                >
                  {item.label}
                </motion.span>
              )}
            </AnimatePresence>
          </NavLink>
        ))}

        {/* User Profile */}
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/5 transition-all"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-fin-accent to-fin-purple flex items-center justify-center flex-shrink-0">
              <span className="text-sm font-bold text-white">{user?.name?.[0]?.toUpperCase() || 'A'}</span>
            </div>
            <AnimatePresence>
              {!sidebarCollapsed && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex-1 text-left overflow-hidden"
                >
                  <p className="text-sm font-medium text-white truncate">{user?.name || 'Anshuman Jha'}</p>
                  <p className="text-xs text-white/40 truncate">{user?.email || 'anshuman@finanalytics.ai'}</p>
                </motion.div>
              )}
            </AnimatePresence>
            {!sidebarCollapsed && <ChevronRight className="w-4 h-4 text-white/30" />}
          </button>

          <AnimatePresence>
            {showUserMenu && !sidebarCollapsed && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute bottom-full left-0 right-0 mb-2 p-2 bg-fin-panel border border-white/10 rounded-xl shadow-2xl"
              >
                <div className="space-y-1">
                  <button className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-white/70 hover:bg-white/5 hover:text-white transition-all">
                    <User className="w-4 h-4" /> Profile
                  </button>
                  <button className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-white/70 hover:bg-white/5 hover:text-white transition-all">
                    <Bell className="w-4 h-4" /> Notifications
                  </button>
                  <button className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-white/70 hover:bg-white/5 hover:text-white transition-all">
                    <Shield className="w-4 h-4" /> Security
                  </button>
                  <div className="border-t border-white/5 my-1" />
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-fin-rose hover:bg-fin-rose/10 transition-all"
                  >
                    <LogOut className="w-4 h-4" /> Sign Out
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.aside>
  )
}

export default Sidebar
