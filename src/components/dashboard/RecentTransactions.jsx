import React from 'react'
import { motion } from 'framer-motion'
import { useTransactionStore } from '../../store/transactionStore'
import { format } from 'date-fns'
import { ArrowUpRight, ArrowDownRight, MoreHorizontal, Star } from 'lucide-react'

const RecentTransactions = () => {
  const { transactions, categories, toggleSelection, selectedTransactions } = useTransactionStore()

  const recent = transactions
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 20)

  const getCategoryColor = (catId) => {
    const cat = categories.find(c => c.id === catId)
    return cat?.color || '#6b7280'
  }

  const getCategoryName = (catId) => {
    const cat = categories.find(c => c.id === catId)
    return cat?.name || catId
  }

  return (
    <div className="space-y-1">
      {recent.map((txn, i) => {
        const isIncome = txn.type === 'income'
        const isSelected = selectedTransactions.includes(txn.id)

        return (
          <motion.div
            key={txn.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.03 }}
            whileHover={{ backgroundColor: 'rgba(255,255,255,0.05)' }}
            onClick={() => toggleSelection(txn.id)}
            className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all group ${
              isSelected ? 'bg-fin-accent/10 border border-fin-accent/20' : 'border border-transparent'
            }`}
          >
            {/* Icon */}
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
              isIncome ? 'bg-fin-emerald/10' : 'bg-fin-rose/10'
            }`}>
              {isIncome ? (
                <ArrowUpRight className="w-5 h-5 text-fin-emerald" />
              ) : (
                <ArrowDownRight className="w-5 h-5 text-fin-rose" />
              )}
            </div>

            {/* Details */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="text-sm text-white font-medium truncate">{txn.description}</p>
                {txn.aiTags?.length > 0 && (
                  <span className="text-xs px-1.5 py-0.5 bg-fin-purple/20 text-fin-purple rounded">AI</span>
                )}
              </div>
              <div className="flex items-center gap-2 mt-0.5">
                <span 
                  className="text-xs px-2 py-0.5 rounded-full text-white/70"
                  style={{ backgroundColor: `${getCategoryColor(txn.category)}20`, color: getCategoryColor(txn.category) }}
                >
                  {getCategoryName(txn.category)}
                </span>
                <span className="text-xs text-white/30">{txn.merchant}</span>
              </div>
            </div>

            {/* Amount & Date */}
            <div className="text-right flex-shrink-0">
              <p className={`text-sm font-semibold ${isIncome ? 'text-fin-emerald' : 'text-white'}`}>
                {isIncome ? '+' : '-'}${Math.abs(txn.amount).toLocaleString()}
              </p>
              <p className="text-xs text-white/30">
                {format(new Date(txn.date), 'MMM dd')}
              </p>
            </div>

            {/* Actions */}
            <button className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-white/10 transition-all">
              <MoreHorizontal className="w-4 h-4 text-white/40" />
            </button>
          </motion.div>
        )
      })}
    </div>
  )
}

export default RecentTransactions
