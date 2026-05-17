import React, { useMemo } from 'react'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'
import { useTransactionStore } from '../../store/transactionStore'

const SpendingBreakdown = ({ transactions }) => {
  const { categories } = useTransactionStore()

  const data = useMemo(() => {
    const categoryTotals = {}

    transactions
      .filter(t => t.type === 'expense')
      .forEach(t => {
        categoryTotals[t.category] = (categoryTotals[t.category] || 0) + Math.abs(t.amount)
      })

    return Object.entries(categoryTotals)
      .map(([catId, amount]) => {
        const cat = categories.find(c => c.id === catId) || { name: catId, color: '#6b7280' }
        return {
          name: cat.name,
          value: Math.round(amount),
          color: cat.color,
        }
      })
      .sort((a, b) => b.value - a.value)
  }, [transactions, categories])

  const CustomTooltip = ({ active, payload }) => {
    if (!active || !payload?.length) return null
    const entry = payload[0]
    const total = data.reduce((sum, d) => sum + d.value, 0)
    const percentage = ((entry.value / total) * 100).toFixed(1)

    return (
      <div className="bg-fin-panel border border-white/10 rounded-lg p-3 shadow-xl">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.payload.color }} />
          <span className="text-white text-sm font-medium">{entry.name}</span>
        </div>
        <p className="text-white/70 text-sm">${entry.value.toLocaleString()} ({percentage}%)</p>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col">
      <ResponsiveContainer width="100%" height="60%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={90}
            paddingAngle={3}
            dataKey="value"
            stroke="none"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>

      <div className="flex-1 overflow-y-auto fin-scrollbar space-y-2">
        {data.map((item, i) => {
          const total = data.reduce((sum, d) => sum + d.value, 0)
          const percentage = ((item.value / total) * 100).toFixed(1)

          return (
            <div key={i} className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-all">
              <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }} />
              <div className="flex-1 min-w-0">
                <p className="text-sm text-white truncate">{item.name}</p>
                <div className="w-full h-1 bg-white/10 rounded-full mt-1">
                  <div 
                    className="h-full rounded-full transition-all duration-500"
                    style={{ 
                      width: `${percentage}%`, 
                      backgroundColor: item.color 
                    }}
                  />
                </div>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-sm text-white font-medium">${item.value.toLocaleString()}</p>
                <p className="text-xs text-white/40">{percentage}%</p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default SpendingBreakdown
