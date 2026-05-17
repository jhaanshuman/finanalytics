import React from 'react'
import { motion } from 'framer-motion'
import { Target, Home, Car, Plane, GraduationCap, Heart, Briefcase } from 'lucide-react'

const GoalsTracker = () => {
  const goals = [
    {
      id: 1,
      title: 'Emergency Fund',
      target: 15000,
      current: 10200,
      icon: ShieldIcon,
      color: '#10b981',
      deadline: 'Dec 2024',
    },
    {
      id: 2,
      title: 'Dream Home Down Payment',
      target: 80000,
      current: 32500,
      icon: Home,
      color: '#3b82f6',
      deadline: 'Jun 2026',
    },
    {
      id: 3,
      title: 'New Car',
      target: 35000,
      current: 12800,
      icon: Car,
      color: '#f59e0b',
      deadline: 'Mar 2025',
    },
    {
      id: 4,
      title: 'World Trip',
      target: 20000,
      current: 8400,
      icon: Plane,
      color: '#ec4899',
      deadline: 'Aug 2025',
    },
    {
      id: 5,
      title: 'MBA Education',
      target: 60000,
      current: 15000,
      icon: GraduationCap,
      color: '#8b5cf6',
      deadline: 'Jan 2027',
    },
  ]

  return (
    <div className="space-y-4">
      {goals.map((goal, i) => {
        const percentage = Math.round((goal.current / goal.target) * 100)

        return (
          <motion.div
            key={goal.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            whileHover={{ scale: 1.02 }}
            className="p-3 rounded-lg bg-white/5 border border-white/5 hover:border-white/10 transition-all cursor-pointer"
          >
            <div className="flex items-center gap-3 mb-2">
              <div 
                className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: `${goal.color}15` }}
              >
                <goal.icon className="w-5 h-5" style={{ color: goal.color }} />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium text-white truncate">{goal.title}</h4>
                <p className="text-xs text-white/40">Target: ${goal.target.toLocaleString()} • {goal.deadline}</p>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-sm font-bold text-white">${goal.current.toLocaleString()}</p>
                <p className="text-xs" style={{ color: goal.color }}>{percentage}%</p>
              </div>
            </div>

            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{ backgroundColor: goal.color }}
                initial={{ width: 0 }}
                animate={{ width: `${percentage}%` }}
                transition={{ delay: 0.5 + i * 0.1, duration: 1, ease: 'easeOut' }}
              />
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}

const ShieldIcon = ({ className, style }) => (
  <svg className={className} style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
)

export default GoalsTracker
