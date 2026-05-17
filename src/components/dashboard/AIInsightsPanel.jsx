import React from 'react'
import { motion } from 'framer-motion'
import { 
  Brain, TrendingUp, AlertTriangle, Lightbulb, 
  ShieldCheck, Target, Zap, ArrowRight 
} from 'lucide-react'

const AIInsightsPanel = () => {
  const insights = [
    {
      id: 1,
      type: 'prediction',
      icon: TrendingUp,
      color: 'text-fin-accent',
      bgColor: 'bg-fin-accent/10',
      title: 'Cash Flow Prediction',
      message: 'Based on your spending patterns, you are projected to save $2,400 next month if you maintain current habits.',
      confidence: 94,
      time: '2 min ago',
    },
    {
      id: 2,
      type: 'anomaly',
      icon: AlertTriangle,
      color: 'text-fin-amber',
      bgColor: 'bg-fin-amber/10',
      title: 'Unusual Transaction Detected',
      message: 'A $1,200 charge at "Electronics Store" is 340% above your monthly average for this category.',
      confidence: 89,
      time: '15 min ago',
    },
    {
      id: 3,
      type: 'suggestion',
      icon: Lightbulb,
      color: 'text-fin-purple',
      bgColor: 'bg-fin-purple/10',
      title: 'Tax Optimization Opportunity',
      message: 'You could save approximately $3,200 in taxes by maximizing your retirement contributions this quarter.',
      confidence: 97,
      time: '1 hour ago',
    },
    {
      id: 4,
      type: 'security',
      icon: ShieldCheck,
      color: 'text-fin-emerald',
      bgColor: 'bg-fin-emerald/10',
      title: 'Security Check Passed',
      message: 'All 156 transactions this week have been verified. No suspicious patterns detected.',
      confidence: 100,
      time: '3 hours ago',
    },
    {
      id: 5,
      type: 'goal',
      icon: Target,
      color: 'text-fin-rose',
      bgColor: 'bg-fin-rose/10',
      title: 'Goal Progress Alert',
      message: 'Your "Emergency Fund" goal is 68% complete. You need $4,200 more to reach your $15,000 target.',
      confidence: 92,
      time: '5 hours ago',
    },
    {
      id: 6,
      type: 'optimization',
      icon: Zap,
      color: 'text-fin-accent',
      bgColor: 'bg-fin-accent/10',
      title: 'Subscription Audit',
      message: 'You are spending $247/month on subscriptions. 3 services have not been used in 60+ days.',
      confidence: 88,
      time: 'Yesterday',
    },
  ]

  return (
    <div className="space-y-3">
      {insights.map((insight, i) => (
        <motion.div
          key={insight.id}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.1 }}
          whileHover={{ scale: 1.02, x: 4 }}
          className="p-3 rounded-lg bg-white/5 border border-white/5 hover:border-white/10 hover:bg-white/10 transition-all cursor-pointer group"
        >
          <div className="flex items-start gap-3">
            <div className={`p-2 rounded-lg ${insight.bgColor} flex-shrink-0`}>
              <insight.icon className={`w-4 h-4 ${insight.color}`} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h4 className="text-sm font-medium text-white truncate">{insight.title}</h4>
                <span className="text-xs text-white/30 flex-shrink-0">{insight.time}</span>
              </div>
              <p className="text-xs text-white/50 leading-relaxed line-clamp-2">{insight.message}</p>
              <div className="flex items-center gap-2 mt-2">
                <div className="flex-1 h-1 bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ 
                      backgroundColor: insight.confidence > 90 ? '#10b981' : insight.confidence > 80 ? '#f59e0b' : '#f43f5e'
                    }}
                    initial={{ width: 0 }}
                    animate={{ width: `${insight.confidence}%` }}
                    transition={{ delay: 0.5 + i * 0.1, duration: 0.8 }}
                  />
                </div>
                <span className="text-xs text-white/30">{insight.confidence}%</span>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-white/20 group-hover:text-white/50 transition-all flex-shrink-0 mt-1" />
          </div>
        </motion.div>
      ))}

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="w-full py-3 rounded-lg border border-dashed border-white/10 text-white/40 hover:text-white/70 hover:border-white/20 hover:bg-white/5 transition-all text-sm font-medium flex items-center justify-center gap-2"
      >
        <Brain className="w-4 h-4" />
        Generate New Insights
      </motion.button>
    </div>
  )
}

export default AIInsightsPanel
