import React, { useState, useEffect, Suspense } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Sidebar from '../Sidebar'
import { useAuthStore } from '../../store/authStore'
import { useDashboardStore } from '../../store/dashboardStore'
import { useTransactionStore } from '../../store/transactionStore'
import { useAppStore } from '../../store/appStore'
import {
  TrendingUp, TrendingDown, Wallet, CreditCard, PiggyBank,
  ArrowUpRight, ArrowDownRight, Activity, Bell, Calendar,
  Plus, MoreHorizontal, RefreshCw, Filter, Download, Share2,
  Zap, Sparkles, Brain, Target, Shield, Globe, Clock
} from 'lucide-react'
import { format, subDays, startOfMonth, endOfMonth } from 'date-fns'

// Lazy load chart components for performance
const CashFlowChart = React.lazy(() => import('./CashFlowChart'))
const SpendingBreakdown = React.lazy(() => import('./SpendingBreakdown'))
const AIInsightsPanel = React.lazy(() => import('./AIInsightsPanel'))
const RecentTransactions = React.lazy(() => import('./RecentTransactions'))
const NetWorthCard = React.lazy(() => import('./NetWorthCard'))
const GoalsTracker = React.lazy(() => import('./GoalsTracker'))

const Dashboard = () => {
  const { user } = useAuthStore()
  const { widgets, selectedDateRange, setDateRange } = useDashboardStore()
  const { transactions, getStats } = useTransactionStore()
  const { sidebarCollapsed, addNotification } = useAppStore()
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [showAddWidget, setShowAddWidget] = useState(false)

  const stats = getStats()

  // Generate sample data if empty
  useEffect(() => {
    if (transactions.length === 0) {
      generateSampleData()
    }
  }, [])

  const generateSampleData = () => {
    const categories = [
      { id: 'income', name: 'Income', type: 'income' },
      { id: 'food', name: 'Food & Dining', type: 'expense' },
      { id: 'transport', name: 'Transportation', type: 'expense' },
      { id: 'shopping', name: 'Shopping', type: 'expense' },
      { id: 'utilities', name: 'Utilities', type: 'expense' },
      { id: 'healthcare', name: 'Healthcare', type: 'expense' },
      { id: 'entertainment', name: 'Entertainment', type: 'expense' },
      { id: 'investment', name: 'Investment', type: 'expense' },
    ]

    const sampleTransactions = []
    const now = new Date()

    for (let i = 0; i < 150; i++) {
      const daysAgo = Math.floor(Math.random() * 90)
      const date = subDays(now, daysAgo)
      const isIncome = Math.random() > 0.7
      const category = isIncome ? categories[0] : categories[Math.floor(Math.random() * (categories.length - 1)) + 1]
      const amount = isIncome 
        ? Math.floor(Math.random() * 5000) + 2000
        : Math.floor(Math.random() * 500) + 20

      sampleTransactions.push({
        id: `txn_${Date.now()}_${i}`,
        date: date.toISOString(),
        amount: isIncome ? amount : -amount,
        type: isIncome ? 'income' : 'expense',
        category: category.id,
        description: `${category.name} - ${['Payment', 'Purchase', 'Bill', 'Transfer', 'Deposit'][Math.floor(Math.random() * 5)]}`,
        merchant: ['Amazon', 'Uber', 'Netflix', 'Spotify', 'Grocery Store', 'Gas Station', 'Restaurant', 'Pharmacy'][Math.floor(Math.random() * 8)],
        status: 'completed',
        aiTags: [],
        confidence: 0.95,
        createdAt: date.toISOString(),
        updatedAt: date.toISOString(),
      })
    }

    useTransactionStore.getState().importTransactions(sampleTransactions)
    addNotification({ type: 'success', title: 'Welcome!', message: 'Sample data loaded for demonstration' })
  }

  const handleRefresh = () => {
    setIsRefreshing(true)
    setTimeout(() => {
      setIsRefreshing(false)
      addNotification({ type: 'success', title: 'Refreshed', message: 'Dashboard data updated' })
    }, 1500)
  }

  const dateRanges = [
    { label: '7D', value: '7d' },
    { label: '30D', value: '30d' },
    { label: '90D', value: '90d' },
    { label: 'YTD', value: 'ytd' },
    { label: '1Y', value: '1y' },
    { label: 'ALL', value: 'all' },
  ]

  const quickStats = [
    {
      title: 'Net Worth',
      value: `$${(stats.netWorth / 1000).toFixed(1)}K`,
      change: '+12.5%',
      trend: 'up',
      icon: Wallet,
      color: 'from-fin-emerald/20 to-fin-emerald/5',
      iconColor: 'text-fin-emerald',
    },
    {
      title: 'Monthly Income',
      value: `$${(stats.totalIncome / 1000).toFixed(1)}K`,
      change: '+8.2%',
      trend: 'up',
      icon: TrendingUp,
      color: 'from-fin-accent/20 to-fin-accent/5',
      iconColor: 'text-fin-accent',
    },
    {
      title: 'Monthly Expenses',
      value: `$${(stats.totalExpenses / 1000).toFixed(1)}K`,
      change: '-3.1%',
      trend: 'down',
      icon: TrendingDown,
      color: 'from-fin-rose/20 to-fin-rose/5',
      iconColor: 'text-fin-rose',
    },
    {
      title: 'Savings Rate',
      value: `${stats.totalIncome > 0 ? ((stats.totalIncome - stats.totalExpenses) / stats.totalIncome * 100).toFixed(1) : 0}%`,
      change: '+2.4%',
      trend: 'up',
      icon: PiggyBank,
      color: 'from-fin-purple/20 to-fin-purple/5',
      iconColor: 'text-fin-purple',
    },
  ]

  return (
    <div className="flex h-screen bg-fin-dark overflow-hidden">
      <Sidebar />

      <main className={`flex-1 flex flex-col overflow-hidden transition-all duration-300 ${sidebarCollapsed ? 'ml-0' : ''}`}>
        {/* Header */}
        <header className="h-16 flex items-center justify-between px-6 border-b border-white/5 bg-fin-panel/50 backdrop-blur-xl">
          <div className="flex items-center gap-4">
            <div>
              <h1 className="text-xl font-bold text-white">Financial Intelligence</h1>
              <p className="text-xs text-white/40">{format(new Date(), 'EEEE, MMMM do, yyyy')}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Date Range Selector */}
            <div className="flex items-center bg-white/5 rounded-lg p-1 border border-white/5">
              {dateRanges.map((range) => (
                <button
                  key={range.value}
                  onClick={() => setDateRange(range.value)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                    selectedDateRange === range.value
                      ? 'bg-fin-accent/20 text-fin-accent'
                      : 'text-white/40 hover:text-white/70'
                  }`}
                >
                  {range.label}
                </button>
              ))}
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleRefresh}
              className="p-2 rounded-lg bg-white/5 text-white/50 hover:text-white/80 hover:bg-white/10 transition-all"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 rounded-lg bg-white/5 text-white/50 hover:text-white/80 hover:bg-white/10 transition-all relative"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-fin-rose rounded-full animate-pulse" />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowAddWidget(!showAddWidget)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-fin-accent/20 text-fin-accent hover:bg-fin-accent/30 transition-all text-sm font-medium"
            >
              <Plus className="w-4 h-4" /> Add Widget
            </motion.button>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="flex-1 overflow-y-auto fin-scrollbar p-6">
          {/* Quick Stats Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {quickStats.map((stat, i) => (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ scale: 1.02, y: -2 }}
                className={`fin-card bg-gradient-to-br ${stat.color} border-white/5`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className={`p-2 rounded-lg bg-white/5 ${stat.iconColor}`}>
                    <stat.icon className="w-5 h-5" />
                  </div>
                  <span className={`flex items-center gap-1 text-xs font-medium ${
                    stat.trend === 'up' ? 'text-fin-emerald' : 'text-fin-rose'
                  }`}>
                    {stat.trend === 'up' ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                    {stat.change}
                  </span>
                </div>
                <p className="text-2xl font-bold text-white mb-1">{stat.value}</p>
                <p className="text-sm text-white/40">{stat.title}</p>
              </motion.div>
            ))}
          </div>

          {/* Main Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            {/* Cash Flow Chart - Spans 2 columns */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="lg:col-span-2 fin-card"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-fin-accent" />
                  <h3 className="text-lg font-semibold text-white">Cash Flow Analysis</h3>
                </div>
                <div className="flex items-center gap-2">
                  <button className="p-1.5 rounded-lg bg-white/5 text-white/40 hover:text-white/70 hover:bg-white/10 transition-all">
                    <Filter className="w-4 h-4" />
                  </button>
                  <button className="p-1.5 rounded-lg bg-white/5 text-white/40 hover:text-white/70 hover:bg-white/10 transition-all">
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="h-80">
                <Suspense fallback={<div className="h-full flex items-center justify-center text-white/30">Loading chart...</div>}>
                  <CashFlowChart transactions={transactions} />
                </Suspense>
              </div>
            </motion.div>

            {/* AI Insights */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="fin-card"
            >
              <div className="flex items-center gap-2 mb-4">
                <Brain className="w-5 h-5 text-fin-purple" />
                <h3 className="text-lg font-semibold text-white">AI Insights</h3>
                <span className="ml-auto text-xs px-2 py-0.5 bg-fin-purple/20 text-fin-purple rounded-full">LIVE</span>
              </div>
              <div className="h-80 overflow-y-auto fin-scrollbar">
                <Suspense fallback={<div className="h-full flex items-center justify-center text-white/30">Loading AI...</div>}>
                  <AIInsightsPanel />
                </Suspense>
              </div>
            </motion.div>
          </div>

          {/* Second Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            {/* Spending Breakdown */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="fin-card"
            >
              <div className="flex items-center gap-2 mb-4">
                <PieChartIcon className="w-5 h-5 text-fin-rose" />
                <h3 className="text-lg font-semibold text-white">Spending Breakdown</h3>
              </div>
              <div className="h-64">
                <Suspense fallback={<div className="h-full flex items-center justify-center text-white/30">Loading...</div>}>
                  <SpendingBreakdown transactions={transactions} />
                </Suspense>
              </div>
            </motion.div>

            {/* Recent Transactions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="lg:col-span-2 fin-card"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-fin-amber" />
                  <h3 className="text-lg font-semibold text-white">Recent Transactions</h3>
                </div>
                <button className="text-sm text-fin-accent hover:text-fin-accent/80">View All</button>
              </div>
              <div className="h-64 overflow-y-auto fin-scrollbar">
                <Suspense fallback={<div className="h-full flex items-center justify-center text-white/30">Loading...</div>}>
                  <RecentTransactions />
                </Suspense>
              </div>
            </motion.div>
          </div>

          {/* Third Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Net Worth */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="fin-card"
            >
              <div className="flex items-center gap-2 mb-4">
                <Target className="w-5 h-5 text-fin-emerald" />
                <h3 className="text-lg font-semibold text-white">Net Worth Tracker</h3>
              </div>
              <div className="h-64">
                <Suspense fallback={<div className="h-full flex items-center justify-center text-white/30">Loading...</div>}>
                  <NetWorthCard />
                </Suspense>
              </div>
            </motion.div>

            {/* Goals */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
              className="fin-card"
            >
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-5 h-5 text-fin-accent" />
                <h3 className="text-lg font-semibold text-white">Financial Goals</h3>
              </div>
              <div className="h-64">
                <Suspense fallback={<div className="h-full flex items-center justify-center text-white/30">Loading...</div>}>
                  <GoalsTracker />
                </Suspense>
              </div>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  )
}

// Simple icon component for pie chart
const PieChartIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21.21 15.89A10 10 0 1 1 8 2.83" />
    <path d="M22 12A10 10 0 0 0 12 2v10z" />
  </svg>
)

export default Dashboard
