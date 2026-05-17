import React, { useMemo } from 'react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { format, subMonths, eachMonthOfInterval } from 'date-fns'

const NetWorthCard = () => {
  const data = useMemo(() => {
    const months = eachMonthOfInterval({
      start: subMonths(new Date(), 11),
      end: new Date(),
    })

    let netWorth = 45000

    return months.map(month => {
      const change = (Math.random() - 0.3) * 5000
      netWorth += change

      return {
        month: format(month, 'MMM yyyy'),
        value: Math.round(netWorth),
        assets: Math.round(netWorth * 1.3),
        liabilities: Math.round(netWorth * 0.3),
      }
    })
  }, [])

  const current = data[data.length - 1]
  const previous = data[data.length - 2]
  const change = current.value - previous.value
  const changePercent = ((change / previous.value) * 100).toFixed(2)

  const CustomTooltip = ({ active, payload }) => {
    if (!active || !payload) return null

    return (
      <div className="bg-fin-panel border border-white/10 rounded-lg p-3 shadow-xl">
        <p className="text-white/70 text-sm mb-1">{payload[0].payload.month}</p>
        <p className="text-white font-bold">${payload[0].value.toLocaleString()}</p>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-end justify-between mb-4">
        <div>
          <p className="text-3xl font-bold text-white">${current.value.toLocaleString()}</p>
          <div className="flex items-center gap-2 mt-1">
            <span className={`text-sm font-medium ${change >= 0 ? 'text-fin-emerald' : 'text-fin-rose'}`}>
              {change >= 0 ? '+' : ''}{changePercent}%
            </span>
            <span className="text-xs text-white/40">vs last month</span>
          </div>
        </div>
        <div className="text-right">
          <p className="text-xs text-white/40">Assets</p>
          <p className="text-sm text-fin-emerald font-medium">${current.assets.toLocaleString()}</p>
          <p className="text-xs text-white/40 mt-1">Liabilities</p>
          <p className="text-sm text-fin-rose font-medium">${current.liabilities.toLocaleString()}</p>
        </div>
      </div>

      <div className="flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 5, right: 5, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="netWorthGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#00d4ff" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#00d4ff" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
            <XAxis dataKey="month" stroke="rgba(255,255,255,0.15)" fontSize={10} tickLine={false} />
            <YAxis stroke="rgba(255,255,255,0.15)" fontSize={10} tickLine={false} tickFormatter={(v) => `$${(v/1000).toFixed(0)}k`} />
            <Tooltip content={<CustomTooltip />} />
            <Area 
              type="monotone" 
              dataKey="value" 
              stroke="#00d4ff" 
              strokeWidth={2}
              fill="url(#netWorthGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export default NetWorthCard
