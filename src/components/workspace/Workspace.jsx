import React, { useState } from 'react'
import { motion } from 'framer-motion'
import Sidebar from '../Sidebar'
import { useAppStore } from '../../store/appStore'
import { useDashboardStore } from '../../store/dashboardStore'
import {
  LayoutGrid, Plus, X, GripVertical, Settings, Save, Share2,
  Maximize2, Minimize2, BarChart3, PieChart, Activity, Wallet,
  TrendingUp, Target, Bell, FileText, Calendar, Users, Lock
} from 'lucide-react'

const Workspace = () => {
  const { sidebarCollapsed } = useAppStore()
  const { widgets, addWidget, removeWidget } = useDashboardStore()
  const [activeWorkspace, setActiveWorkspace] = useState('default')
  const [showAddPanel, setShowAddPanel] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)

  const availableWidgets = [
    { type: 'metric', title: 'Net Worth', icon: Wallet, description: 'Total assets minus liabilities' },
    { type: 'chart', title: 'Cash Flow', icon: Activity, description: 'Income vs expenses over time' },
    { type: 'chart', title: 'Spending Breakdown', icon: PieChart, description: 'Category-wise expense distribution' },
    { type: 'list', title: 'Recent Transactions', icon: FileText, description: 'Latest financial activities' },
    { type: 'ai', title: 'AI Insights', icon: TrendingUp, description: 'AI-generated financial intelligence' },
    { type: 'metric', title: 'Goals Tracker', icon: Target, description: 'Financial goal progress' },
    { type: 'chart', title: 'Investment Portfolio', icon: BarChart3, description: 'Asset allocation and performance' },
    { type: 'list', title: 'Upcoming Bills', icon: Calendar, description: 'Scheduled payments and reminders' },
    { type: 'metric', title: 'Alerts', icon: Bell, description: 'Important notifications and warnings' },
    { type: 'chart', title: 'Team Activity', icon: Users, description: 'Collaborative workspace updates' },
  ]

  const workspaces = [
    { id: 'default', name: 'Default Dashboard', icon: LayoutGrid, color: 'fin-accent' },
    { id: 'executive', name: 'Executive View', icon: BarChart3, color: 'fin-purple' },
    { id: 'analyst', name: 'Analyst Mode', icon: Activity, color: 'fin-emerald' },
    { id: 'auditor', name: 'Audit Trail', icon: Lock, color: 'fin-amber' },
    { id: 'personal', name: 'Personal Finance', icon: Wallet, color: 'fin-rose' },
  ]

  const handleAddWidget = (widget) => {
    addWidget({
      ...widget,
      position: { x: 0, y: 0, w: 3, h: 2 },
    })
    setShowAddPanel(false)
  }

  return (
    <div className="flex h-screen bg-fin-dark overflow-hidden">
      <Sidebar />

      <main className={`flex-1 flex flex-col overflow-hidden ${sidebarCollapsed ? '' : ''}`}>
        {/* Header */}
        <header className="h-16 flex items-center justify-between px-6 border-b border-white/5 bg-fin-panel/50 backdrop-blur-xl">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-bold text-white">Workspace</h1>

            {/* Workspace Tabs */}
            <div className="flex items-center gap-1 ml-6">
              {workspaces.map((ws) => (
                <button
                  key={ws.id}
                  onClick={() => setActiveWorkspace(ws.id)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    activeWorkspace === ws.id
                      ? 'bg-white/10 text-white border border-white/10'
                      : 'text-white/40 hover:text-white/70 hover:bg-white/5'
                  }`}
                >
                  <ws.icon className={`w-4 h-4 ${activeWorkspace === ws.id ? `text-${ws.color}` : ''}`} />
                  {ws.name}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsEditMode(!isEditMode)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                isEditMode 
                  ? 'bg-fin-accent/20 text-fin-accent border border-fin-accent/20' 
                  : 'bg-white/5 text-white/50 hover:text-white/70 hover:bg-white/10 border border-transparent'
              }`}
            >
              <Settings className="w-4 h-4" />
              {isEditMode ? 'Done' : 'Edit'}
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 text-white/50 hover:text-white/70 hover:bg-white/10 text-sm font-medium transition-all border border-transparent"
            >
              <Save className="w-4 h-4" />
              Save
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 text-white/50 hover:text-white/70 hover:bg-white/10 text-sm font-medium transition-all border border-transparent"
            >
              <Share2 className="w-4 h-4" />
              Share
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowAddPanel(!showAddPanel)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-fin-accent/20 text-fin-accent hover:bg-fin-accent/30 text-sm font-medium transition-all border border-fin-accent/20"
            >
              <Plus className="w-4 h-4" />
              Add Widget
            </motion.button>
          </div>
        </header>

        {/* Workspace Grid */}
        <div className="flex-1 overflow-y-auto fin-scrollbar p-6">
          {showAddPanel && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-6"
            >
              <div className="fin-card">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white">Add Widget</h3>
                  <button 
                    onClick={() => setShowAddPanel(false)}
                    className="p-1.5 rounded-lg hover:bg-white/10 text-white/40 hover:text-white/70 transition-all"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                  {availableWidgets.map((widget, i) => (
                    <motion.button
                      key={i}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleAddWidget(widget)}
                      className="p-4 rounded-xl bg-white/5 border border-white/5 hover:border-fin-accent/30 hover:bg-fin-accent/5 transition-all text-left group"
                    >
                      <widget.icon className="w-6 h-6 text-fin-accent mb-3 group-hover:scale-110 transition-transform" />
                      <h4 className="text-sm font-medium text-white mb-1">{widget.title}</h4>
                      <p className="text-xs text-white/40">{widget.description}</p>
                    </motion.button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* Widget Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {widgets.map((widget, i) => (
              <motion.div
                key={widget.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
                whileHover={{ y: -2 }}
                className="fin-card relative group"
              >
                {isEditMode && (
                  <div className="absolute top-2 right-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all z-10">
                    <button className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white/60 hover:text-white transition-all cursor-move">
                      <GripVertical className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => removeWidget(widget.id)}
                      className="p-1.5 rounded-lg bg-fin-rose/20 hover:bg-fin-rose/30 text-fin-rose transition-all"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}

                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-fin-accent/10 flex items-center justify-center">
                    <BarChart3 className="w-4 h-4 text-fin-accent" />
                  </div>
                  <h3 className="text-sm font-medium text-white">{widget.title}</h3>
                </div>

                <div className="h-40 flex items-center justify-center bg-white/5 rounded-lg border border-white/5">
                  <div className="text-center">
                    <BarChart3 className="w-8 h-8 text-white/10 mx-auto mb-2" />
                    <p className="text-xs text-white/20">Widget Content</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Empty State */}
          {widgets.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="w-20 h-20 rounded-2xl bg-white/5 flex items-center justify-center mb-4">
                <LayoutGrid className="w-10 h-10 text-white/10" />
              </div>
              <h3 className="text-lg font-medium text-white/40 mb-2">Your workspace is empty</h3>
              <p className="text-sm text-white/20 mb-4">Add widgets to customize your financial dashboard</p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowAddPanel(true)}
                className="fin-button-primary"
              >
                <Plus className="w-4 h-4 inline mr-2" />
                Add Your First Widget
              </motion.button>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default Workspace
