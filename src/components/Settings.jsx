import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Sidebar from './Sidebar'
import { useAuthStore } from '../store/authStore'
import { useThemeStore } from '../store/themeStore'
import { useAppStore } from '../store/appStore'
import {
  User, Shield, Palette, Bell, Database, Lock, Globe,
  CreditCard, FileText, HelpCircle, ChevronRight, Moon, Sun,
  Monitor, Fingerprint, Key, Eye, EyeOff, Save, Check,
  AlertTriangle, RefreshCw, Download, Upload, Trash2
} from 'lucide-react'

const Settings = () => {
  const { user, updateUser } = useAuthStore()
  const { theme, setTheme, accentColor, setAccentColor, animationsEnabled, toggleAnimations } = useThemeStore()
  const { sidebarCollapsed } = useAppStore()
  const [activeSection, setActiveSection] = useState('profile')
  const [showPassword, setShowPassword] = useState(false)
  const [savedMessage, setSavedMessage] = useState('')

  const handleSave = () => {
    setSavedMessage('Settings saved successfully')
    setTimeout(() => setSavedMessage(''), 3000)
  }

  const sections = [
    { id: 'profile', label: 'Profile', icon: User, description: 'Personal information and account details' },
    { id: 'security', label: 'Security', icon: Shield, description: 'Password, 2FA, and access controls' },
    { id: 'appearance', label: 'Appearance', icon: Palette, description: 'Themes, colors, and display preferences' },
    { id: 'notifications', label: 'Notifications', icon: Bell, description: 'Alerts, emails, and push settings' },
    { id: 'data', label: 'Data & Storage', icon: Database, description: 'Backup, export, and data management' },
    { id: 'billing', label: 'Billing', icon: CreditCard, description: 'Subscription and payment settings' },
  ]

  const accentColors = [
    { id: 'cyan', name: 'Cyan', color: '#00d4ff', class: 'bg-[#00d4ff]' },
    { id: 'purple', name: 'Purple', color: '#7c3aed', class: 'bg-[#7c3aed]' },
    { id: 'emerald', name: 'Emerald', color: '#10b981', class: 'bg-[#10b981]' },
    { id: 'rose', name: 'Rose', color: '#f43f5e', class: 'bg-[#f43f5e]' },
    { id: 'amber', name: 'Amber', color: '#f59e0b', class: 'bg-[#f59e0b]' },
    { id: 'blue', name: 'Blue', color: '#3b82f6', class: 'bg-[#3b82f6]' },
  ]

  return (
    <div className="flex h-screen bg-fin-dark overflow-hidden">
      <Sidebar />

      <main className={`flex-1 flex flex-col overflow-hidden ${sidebarCollapsed ? '' : ''}`}>
        {/* Header */}
        <header className="h-16 flex items-center justify-between px-6 border-b border-white/5 bg-fin-panel/50 backdrop-blur-xl">
          <h1 className="text-xl font-bold text-white">Settings</h1>

          <AnimatePresence>
            {savedMessage && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex items-center gap-2 px-4 py-2 bg-fin-emerald/10 border border-fin-emerald/20 rounded-lg"
              >
                <Check className="w-4 h-4 text-fin-emerald" />
                <span className="text-sm text-fin-emerald">{savedMessage}</span>
              </motion.div>
            )}
          </AnimatePresence>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSave}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-fin-accent/20 text-fin-accent hover:bg-fin-accent/30 text-sm font-medium transition-all border border-fin-accent/20"
          >
            <Save className="w-4 h-4" />
            Save Changes
          </motion.button>
        </header>

        <div className="flex-1 flex overflow-hidden">
          {/* Settings Sidebar */}
          <div className="w-72 border-r border-white/5 overflow-y-auto fin-scrollbar p-4">
            <div className="space-y-1">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full flex items-start gap-3 p-3 rounded-xl transition-all text-left ${
                    activeSection === section.id
                      ? 'bg-fin-accent/10 border border-fin-accent/20'
                      : 'hover:bg-white/5 border border-transparent'
                  }`}
                >
                  <div className={`p-2 rounded-lg ${
                    activeSection === section.id ? 'bg-fin-accent/20' : 'bg-white/5'
                  }`}>
                    <section.icon className={`w-5 h-5 ${
                      activeSection === section.id ? 'text-fin-accent' : 'text-white/40'
                    }`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className={`text-sm font-medium ${
                      activeSection === section.id ? 'text-white' : 'text-white/60'
                    }`}>
                      {section.label}
                    </h3>
                    <p className="text-xs text-white/30 mt-0.5 line-clamp-2">{section.description}</p>
                  </div>
                  <ChevronRight className={`w-4 h-4 flex-shrink-0 mt-1 ${
                    activeSection === section.id ? 'text-fin-accent' : 'text-white/20'
                  }`} />
                </button>
              ))}
            </div>

            <div className="mt-6 pt-6 border-t border-white/5">
              <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                <div className="flex items-center gap-2 mb-2">
                  <HelpCircle className="w-4 h-4 text-white/40" />
                  <span className="text-sm font-medium text-white/60">Need Help?</span>
                </div>
                <p className="text-xs text-white/30 mb-3">Contact support or browse documentation</p>
                <button className="w-full py-2 rounded-lg bg-white/5 text-xs text-white/50 hover:text-white/70 hover:bg-white/10 transition-all border border-white/5">
                  Open Documentation
                </button>
              </div>
            </div>
          </div>

          {/* Settings Content */}
          <div className="flex-1 overflow-y-auto fin-scrollbar p-6">
            <AnimatePresence mode="wait">
              {activeSection === 'profile' && (
                <motion.div
                  key="profile"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="max-w-2xl space-y-6"
                >
                  <div>
                    <h2 className="text-lg font-semibold text-white mb-1">Profile Information</h2>
                    <p className="text-sm text-white/40">Manage your personal details and public profile</p>
                  </div>

                  <div className="fin-card">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-fin-accent to-fin-purple flex items-center justify-center">
                        <span className="text-3xl font-bold text-white">{user?.name?.[0]?.toUpperCase() || 'A'}</span>
                      </div>
                      <div>
                        <h3 className="text-lg font-medium text-white">{user?.name || 'Anshuman Jha'}</h3>
                        <p className="text-sm text-white/40">{user?.email || 'anshuman@finanalytics.ai'}</p>
                        <span className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 bg-fin-emerald/10 text-fin-emerald text-xs rounded-full border border-fin-emerald/20">
                          <Check className="w-3 h-3" /> Verified
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm text-white/60 mb-1.5">Full Name</label>
                        <input 
                          type="text" 
                          defaultValue={user?.name || 'Anshuman Jha'}
                          className="fin-input"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-white/60 mb-1.5">Email</label>
                        <input 
                          type="email" 
                          defaultValue={user?.email || 'anshuman@finanalytics.ai'}
                          className="fin-input"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-white/60 mb-1.5">Phone</label>
                        <input 
                          type="tel" 
                          placeholder="+1 (555) 000-0000"
                          className="fin-input"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-white/60 mb-1.5">Timezone</label>
                        <select className="fin-input">
                          <option>UTC (Coordinated Universal Time)</option>
                          <option>EST (Eastern Standard Time)</option>
                          <option>PST (Pacific Standard Time)</option>
                          <option>IST (India Standard Time)</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="fin-card">
                    <h3 className="text-sm font-medium text-white mb-4">Preferences</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-white">Default Currency</p>
                          <p className="text-xs text-white/40">Primary currency for all calculations</p>
                        </div>
                        <select className="px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white">
                          <option>USD ($)</option>
                          <option>EUR (€)</option>
                          <option>GBP (£)</option>
                          <option>INR (₹)</option>
                          <option>JPY (¥)</option>
                        </select>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-white">Date Format</p>
                          <p className="text-xs text-white/40">How dates are displayed</p>
                        </div>
                        <select className="px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white">
                          <option>MM/DD/YYYY</option>
                          <option>DD/MM/YYYY</option>
                          <option>YYYY-MM-DD</option>
                        </select>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-white">Number Format</p>
                          <p className="text-xs text-white/40">Decimal and thousand separators</p>
                        </div>
                        <select className="px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white">
                          <option>1,234.56</option>
                          <option>1.234,56</option>
                          <option>1 234,56</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeSection === 'security' && (
                <motion.div
                  key="security"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="max-w-2xl space-y-6"
                >
                  <div>
                    <h2 className="text-lg font-semibold text-white mb-1">Security Settings</h2>
                    <p className="text-sm text-white/40">Protect your account with advanced security features</p>
                  </div>

                  <div className="fin-card">
                    <h3 className="text-sm font-medium text-white mb-4">Password</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm text-white/60 mb-1.5">Current Password</label>
                        <div className="relative">
                          <input 
                            type={showPassword ? 'text' : 'password'}
                            placeholder="••••••••"
                            className="fin-input pr-10"
                          />
                          <button 
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60"
                          >
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm text-white/60 mb-1.5">New Password</label>
                        <input type="password" placeholder="••••••••" className="fin-input" />
                      </div>
                      <div>
                        <label className="block text-sm text-white/60 mb-1.5">Confirm New Password</label>
                        <input type="password" placeholder="••••••••" className="fin-input" />
                      </div>
                    </div>
                  </div>

                  <div className="fin-card">
                    <h3 className="text-sm font-medium text-white mb-4">Two-Factor Authentication</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/5">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-fin-accent/10">
                            <Key className="w-4 h-4 text-fin-accent" />
                          </div>
                          <div>
                            <p className="text-sm text-white">Authenticator App</p>
                            <p className="text-xs text-white/40">Use Google Authenticator or Authy</p>
                          </div>
                        </div>
                        <button className="px-3 py-1.5 rounded-lg bg-fin-accent/20 text-fin-accent text-xs font-medium hover:bg-fin-accent/30 transition-all">
                          Enable
                        </button>
                      </div>
                      <div className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/5">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-fin-purple/10">
                            <Fingerprint className="w-4 h-4 text-fin-purple" />
                          </div>
                          <div>
                            <p className="text-sm text-white">Biometric Authentication</p>
                            <p className="text-xs text-white/40">Fingerprint or Face ID</p>
                          </div>
                        </div>
                        <span className="px-3 py-1.5 rounded-lg bg-fin-emerald/10 text-fin-emerald text-xs font-medium border border-fin-emerald/20">
                          Active
                        </span>
                      </div>
                      <div className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/5">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-fin-amber/10">
                            <Lock className="w-4 h-4 text-fin-amber" />
                          </div>
                          <div>
                            <p className="text-sm text-white">Device Fingerprinting</p>
                            <p className="text-xs text-white/40">Track and verify trusted devices</p>
                          </div>
                        </div>
                        <span className="px-3 py-1.5 rounded-lg bg-fin-emerald/10 text-fin-emerald text-xs font-medium border border-fin-emerald/20">
                          Active
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="fin-card border-fin-rose/20">
                    <h3 className="text-sm font-medium text-fin-rose mb-4 flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4" />
                      Danger Zone
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-white">Export All Data</p>
                          <p className="text-xs text-white/40">Download a complete backup of your data</p>
                        </div>
                        <button className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 text-white/50 hover:text-white/70 hover:bg-white/10 text-sm transition-all">
                          <Download className="w-4 h-4" /> Export
                        </button>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-white">Delete Account</p>
                          <p className="text-xs text-white/40">Permanently delete all your data</p>
                        </div>
                        <button className="flex items-center gap-2 px-3 py-2 rounded-lg bg-fin-rose/10 text-fin-rose hover:bg-fin-rose/20 text-sm transition-all">
                          <Trash2 className="w-4 h-4" /> Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeSection === 'appearance' && (
                <motion.div
                  key="appearance"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="max-w-2xl space-y-6"
                >
                  <div>
                    <h2 className="text-lg font-semibold text-white mb-1">Appearance</h2>
                    <p className="text-sm text-white/40">Customize how FinAnalytics looks and feels</p>
                  </div>

                  <div className="fin-card">
                    <h3 className="text-sm font-medium text-white mb-4">Theme</h3>
                    <div className="grid grid-cols-3 gap-3">
                      <button
                        onClick={() => setTheme('light')}
                        className={`p-4 rounded-xl border transition-all ${
                          theme === 'light' 
                            ? 'border-fin-accent bg-fin-accent/10' 
                            : 'border-white/10 bg-white/5 hover:border-white/20'
                        }`}
                      >
                        <Sun className={`w-6 h-6 mx-auto mb-2 ${theme === 'light' ? 'text-fin-accent' : 'text-white/40'}`} />
                        <p className={`text-sm font-medium ${theme === 'light' ? 'text-white' : 'text-white/60'}`}>Light</p>
                      </button>
                      <button
                        onClick={() => setTheme('dark')}
                        className={`p-4 rounded-xl border transition-all ${
                          theme === 'dark' 
                            ? 'border-fin-accent bg-fin-accent/10' 
                            : 'border-white/10 bg-white/5 hover:border-white/20'
                        }`}
                      >
                        <Moon className={`w-6 h-6 mx-auto mb-2 ${theme === 'dark' ? 'text-fin-accent' : 'text-white/40'}`} />
                        <p className={`text-sm font-medium ${theme === 'dark' ? 'text-white' : 'text-white/60'}`}>Dark</p>
                      </button>
                      <button
                        onClick={() => setTheme('system')}
                        className={`p-4 rounded-xl border transition-all ${
                          theme === 'system' 
                            ? 'border-fin-accent bg-fin-accent/10' 
                            : 'border-white/10 bg-white/5 hover:border-white/20'
                        }`}
                      >
                        <Monitor className={`w-6 h-6 mx-auto mb-2 ${theme === 'system' ? 'text-fin-accent' : 'text-white/40'}`} />
                        <p className={`text-sm font-medium ${theme === 'system' ? 'text-white' : 'text-white/60'}`}>System</p>
                      </button>
                    </div>
                  </div>

                  <div className="fin-card">
                    <h3 className="text-sm font-medium text-white mb-4">Accent Color</h3>
                    <div className="grid grid-cols-3 gap-3">
                      {accentColors.map((color) => (
                        <button
                          key={color.id}
                          onClick={() => setAccentColor(color.id)}
                          className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
                            accentColor === color.id 
                              ? 'border-white/20 bg-white/10' 
                              : 'border-white/5 bg-white/5 hover:border-white/10'
                          }`}
                        >
                          <div className={`w-6 h-6 rounded-full ${color.class}`} />
                          <span className="text-sm text-white/70">{color.name}</span>
                          {accentColor === color.id && (
                            <Check className="w-4 h-4 text-fin-accent ml-auto" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="fin-card">
                    <h3 className="text-sm font-medium text-white mb-4">Display Options</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-white">Animations</p>
                          <p className="text-xs text-white/40">Enable smooth transitions and effects</p>
                        </div>
                        <button
                          onClick={toggleAnimations}
                          className={`w-12 h-6 rounded-full transition-all relative ${
                            animationsEnabled ? 'bg-fin-accent' : 'bg-white/10'
                          }`}
                        >
                          <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${
                            animationsEnabled ? 'left-7' : 'left-1'
                          }`} />
                        </button>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-white">Compact Mode</p>
                          <p className="text-xs text-white/40">Reduce spacing and padding</p>
                        </div>
                        <button className="w-12 h-6 rounded-full bg-white/10 relative">
                          <div className="absolute top-1 left-1 w-4 h-4 rounded-full bg-white" />
                        </button>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-white">Glassmorphism Effects</p>
                          <p className="text-xs text-white/40">Enable frosted glass panels</p>
                        </div>
                        <button className="w-12 h-6 rounded-full bg-fin-accent relative">
                          <div className="absolute top-1 left-7 w-4 h-4 rounded-full bg-white" />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeSection === 'notifications' && (
                <motion.div
                  key="notifications"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="max-w-2xl space-y-6"
                >
                  <div>
                    <h2 className="text-lg font-semibold text-white mb-1">Notifications</h2>
                    <p className="text-sm text-white/40">Configure how and when you receive alerts</p>
                  </div>

                  {[
                    { title: 'Transaction Alerts', desc: 'Get notified for all transactions', enabled: true },
                    { title: 'Budget Warnings', desc: 'Alert when approaching budget limits', enabled: true },
                    { title: 'AI Insights', desc: 'Receive AI-generated recommendations', enabled: true },
                    { title: 'Security Alerts', desc: 'Unusual activity and login attempts', enabled: true },
                    { title: 'Bill Reminders', desc: 'Upcoming payment notifications', enabled: false },
                    { title: 'Goal Milestones', desc: 'Celebrate financial achievements', enabled: true },
                    { title: 'Market Updates', desc: 'Investment and market news', enabled: false },
                    { title: 'Weekly Summary', desc: 'Weekly financial digest email', enabled: true },
                  ].map((item, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="fin-card flex items-center justify-between"
                    >
                      <div>
                        <p className="text-sm text-white font-medium">{item.title}</p>
                        <p className="text-xs text-white/40">{item.desc}</p>
                      </div>
                      <button className={`w-12 h-6 rounded-full transition-all relative ${
                        item.enabled ? 'bg-fin-accent' : 'bg-white/10'
                      }`}>
                        <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${
                          item.enabled ? 'left-7' : 'left-1'
                        }`} />
                      </button>
                    </motion.div>
                  ))}
                </motion.div>
              )}

              {activeSection === 'data' && (
                <motion.div
                  key="data"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="max-w-2xl space-y-6"
                >
                  <div>
                    <h2 className="text-lg font-semibold text-white mb-1">Data & Storage</h2>
                    <p className="text-sm text-white/40">Manage your data, backups, and storage</p>
                  </div>

                  <div className="fin-card">
                    <h3 className="text-sm font-medium text-white mb-4">Storage Usage</h3>
                    <div className="space-y-4">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-white/60">Database</span>
                          <span className="text-sm text-white">245 MB / 1 GB</span>
                        </div>
                        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                          <div className="h-full bg-fin-accent rounded-full" style={{ width: '24.5%' }} />
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-white/60">Documents & Attachments</span>
                          <span className="text-sm text-white">1.2 GB / 5 GB</span>
                        </div>
                        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                          <div className="h-full bg-fin-purple rounded-full" style={{ width: '24%' }} />
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-white/60">AI Cache & Embeddings</span>
                          <span className="text-sm text-white">45 MB / 500 MB</span>
                        </div>
                        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                          <div className="h-full bg-fin-emerald rounded-full" style={{ width: '9%' }} />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="fin-card">
                    <h3 className="text-sm font-medium text-white mb-4">Backup & Recovery</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/5">
                        <div className="flex items-center gap-3">
                          <RefreshCw className="w-5 h-5 text-fin-accent" />
                          <div>
                            <p className="text-sm text-white">Auto-Backup</p>
                            <p className="text-xs text-white/40">Last backup: 2 hours ago</p>
                          </div>
                        </div>
                        <span className="px-3 py-1.5 rounded-lg bg-fin-emerald/10 text-fin-emerald text-xs font-medium border border-fin-emerald/20">
                          Enabled
                        </span>
                      </div>
                      <div className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/5">
                        <div className="flex items-center gap-3">
                          <Download className="w-5 h-5 text-fin-purple" />
                          <div>
                            <p className="text-sm text-white">Manual Backup</p>
                            <p className="text-xs text-white/40">Create a snapshot now</p>
                          </div>
                        </div>
                        <button className="px-3 py-1.5 rounded-lg bg-fin-purple/10 text-fin-purple text-xs font-medium hover:bg-fin-purple/20 transition-all">
                          Backup Now
                        </button>
                      </div>
                      <div className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/5">
                        <div className="flex items-center gap-3">
                          <Upload className="w-5 h-5 text-fin-amber" />
                          <div>
                            <p className="text-sm text-white">Restore Data</p>
                            <p className="text-xs text-white/40">Recover from a previous backup</p>
                          </div>
                        </div>
                        <button className="px-3 py-1.5 rounded-lg bg-fin-amber/10 text-fin-amber text-xs font-medium hover:bg-fin-amber/20 transition-all">
                          Restore
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="fin-card">
                    <h3 className="text-sm font-medium text-white mb-4">Data Management</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-white">Clear Cache</p>
                          <p className="text-xs text-white/40">Free up temporary storage</p>
                        </div>
                        <button className="px-3 py-1.5 rounded-lg bg-white/5 text-white/50 hover:text-white/70 hover:bg-white/10 text-xs transition-all">
                          Clear
                        </button>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-white">Reset AI Memory</p>
                          <p className="text-xs text-white/40">Clear AI learning data</p>
                        </div>
                        <button className="px-3 py-1.5 rounded-lg bg-white/5 text-white/50 hover:text-white/70 hover:bg-white/10 text-xs transition-all">
                          Reset
                        </button>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-white">Export All Data</p>
                          <p className="text-xs text-white/40">Download everything in JSON format</p>
                        </div>
                        <button className="px-3 py-1.5 rounded-lg bg-fin-accent/10 text-fin-accent hover:bg-fin-accent/20 text-xs transition-all">
                          Export
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeSection === 'billing' && (
                <motion.div
                  key="billing"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="max-w-2xl space-y-6"
                >
                  <div>
                    <h2 className="text-lg font-semibold text-white mb-1">Billing & Subscription</h2>
                    <p className="text-sm text-white/40">Manage your plan and payment methods</p>
                  </div>

                  <div className="fin-card border-fin-accent/20">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <span className="text-xs px-2 py-1 bg-fin-accent/20 text-fin-accent rounded-full border border-fin-accent/20">Current Plan</span>
                        <h3 className="text-xl font-bold text-white mt-2">Enterprise</h3>
                        <p className="text-sm text-white/40">Full access to all features</p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-white">$49<span className="text-sm text-white/40">/month</span></p>
                        <p className="text-xs text-white/30">Billed annually</p>
                      </div>
                    </div>
                    <div className="h-px bg-white/5 my-4" />
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      {[
                        'Unlimited transactions',
                        'AI Copilot access',
                        'Advanced analytics',
                        'Multi-user support',
                        'Priority support',
                        'Custom integrations',
                      ].map((feature, i) => (
                        <div key={i} className="flex items-center gap-2 text-white/60">
                          <Check className="w-4 h-4 text-fin-emerald" />
                          {feature}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="fin-card">
                    <h3 className="text-sm font-medium text-white mb-4">Payment Method</h3>
                    <div className="flex items-center gap-4 p-3 rounded-lg bg-white/5 border border-white/5">
                      <div className="w-12 h-8 bg-gradient-to-r from-fin-accent to-fin-purple rounded flex items-center justify-center">
                        <CreditCard className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-white">•••• •••• •••• 4242</p>
                        <p className="text-xs text-white/40">Expires 12/25</p>
                      </div>
                      <span className="px-2 py-1 bg-fin-emerald/10 text-fin-emerald text-xs rounded border border-fin-emerald/20">Default</span>
                    </div>
                  </div>

                  <div className="fin-card">
                    <h3 className="text-sm font-medium text-white mb-4">Billing History</h3>
                    <div className="space-y-2">
                      {[
                        { date: 'May 1, 2024', amount: '$49.00', status: 'Paid', invoice: 'INV-2024-005' },
                        { date: 'Apr 1, 2024', amount: '$49.00', status: 'Paid', invoice: 'INV-2024-004' },
                        { date: 'Mar 1, 2024', amount: '$49.00', status: 'Paid', invoice: 'INV-2024-003' },
                      ].map((bill, i) => (
                        <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/5">
                          <div>
                            <p className="text-sm text-white">{bill.date}</p>
                            <p className="text-xs text-white/40">{bill.invoice}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-white font-medium">{bill.amount}</p>
                            <span className="text-xs text-fin-emerald">{bill.status}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>
    </div>
  )
}

export default Settings
