import React, { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import Sidebar from '../Sidebar'
import { useTransactionStore } from '../../store/transactionStore'
import { useAppStore } from '../../store/appStore'
import { format, subMonths, eachMonthOfInterval, eachDayOfInterval, subDays, isSameDay, isSameMonth } from 'date-fns'
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area, RadarChart, 
  Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ComposedChart, Legend,
  ScatterChart, Scatter, ZAxis, Treemap, Sankey
} from 'recharts'
import {
  BarChart3, TrendingUp, PieChart as PieChartIcon, Activity, Calendar, Filter,
  Download, Brain, Zap, Target, ArrowUpRight, ArrowDownRight,
  Layers, GitBranch, Globe, Clock
} from 'lucide-react'

const Analytics = () => {
  const { transactions, categories } = useTransactionStore()
  const { sidebarCollapsed } = useAppStore()
  const [activeTab, setActiveTab] = useState('overview')

  const monthlyData = useMemo(() => {
    const months = eachMonthOfInterval({
      start: subMonths(new Date(), 11),
      end: new Date(),
    })

    return months.map(month => {
      const monthTxns = transactions.filter(t => isSameMonth(new Date(t.date), month))
      const income = monthTxns.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0)
      const expenses = monthTxns.filter(t => t.type === 'expense').reduce((s, t) => s + Math.abs(t.amount), 0)

      return {
        month: format(month, 'MMM yyyy'),
        income: Math.round(income),
        expenses: Math.round(expenses),
        savings: Math.round(income - expenses),
        transactions: monthTxns.length,
      }
    })
  }, [transactions])

  const categoryData = useMemo(() => {
    const totals = {}
    transactions.filter(t => t.type === 'expense').forEach(t => {
      totals[t.category] = (totals[t.category] || 0) + Math.abs(t.amount)
    })

    return Object.entries(totals)
      .map(([catId, amount]) => {
        const cat = categories.find(c => c.id === catId) || { name: catId, color: '#6b7280' }
        return { name: cat.name, value: Math.round(amount), color: cat.color, id: catId }
      })
      .sort((a, b) => b.value - a.value)
  }, [transactions, categories])

  const radarData = useMemo(() => {
    const catTotals = {}
    transactions.filter(t => t.type === 'expense').forEach(t => {
      catTotals[t.category] = (catTotals[t.category] || 0) + Math.abs(t.amount)
    })

    const maxVal = Math.max(...Object.values(catTotals), 1)

    return Object.entries(catTotals).map(([catId, amount]) => {
      const cat = categories.find(c => c.id === catId) || { name: catId }
      return {
        subject: cat.name,
        A: Math.round((amount / maxVal) * 100),
        fullMark: 100,
      }
    })
  }, [transactions, categories])

  const dailyData = useMemo(() => {
    const days = eachDayOfInterval({
      start: subDays(new Date(), 30),
      end: new Date(),
    })

    return days.map(day => {
      const dayTxns = transactions.filter(t => isSameDay(new Date(t.date), day))
      return {
        date: format(day, 'MMM dd'),
        count: dayTxns.length,
        volume: Math.round(dayTxns.reduce((s, t) => s + Math.abs(t.amount), 0)),
      }
    })
  }, [transactions])

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'trends', label: 'Trends', icon: TrendingUp },
    { id: 'categories', label: 'Categories', icon: PieChart },
    { id: 'patterns', label: 'Patterns', icon: Activity },
    { id: 'predictions', label: 'AI Predictions', icon: Brain },
  ]

  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload) return null
    return (
      <div className="bg-fin-panel border border-white/10 rounded-lg p-3 shadow-xl">
        <p className="text-white/70 text-sm mb-2">{label}</p>
        {payload.map((entry, i) => (
          <div key={i} className="flex items-center gap-2 text-sm">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color || entry.fill }} />
            <span className="text-white/50 capitalize">{entry.name}:</span>
            <span className="text-white font-medium">
              {typeof entry.value === 'number' ? `$${entry.value.toLocaleString()}` : entry.value}
            </span>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-fin-dark overflow-hidden">
      <Sidebar />

      <main className={`flex-1 flex flex-col overflow-hidden ${sidebarCollapsed ? '' : ''}`}>
        {/* Header */}
        <header className="h-16 flex items-center justify-between px-6 border-b border-white/5 bg-fin-panel/50 backdrop-blur-xl">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-bold text-white">Analytics Engine</h1>
            <span className="flex items-center gap-1.5 text-xs px-2 py-1 bg-fin-purple/10 text-fin-purple rounded-lg border border-fin-purple/20">
              <Brain className="w-3 h-3" />
              AI-Powered
            </span>
          </div>
          <div className="flex items-center gap-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 text-white/50 hover:text-white/70 hover:bg-white/10 text-sm font-medium transition-all"
            >
              <Filter className="w-4 h-4" />
              Filter
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 text-white/50 hover:text-white/70 hover:bg-white/10 text-sm font-medium transition-all"
            >
              <Download className="w-4 h-4" />
              Export
            </motion.button>
          </div>
        </header>

        {/* Tabs */}
        <div className="px-6 pt-4 border-b border-white/5">
          <div className="flex gap-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-t-lg text-sm font-medium transition-all border-b-2 ${
                  activeTab === tab.id
                    ? 'text-fin-accent border-fin-accent bg-fin-accent/5'
                    : 'text-white/40 border-transparent hover:text-white/60 hover:bg-white/5'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto fin-scrollbar p-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* KPI Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[
                  { label: 'Total Volume', value: `$${(transactions.reduce((s, t) => s + Math.abs(t.amount), 0) / 1000).toFixed(1)}K`, change: '+12.4%', icon: Layers, color: 'fin-accent' },
                  { label: 'Avg Transaction', value: `$${transactions.length > 0 ? Math.round(transactions.reduce((s, t) => s + Math.abs(t.amount), 0) / transactions.length).toLocaleString() : 0}`, change: '-3.2%', icon: Activity, color: 'fin-purple' },
                  { label: 'Transaction Count', value: transactions.length.toLocaleString(), change: '+8.7%', icon: GitBranch, color: 'fin-emerald' },
                  { label: 'Active Days', value: '24', change: '+2', icon: Calendar, color: 'fin-amber' },
                ].map((kpi, i) => (
                  <motion.div
                    key={kpi.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="fin-card"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <kpi.icon className={`w-5 h-5 text-${kpi.color}`} />
                      <span className={`text-xs font-medium ${kpi.change.startsWith('+') ? 'text-fin-emerald' : 'text-fin-rose'}`}>
                        {kpi.change}
                      </span>
                    </div>
                    <p className="text-2xl font-bold text-white">{kpi.value}</p>
                    <p className="text-xs text-white/40 mt-1">{kpi.label}</p>
                  </motion.div>
                ))}
              </div>

              {/* Monthly Trend */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="fin-card"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white">Monthly Financial Overview</h3>
                  <div className="flex items-center gap-4 text-xs">
                    <span className="flex items-center gap-1.5">
                      <div className="w-2 h-2 rounded-full bg-fin-emerald" />
                      Income
                    </span>
                    <span className="flex items-center gap-1.5">
                      <div className="w-2 h-2 rounded-full bg-fin-rose" />
                      Expenses
                    </span>
                    <span className="flex items-center gap-1.5">
                      <div className="w-2 h-2 rounded-full bg-fin-accent" />
                      Savings
                    </span>
                  </div>
                </div>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={monthlyData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                      <XAxis dataKey="month" stroke="rgba(255,255,255,0.2)" fontSize={11} tickLine={false} />
                      <YAxis stroke="rgba(255,255,255,0.2)" fontSize={11} tickLine={false} tickFormatter={(v) => `$${(v/1000).toFixed(0)}k`} />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend />
                      <Bar dataKey="income" fill="#10b981" radius={[4, 4, 0, 0]} opacity={0.8} name="Income" />
                      <Bar dataKey="expenses" fill="#f43f5e" radius={[4, 4, 0, 0]} opacity={0.8} name="Expenses" />
                      <Line type="monotone" dataKey="savings" stroke="#00d4ff" strokeWidth={2} dot={{ fill: '#00d4ff', r: 4 }} name="Savings" />
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>

              {/* Bottom Row */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="fin-card"
                >
                  <h3 className="text-lg font-semibold text-white mb-4">Category Distribution</h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={categoryData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={100}
                          paddingAngle={3}
                          dataKey="value"
                        >
                          {categoryData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip content={<CustomTooltip />} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                  className="fin-card"
                >
                  <h3 className="text-lg font-semibold text-white mb-4">Spending Radar</h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart data={radarData}>
                        <PolarGrid stroke="rgba(255,255,255,0.1)" />
                        <PolarAngleAxis dataKey="subject" tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 11 }} />
                        <PolarRadiusAxis tick={{ fill: 'rgba(255,255,255,0.2)', fontSize: 10 }} />
                        <Radar name="Spending" dataKey="A" stroke="#00d4ff" fill="#00d4ff" fillOpacity={0.3} />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                </motion.div>
              </div>
            </div>
          )}

          {activeTab === 'trends' && (
            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="fin-card"
              >
                <h3 className="text-lg font-semibold text-white mb-4">Daily Transaction Volume (30 Days)</h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={dailyData}>
                      <defs>
                        <linearGradient id="volumeGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#7c3aed" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                      <XAxis dataKey="date" stroke="rgba(255,255,255,0.2)" fontSize={11} tickLine={false} />
                      <YAxis stroke="rgba(255,255,255,0.2)" fontSize={11} tickLine={false} />
                      <Tooltip content={<CustomTooltip />} />
                      <Area type="monotone" dataKey="volume" stroke="#7c3aed" strokeWidth={2} fill="url(#volumeGradient)" name="Volume" />
                      <Line type="monotone" dataKey="count" stroke="#00d4ff" strokeWidth={2} dot={false} name="Count" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>
            </div>
          )}

          {activeTab === 'categories' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {categoryData.map((cat, i) => {
                  const total = categoryData.reduce((s, c) => s + c.value, 0)
                  const pct = ((cat.value / total) * 100).toFixed(1)

                  return (
                    <motion.div
                      key={cat.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.05 }}
                      whileHover={{ scale: 1.02 }}
                      className="fin-card"
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <div 
                          className="w-10 h-10 rounded-lg flex items-center justify-center"
                          style={{ backgroundColor: `${cat.color}15` }}
                        >
                          <div className="w-4 h-4 rounded-full" style={{ backgroundColor: cat.color }} />
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-white">{cat.name}</h4>
                          <p className="text-xs text-white/40">{pct}% of total spending</p>
                        </div>
                      </div>
                      <p className="text-2xl font-bold text-white mb-2">${cat.value.toLocaleString()}</p>
                      <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                        <motion.div
                          className="h-full rounded-full"
                          style={{ backgroundColor: cat.color }}
                          initial={{ width: 0 }}
                          animate={{ width: `${pct}%` }}
                          transition={{ delay: 0.3 + i * 0.05, duration: 0.8 }}
                        />
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            </div>
          )}

          {activeTab === 'patterns' && (
            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="fin-card"
              >
                <div className="flex items-center gap-2 mb-4">
                  <Zap className="w-5 h-5 text-fin-amber" />
                  <h3 className="text-lg font-semibold text-white">AI Pattern Detection</h3>
                </div>
                <div className="space-y-4">
                  {[
                    { pattern: 'Weekend Spike', desc: 'Spending increases by 34% on weekends', confidence: 96, type: 'behavior' },
                    { pattern: 'Subscription Creep', desc: 'Monthly subscriptions grew from $127 to $247 over 6 months', confidence: 99, type: 'alert' },
                    { pattern: 'Salary Day Spending', desc: '48% higher transaction volume within 3 days of salary credit', confidence: 94, type: 'behavior' },
                    { pattern: 'Duplicate Risk', desc: '3 potential duplicate transactions detected this month', confidence: 88, type: 'alert' },
                    { pattern: 'Seasonal Trend', desc: 'Utility bills spike by 22% in summer months', confidence: 91, type: 'seasonal' },
                  ].map((item, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="flex items-center gap-4 p-3 rounded-lg bg-white/5 border border-white/5"
                    >
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                        item.type === 'alert' ? 'bg-fin-rose/10' : 
                        item.type === 'seasonal' ? 'bg-fin-amber/10' : 'bg-fin-accent/10'
                      }`}>
                        {item.type === 'alert' ? <ArrowUpRight className="w-5 h-5 text-fin-rose" /> :
                         item.type === 'seasonal' ? <Clock className="w-5 h-5 text-fin-amber" /> :
                         <Target className="w-5 h-5 text-fin-accent" />}
                      </div>
                      <div className="flex-1">
                        <h4 className="text-sm font-medium text-white">{item.pattern}</h4>
                        <p className="text-xs text-white/50">{item.desc}</p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <span className="text-xs text-fin-purple font-medium">{item.confidence}%</span>
                        <p className="text-xs text-white/30">confidence</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
          )}

          {activeTab === 'predictions' && (
            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="fin-card"
              >
                <div className="flex items-center gap-2 mb-4">
                  <Brain className="w-5 h-5 text-fin-purple" />
                  <h3 className="text-lg font-semibold text-white">AI Financial Forecast</h3>
                  <span className="ml-auto text-xs px-2 py-1 bg-fin-purple/20 text-fin-purple rounded-lg">87% Confidence</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  {[
                    { label: 'Projected Income (Q3)', value: '$25,500', change: '+4.2%', icon: ArrowUpRight, color: 'fin-emerald' },
                    { label: 'Projected Expenses (Q3)', value: '$15,800', change: '-2.1%', icon: ArrowDownRight, color: 'fin-rose' },
                    { label: 'Projected Savings (Q3)', value: '$9,700', change: '+18.3%', icon: Target, color: 'fin-accent' },
                  ].map((pred, i) => (
                    <motion.div
                      key={pred.label}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 + i * 0.1 }}
                      className="p-4 rounded-xl bg-white/5 border border-white/5"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <pred.icon className={`w-4 h-4 text-${pred.color}`} />
                        <span className="text-xs text-white/40">{pred.label}</span>
                      </div>
                      <p className="text-xl font-bold text-white">{pred.value}</p>
                      <p className={`text-xs ${pred.change.startsWith('+') ? 'text-fin-emerald' : 'text-fin-rose'}`}>
                        {pred.change} vs current quarter
                      </p>
                    </motion.div>
                  ))}
                </div>

                <div className="p-4 rounded-xl bg-fin-accent/5 border border-fin-accent/10">
                  <h4 className="text-sm font-medium text-fin-accent mb-2">AI Recommendations</h4>
                  <ul className="space-y-2 text-sm text-white/70">
                    <li className="flex items-start gap-2">
                      <span className="text-fin-accent mt-0.5">•</span>
                      Reduce subscription spending by $45/month to meet savings target
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-fin-accent mt-0.5">•</span>
                      Consider tax-loss harvesting: potential savings of $2,400
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-fin-accent mt-0.5">•</span>
                      Emergency fund will reach target by October at current savings rate
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-fin-accent mt-0.5">•</span>
                      Optimize credit card rewards: missing $85/quarter in cashback
                    </li>
                  </ul>
                </div>
              </motion.div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default Analytics
