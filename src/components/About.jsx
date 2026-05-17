import React from 'react'
import { motion } from 'framer-motion'
import Sidebar from './Sidebar'
import { useAppStore } from '../store/appStore'
import {
  Heart, Code, Sparkles, Zap, Shield, Globe, Cpu,
  GitBranch, Layers, Database, Lock, Award, Star,
  Github, Twitter, Linkedin, Mail, ExternalLink,
  Terminal, Box, Cloud, Fingerprint, Brain, Eye
} from 'lucide-react'

const About = () => {
  const { sidebarCollapsed } = useAppStore()

  const techStack = [
    { name: 'React 18', icon: Box, category: 'Frontend', color: 'text-fin-accent' },
    { name: 'TailwindCSS', icon: Layers, category: 'Styling', color: 'text-fin-purple' },
    { name: 'Framer Motion', icon: Sparkles, category: 'Animation', color: 'text-fin-rose' },
    { name: 'Zustand', icon: Database, category: 'State', color: 'text-fin-amber' },
    { name: 'Recharts', icon: BarChartIcon, category: 'Charts', color: 'text-fin-emerald' },
    { name: 'Electron', icon: Cpu, category: 'Desktop', color: 'text-fin-accent' },
    { name: 'Node.js', icon: Terminal, category: 'Backend', color: 'text-fin-emerald' },
    { name: 'Express', icon: ServerIcon, category: 'API', color: 'text-fin-purple' },
    { name: 'SQLite', icon: Database, category: 'Database', color: 'text-fin-amber' },
    { name: 'AES-256', icon: Lock, category: 'Security', color: 'text-fin-rose' },
    { name: 'OAuth2', icon: Fingerprint, category: 'Auth', color: 'text-fin-accent' },
    { name: 'AI Engine', icon: Brain, category: 'Intelligence', color: 'text-fin-purple' },
  ]

  const features = [
    { icon: Brain, title: 'AI Financial Copilot', desc: 'Conversational AI that understands your finances', color: 'fin-purple' },
    { icon: Shield, title: 'Bank-Grade Security', desc: 'AES-256 encryption, biometric auth, device fingerprinting', color: 'fin-emerald' },
    { icon: Zap, title: 'Real-Time Analytics', desc: 'Live dashboards with sub-second updates', color: 'fin-accent' },
    { icon: Globe, title: 'Multi-Currency', desc: 'Support for 150+ currencies with real-time conversion', color: 'fin-amber' },
    { icon: Eye, title: 'Anomaly Detection', desc: 'AI-powered fraud and unusual pattern detection', color: 'fin-rose' },
    { icon: Cloud, title: 'Hybrid Cloud', desc: 'Local-first with optional secure cloud sync', color: 'fin-accent' },
  ]

  const milestones = [
    { year: '2023', title: 'Concept Genesis', desc: 'The vision for next-gen financial intelligence was born' },
    { year: '2024', title: 'Alpha Development', desc: 'Core engine, AI copilot, and analytics framework built' },
    { year: '2024', title: 'Beta Release', desc: 'Enterprise features, multi-user support, and plugin system' },
    { year: '2025', title: 'Public Launch', desc: 'Full SaaS platform with marketplace and integrations' },
  ]

  return (
    <div className="flex h-screen bg-fin-dark overflow-hidden">
      <Sidebar />

      <main className={`flex-1 flex flex-col overflow-hidden ${sidebarCollapsed ? '' : ''}`}>
        {/* Header */}
        <header className="h-16 flex items-center px-6 border-b border-white/5 bg-fin-panel/50 backdrop-blur-xl">
          <h1 className="text-xl font-bold text-white">About</h1>
        </header>

        <div className="flex-1 overflow-y-auto fin-scrollbar">
          {/* Hero */}
          <div className="relative overflow-hidden">
            <div className="absolute inset-0 fin-grid-bg opacity-20" />
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-fin-accent/5 rounded-full blur-3xl" />
            <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-fin-purple/5 rounded-full blur-3xl" />

            <div className="relative z-10 px-6 py-16 text-center">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="w-24 h-24 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-fin-accent to-fin-purple flex items-center justify-center shadow-lg shadow-fin-accent/20"
              >
                <span className="text-5xl font-bold text-white">F</span>
              </motion.div>

              <motion.h1
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-4xl font-bold mb-3"
              >
                <span className="fin-gradient-text">FinAnalytics</span>
              </motion.h1>

              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-xl text-white/60 mb-2"
              >
                Next-Generation AI-Powered Financial Intelligence Operating System
              </motion.p>

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="flex items-center justify-center gap-2 text-sm text-white/40"
              >
                <span className="px-2 py-0.5 bg-fin-accent/10 text-fin-accent rounded border border-fin-accent/20">v1.0.0</span>
                <span>•</span>
                <span>Enterprise Edition</span>
                <span>•</span>
                <span className="px-2 py-0.5 bg-fin-emerald/10 text-fin-emerald rounded border border-fin-emerald/20">Stable</span>
              </motion.div>

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mt-8 max-w-2xl mx-auto"
              >
                <div className="p-6 rounded-2xl bg-gradient-to-r from-fin-accent/10 via-fin-purple/10 to-fin-rose/10 border border-white/5">
                  <p className="text-lg text-white/80 font-medium mb-3">
                    Designed, Created and Developed by
                  </p>
                  <p className="text-3xl font-bold fin-gradient-text mb-2">
                    Anshuman Jha
                  </p>
                  <p className="text-white/40 text-sm mb-4">
                    Brainchild of Anshuman Kr Jha
                  </p>
                  <div className="flex items-center justify-center gap-4">
                    <a href="#" className="p-2 rounded-lg bg-white/5 text-white/40 hover:text-white/70 hover:bg-white/10 transition-all">
                      <Github className="w-5 h-5" />
                    </a>
                    <a href="#" className="p-2 rounded-lg bg-white/5 text-white/40 hover:text-white/70 hover:bg-white/10 transition-all">
                      <Twitter className="w-5 h-5" />
                    </a>
                    <a href="#" className="p-2 rounded-lg bg-white/5 text-white/40 hover:text-white/70 hover:bg-white/10 transition-all">
                      <Linkedin className="w-5 h-5" />
                    </a>
                    <a href="#" className="p-2 rounded-lg bg-white/5 text-white/40 hover:text-white/70 hover:bg-white/10 transition-all">
                      <Mail className="w-5 h-5" />
                    </a>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>

          <div className="px-6 pb-16 space-y-16">
            {/* Mission */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="max-w-3xl mx-auto text-center"
            >
              <h2 className="text-2xl font-bold text-white mb-4">Our Mission</h2>
              <p className="text-white/60 leading-relaxed">
                FinAnalytics represents the convergence of artificial intelligence, financial expertise, and cutting-edge software engineering. 
                Built from the ground up to be the most advanced personal and enterprise financial intelligence platform, 
                it transforms raw transaction data into actionable strategic insights. Every pixel, every algorithm, every interaction 
                has been meticulously crafted to deliver an experience that surpasses Bloomberg Terminal, TradingView, and Power BI combined.
              </p>
            </motion.div>

            {/* Features Grid */}
            <div>
              <h2 className="text-2xl font-bold text-white text-center mb-8">Core Capabilities</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
                {features.map((feature, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    whileHover={{ scale: 1.02, y: -4 }}
                    className="fin-card group"
                  >
                    <div className={`w-12 h-12 rounded-xl bg-${feature.color}/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                      <feature.icon className={`w-6 h-6 text-${feature.color}`} />
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                    <p className="text-sm text-white/50">{feature.desc}</p>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Tech Stack */}
            <div>
              <h2 className="text-2xl font-bold text-white text-center mb-8">Technology Stack</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 max-w-4xl mx-auto">
                {techStack.map((tech, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.03 }}
                    whileHover={{ scale: 1.05 }}
                    className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 hover:bg-white/10 transition-all"
                  >
                    <tech.icon className={`w-5 h-5 ${tech.color}`} />
                    <div>
                      <p className="text-sm text-white font-medium">{tech.name}</p>
                      <p className="text-xs text-white/30">{tech.category}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Timeline */}
            <div>
              <h2 className="text-2xl font-bold text-white text-center mb-8">Development Journey</h2>
              <div className="max-w-3xl mx-auto relative">
                <div className="absolute left-8 top-0 bottom-0 w-px bg-gradient-to-b from-fin-accent via-fin-purple to-fin-rose opacity-30" />

                {milestones.map((milestone, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.15 }}
                    className="relative flex items-start gap-6 mb-8 last:mb-0"
                  >
                    <div className="relative z-10 w-16 flex-shrink-0 text-right">
                      <span className="text-sm font-bold text-fin-accent">{milestone.year}</span>
                    </div>
                    <div className="w-4 h-4 rounded-full bg-fin-accent border-4 border-fin-dark flex-shrink-0 mt-0.5" />
                    <div className="flex-1 pb-8">
                      <h3 className="text-lg font-semibold text-white mb-1">{milestone.title}</h3>
                      <p className="text-sm text-white/50">{milestone.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Stats */}
            <div className="max-w-4xl mx-auto">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { value: '100+', label: 'Visualizations', icon: BarChartIcon },
                  { value: '50+', label: 'AI Models', icon: Brain },
                  { value: '20+', label: 'File Formats', icon: FileIcon },
                  { value: '∞', label: 'Possibilities', icon: Sparkles },
                ].map((stat, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="fin-card text-center"
                  >
                    <stat.icon className="w-6 h-6 text-fin-accent mx-auto mb-2" />
                    <p className="text-3xl font-bold fin-gradient-text">{stat.value}</p>
                    <p className="text-sm text-white/40">{stat.label}</p>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="max-w-2xl mx-auto text-center pt-8 border-t border-white/5">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Heart className="w-4 h-4 text-fin-rose" />
                <span className="text-sm text-white/40">Crafted with passion and precision</span>
              </div>
              <p className="text-xs text-white/20">
                FinAnalytics v1.0.0 Enterprise Edition • © 2024 Anshuman Jha. All rights reserved.
              </p>
              <p className="text-xs text-white/20 mt-1">
                Designed, Created and Developed by Anshuman Jha • Brainchild of Anshuman Kr Jha
              </p>
              <div className="flex items-center justify-center gap-4 mt-4 text-xs text-white/20">
                <a href="#" className="hover:text-white/40 transition-all">Privacy Policy</a>
                <span>•</span>
                <a href="#" className="hover:text-white/40 transition-all">Terms of Service</a>
                <span>•</span>
                <a href="#" className="hover:text-white/40 transition-all">License Agreement</a>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

// Icon components
const BarChartIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="20" x2="12" y2="10" />
    <line x1="18" y1="20" x2="18" y2="4" />
    <line x1="6" y1="20" x2="6" y2="16" />
  </svg>
)

const ServerIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="8" rx="2" ry="2" />
    <rect x="2" y="14" width="20" height="8" rx="2" ry="2" />
    <line x1="6" y1="6" x2="6.01" y2="6" />
    <line x1="6" y1="18" x2="6.01" y2="18" />
  </svg>
)

const FileIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
  </svg>
)

export default About
