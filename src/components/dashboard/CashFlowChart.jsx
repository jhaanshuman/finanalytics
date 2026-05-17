import React, { useMemo } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts'
import { format, subDays, eachDayOfInterval, isSameDay } from 'date-fns'

const CashFlowChart = ({ transactions }) => {
  const data = useMemo(() => {
    const days = eachDayOfInterval({
      start: subDays(new Date(), 30),
      end: new Date(),
    })

    return days.map(day => {
      const dayTransactions = transactions.filter(t => 
        isSameDay(new Date(t.date), day)
      )

      const income = dayTransactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0)

      const expenses = dayTransactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + Math.abs(t.amount), 0)

      return {
        date: format(day, 'MMM dd'),
        income: Math.round(income),
        expenses: Math.round(expenses),
        net: Math.round(income - expenses),
      }
    })
  }, [transactions])

  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload) return null

    return (
      <div className="bg-fin-panel border border-white/10 rounded-lg p-3 shadow-xl">
        <p className="text-white/70 text-sm mb-2">{label}</p>
        {payload.map((entry, i) => (
          <div key={i} className="flex items-center gap-2 text-sm">
            <div 
              className="w-2 h-2 rounded-full" 
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-white/50 capitalize">{entry.name}:</span>
            <span className="text-white font-medium">${entry.value.toLocaleString()}</span>
          </div>
        ))}
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
            <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
          </linearGradient>
          <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3}/>
            <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
        <XAxis 
          dataKey="date" 
          stroke="rgba(255,255,255,0.2)" 
          fontSize={12}
          tickLine={false}
        />
        <YAxis 
          stroke="rgba(255,255,255,0.2)" 
          fontSize={12}
          tickLine={false}
          tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
        />
        <Tooltip content={<CustomTooltip />} />
        <Area 
          type="monotone" 
          dataKey="income" 
          stroke="#10b981" 
          strokeWidth={2}
          fill="url(#incomeGradient)"
          name="income"
        />
        <Area 
          type="monotone" 
          dataKey="expenses" 
          stroke="#f43f5e" 
          strokeWidth={2}
          fill="url(#expenseGradient)"
          name="expenses"
        />
        <Line 
          type="monotone" 
          dataKey="net" 
          stroke="#00d4ff" 
          strokeWidth={2}
          strokeDasharray="5 5"
          dot={false}
          name="net"
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}

export default CashFlowChart
