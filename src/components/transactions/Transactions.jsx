import React, { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Sidebar from '../Sidebar'
import { useTransactionStore } from '../../store/transactionStore'
import { useAppStore } from '../../store/appStore'
import { format, parseISO } from 'date-fns'
import {
  Search, Filter, Plus, Download, Upload, Trash2, Edit3,
  ArrowUpRight, ArrowDownRight, Star, Tag, Calendar,
  ChevronDown, X, Check, MoreHorizontal, SlidersHorizontal,
  FileSpreadsheet, FileText, Camera, Mic, Brain, Sparkles
} from 'lucide-react'

const Transactions = () => {
  const { 
    transactions, 
    categories, 
    filters, 
    setFilters, 
    sortConfig, 
    setSortConfig,
    selectedTransactions,
    toggleSelection,
    clearSelection,
    deleteTransaction,
    bulkDelete,
    getFilteredTransactions,
    getStats
  } = useTransactionStore()

  const { sidebarCollapsed, addNotification } = useAppStore()
  const [showFilters, setShowFilters] = useState(false)
  const [showImport, setShowImport] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [editingId, setEditingId] = useState(null)

  const filteredTransactions = useMemo(() => {
    let filtered = getFilteredTransactions()
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      filtered = filtered.filter(t => 
        t.description?.toLowerCase().includes(q) ||
        t.merchant?.toLowerCase().includes(q) ||
        t.category?.toLowerCase().includes(q) ||
        t.amount?.toString().includes(q)
      )
    }
    return filtered
  }, [transactions, filters, sortConfig, searchQuery])

  const stats = getStats()

  const handleBulkDelete = () => {
    if (selectedTransactions.length === 0) return
    bulkDelete(selectedTransactions)
    clearSelection()
    addNotification({ 
      type: 'success', 
      title: 'Deleted', 
      message: `${selectedTransactions.length} transactions removed` 
    })
  }

  const handleExport = (format) => {
    addNotification({ 
      type: 'info', 
      title: 'Export Started', 
      message: `Exporting ${filteredTransactions.length} transactions as ${format.toUpperCase()}` 
    })
  }

  const getCategoryColor = (catId) => {
    const cat = categories.find(c => c.id === catId)
    return cat?.color || '#6b7280'
  }

  const getCategoryName = (catId) => {
    const cat = categories.find(c => c.id === catId)
    return cat?.name || catId
  }

  return (
    <div className="flex h-screen bg-fin-dark overflow-hidden">
      <Sidebar />

      <main className={`flex-1 flex flex-col overflow-hidden ${sidebarCollapsed ? '' : ''}`}>
        {/* Header */}
        <header className="h-16 flex items-center justify-between px-6 border-b border-white/5 bg-fin-panel/50 backdrop-blur-xl">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-bold text-white">Transactions</h1>
            <span className="text-xs px-2 py-1 bg-white/5 text-white/40 rounded-lg">
              {filteredTransactions.length.toLocaleString()} records
            </span>
          </div>

          <div className="flex items-center gap-2">
            {selectedTransactions.length > 0 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center gap-2 px-3 py-1.5 bg-fin-accent/10 border border-fin-accent/20 rounded-lg"
              >
                <span className="text-sm text-fin-accent">{selectedTransactions.length} selected</span>
                <button 
                  onClick={clearSelection}
                  className="text-white/40 hover:text-white/70"
                >
                  <X className="w-4 h-4" />
                </button>
                <button 
                  onClick={handleBulkDelete}
                  className="text-fin-rose hover:text-fin-rose/70"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </motion.div>
            )}

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                showFilters 
                  ? 'bg-fin-accent/20 text-fin-accent border border-fin-accent/20' 
                  : 'bg-white/5 text-white/50 hover:text-white/70 hover:bg-white/10 border border-transparent'
              }`}
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filters
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowImport(!showImport)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 text-white/50 hover:text-white/70 hover:bg-white/10 text-sm font-medium transition-all border border-transparent"
            >
              <Upload className="w-4 h-4" />
              Import
            </motion.button>

            <div className="relative group">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 text-white/50 hover:text-white/70 hover:bg-white/10 text-sm font-medium transition-all border border-transparent"
              >
                <Download className="w-4 h-4" />
                Export
              </motion.button>

              <div className="absolute right-0 top-full mt-2 w-48 bg-fin-panel border border-white/10 rounded-xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                <div className="p-2 space-y-1">
                  {['csv', 'excel', 'pdf', 'json'].map(fmt => (
                    <button
                      key={fmt}
                      onClick={() => handleExport(fmt)}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-white/70 hover:bg-white/5 hover:text-white transition-all capitalize"
                    >
                      <FileText className="w-4 h-4" />
                      Export as {fmt}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-fin-accent/20 text-fin-accent hover:bg-fin-accent/30 text-sm font-medium transition-all border border-fin-accent/20"
            >
              <Plus className="w-4 h-4" />
              Add Transaction
            </motion.button>
          </div>
        </header>

        {/* Search Bar */}
        <div className="px-6 py-3 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search transactions, merchants, amounts, categories... (AI-powered semantic search)"
                className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/5 rounded-xl text-sm text-white placeholder-white/30 focus:outline-none focus:border-fin-accent/30 focus:ring-1 focus:ring-fin-accent/10 transition-all"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/70"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2.5 rounded-xl bg-white/5 text-white/40 hover:text-white/70 hover:bg-white/10 transition-all border border-white/5"
            >
              <Mic className="w-5 h-5" />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2.5 rounded-xl bg-white/5 text-white/40 hover:text-white/70 hover:bg-white/10 transition-all border border-white/5"
            >
              <Camera className="w-5 h-5" />
            </motion.button>
          </div>
        </div>

        {/* Filters Panel */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden border-b border-white/5"
            >
              <div className="px-6 py-4 grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs text-white/40 mb-1.5">Category</label>
                  <select 
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-fin-accent/30"
                    onChange={(e) => setFilters({ ...filters, category: e.target.value || undefined })}
                  >
                    <option value="">All Categories</option>
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-white/40 mb-1.5">Type</label>
                  <select 
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-fin-accent/30"
                    onChange={(e) => setFilters({ ...filters, type: e.target.value || undefined })}
                  >
                    <option value="">All Types</option>
                    <option value="income">Income</option>
                    <option value="expense">Expense</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-white/40 mb-1.5">Date From</label>
                  <input 
                    type="date" 
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-fin-accent/30"
                    onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value || undefined })}
                  />
                </div>
                <div>
                  <label className="block text-xs text-white/40 mb-1.5">Amount Range</label>
                  <div className="flex items-center gap-2">
                    <input 
                      type="number" 
                      placeholder="Min"
                      className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder-white/30 focus:outline-none focus:border-fin-accent/30"
                      onChange={(e) => setFilters({ ...filters, minAmount: e.target.value ? Number(e.target.value) : undefined })}
                    />
                    <span className="text-white/30">-</span>
                    <input 
                      type="number" 
                      placeholder="Max"
                      className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder-white/30 focus:outline-none focus:border-fin-accent/30"
                      onChange={(e) => setFilters({ ...filters, maxAmount: e.target.value ? Number(e.target.value) : undefined })}
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Import Panel */}
        <AnimatePresence>
          {showImport && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden border-b border-white/5"
            >
              <div className="px-6 py-6">
                <div className="border-2 border-dashed border-white/10 rounded-2xl p-8 text-center hover:border-fin-accent/30 hover:bg-fin-accent/5 transition-all cursor-pointer">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-fin-accent/10 flex items-center justify-center">
                    <Upload className="w-8 h-8 text-fin-accent" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">Drop files here or click to upload</h3>
                  <p className="text-sm text-white/40 mb-4">
                    Supports PDF, Excel, CSV, XML, JSON, Screenshots, OCR documents, Bank statements, and more
                  </p>
                  <div className="flex items-center justify-center gap-2 flex-wrap">
                    {['PDF', 'Excel', 'CSV', 'XML', 'JSON', 'OCR', 'Bank'].map(fmt => (
                      <span key={fmt} className="px-2 py-1 bg-white/5 rounded text-xs text-white/40 border border-white/5">
                        {fmt}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Table */}
        <div className="flex-1 overflow-auto fin-scrollbar">
          <table className="w-full">
            <thead className="sticky top-0 bg-fin-panel/95 backdrop-blur-xl z-10">
              <tr className="border-b border-white/5">
                <th className="px-6 py-3 text-left">
                  <button 
                    onClick={() => {
                      if (selectedTransactions.length === filteredTransactions.length) {
                        clearSelection()
                      } else {
                        filteredTransactions.forEach(t => {
                          if (!selectedTransactions.includes(t.id)) {
                            toggleSelection(t.id)
                          }
                        })
                      }
                    }}
                    className="text-white/30 hover:text-white/70 transition-all"
                  >
                    {selectedTransactions.length === filteredTransactions.length && filteredTransactions.length > 0 ? (
                      <Check className="w-4 h-4 text-fin-accent" />
                    ) : (
                      <div className="w-4 h-4 border border-white/20 rounded" />
                    )}
                  </button>
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-white/40 uppercase tracking-wider">Date</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-white/40 uppercase tracking-wider">Description</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-white/40 uppercase tracking-wider">Category</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-white/40 uppercase tracking-wider">Merchant</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-white/40 uppercase tracking-wider">Amount</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-white/40 uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-white/40 uppercase tracking-wider">AI</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-white/40 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.map((txn, i) => {
                const isIncome = txn.type === 'income'
                const isSelected = selectedTransactions.includes(txn.id)
                const catColor = getCategoryColor(txn.category)

                return (
                  <motion.tr
                    key={txn.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: Math.min(i * 0.01, 0.5) }}
                    className={`border-b border-white/5 hover:bg-white/5 transition-all group ${
                      isSelected ? 'bg-fin-accent/5' : ''
                    }`}
                  >
                    <td className="px-6 py-3">
                      <button 
                        onClick={() => toggleSelection(txn.id)}
                        className="text-white/30 hover:text-white/70 transition-all"
                      >
                        {isSelected ? (
                          <Check className="w-4 h-4 text-fin-accent" />
                        ) : (
                          <div className="w-4 h-4 border border-white/20 rounded group-hover:border-white/40" />
                        )}
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-sm text-white/70">{format(parseISO(txn.date), 'MMM dd')}</div>
                      <div className="text-xs text-white/30">{format(parseISO(txn.date), 'yyyy')}</div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                          isIncome ? 'bg-fin-emerald/10' : 'bg-fin-rose/10'
                        }`}>
                          {isIncome ? (
                            <ArrowUpRight className="w-4 h-4 text-fin-emerald" />
                          ) : (
                            <ArrowDownRight className="w-4 h-4 text-fin-rose" />
                          )}
                        </div>
                        <div>
                          <div className="text-sm text-white font-medium">{txn.description}</div>
                          <div className="text-xs text-white/30">{format(parseISO(txn.date), 'h:mm a')}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span 
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium"
                        style={{ 
                          backgroundColor: `${catColor}15`,
                          color: catColor 
                        }}
                      >
                        <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: catColor }} />
                        {getCategoryName(txn.category)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm text-white/60">{txn.merchant}</span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className={`text-sm font-semibold ${isIncome ? 'text-fin-emerald' : 'text-white'}`}>
                        {isIncome ? '+' : '-'}${Math.abs(txn.amount).toLocaleString()}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-fin-emerald/10 text-fin-emerald">
                        {txn.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      {txn.aiTags?.length > 0 ? (
                        <div className="flex items-center justify-center gap-1">
                          <Brain className="w-4 h-4 text-fin-purple" />
                          <span className="text-xs text-fin-purple">{txn.confidence}%</span>
                        </div>
                      ) : (
                        <span className="text-xs text-white/20">-</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-all">
                        <button className="p-1.5 rounded-lg hover:bg-white/10 text-white/40 hover:text-white/70 transition-all">
                          <Star className="w-4 h-4" />
                        </button>
                        <button className="p-1.5 rounded-lg hover:bg-white/10 text-white/40 hover:text-white/70 transition-all">
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => deleteTransaction(txn.id)}
                          className="p-1.5 rounded-lg hover:bg-fin-rose/10 text-white/40 hover:text-fin-rose transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                )
              })}
            </tbody>
          </table>

          {filteredTransactions.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-4">
                <Search className="w-8 h-8 text-white/20" />
              </div>
              <p className="text-white/40 text-lg font-medium">No transactions found</p>
              <p className="text-white/20 text-sm mt-1">Try adjusting your filters or import new data</p>
            </div>
          )}
        </div>

        {/* Footer Stats */}
        <div className="h-12 flex items-center justify-between px-6 border-t border-white/5 bg-fin-panel/30">
          <div className="flex items-center gap-4 text-xs text-white/30">
            <span>Total: {stats.transactionCount.toLocaleString()}</span>
            <span>Income: <span className="text-fin-emerald">${stats.totalIncome.toLocaleString()}</span></span>
            <span>Expenses: <span className="text-fin-rose">${stats.totalExpenses.toLocaleString()}</span></span>
            <span>Net: <span className={stats.netWorth >= 0 ? 'text-fin-accent' : 'text-fin-rose'}>${stats.netWorth.toLocaleString()}</span></span>
          </div>
          <div className="flex items-center gap-2">
            <button className="text-xs text-white/30 hover:text-white/60 px-2 py-1 rounded hover:bg-white/5 transition-all">
              Previous
            </button>
            <span className="text-xs text-white/30">Page 1 of 1</span>
            <button className="text-xs text-white/30 hover:text-white/60 px-2 py-1 rounded hover:bg-white/5 transition-all">
              Next
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}

export default Transactions
