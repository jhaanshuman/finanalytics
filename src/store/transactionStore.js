import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useTransactionStore = create(
  persist(
    (set, get) => ({
      transactions: [],
      categories: [
        { id: 'income', name: 'Income', color: '#10b981', type: 'income' },
        { id: 'food', name: 'Food & Dining', color: '#f59e0b', type: 'expense' },
        { id: 'transport', name: 'Transportation', color: '#3b82f6', type: 'expense' },
        { id: 'shopping', name: 'Shopping', color: '#ec4899', type: 'expense' },
        { id: 'utilities', name: 'Utilities', color: '#8b5cf6', type: 'expense' },
        { id: 'healthcare', name: 'Healthcare', color: '#ef4444', type: 'expense' },
        { id: 'entertainment', name: 'Entertainment', color: '#06b6d4', type: 'expense' },
        { id: 'investment', name: 'Investment', color: '#84cc16', type: 'expense' },
        { id: 'education', name: 'Education', color: '#f97316', type: 'expense' },
        { id: 'other', name: 'Other', color: '#6b7280', type: 'expense' },
      ],
      filters: {},
      sortConfig: { key: 'date', direction: 'desc' },
      selectedTransactions: [],

      addTransaction: (transaction) => {
        const newTransaction = {
          ...transaction,
          id: `txn_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          aiTags: [],
          confidence: 1,
        }
        set(state => ({
          transactions: [newTransaction, ...state.transactions]
        }))
      },

      updateTransaction: (id, updates) => {
        set(state => ({
          transactions: state.transactions.map(t =>
            t.id === id ? { ...t, ...updates, updatedAt: new Date().toISOString() } : t
          )
        }))
      },

      deleteTransaction: (id) => {
        set(state => ({
          transactions: state.transactions.filter(t => t.id !== id)
        }))
      },

      bulkDelete: (ids) => {
        set(state => ({
          transactions: state.transactions.filter(t => !ids.includes(t.id))
        }))
      },

      setFilters: (filters) => set({ filters }),
      setSortConfig: (config) => set({ sortConfig: config }),

      toggleSelection: (id) => {
        set(state => ({
          selectedTransactions: state.selectedTransactions.includes(id)
            ? state.selectedTransactions.filter(sid => sid !== id)
            : [...state.selectedTransactions, id]
        }))
      },

      clearSelection: () => set({ selectedTransactions: [] }),

      importTransactions: (transactions) => {
        const newTransactions = transactions.map(t => ({
          ...t,
          id: `txn_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }))
        set(state => ({
          transactions: [...newTransactions, ...state.transactions]
        }))
      },

      getFilteredTransactions: () => {
        const { transactions, filters, sortConfig } = get()
        let filtered = [...transactions]

        if (filters.category) {
          filtered = filtered.filter(t => t.category === filters.category)
        }
        if (filters.type) {
          filtered = filtered.filter(t => t.type === filters.type)
        }
        if (filters.dateFrom) {
          filtered = filtered.filter(t => new Date(t.date) >= new Date(filters.dateFrom))
        }
        if (filters.dateTo) {
          filtered = filtered.filter(t => new Date(t.date) <= new Date(filters.dateTo))
        }
        if (filters.search) {
          const search = filters.search.toLowerCase()
          filtered = filtered.filter(t => 
            t.description?.toLowerCase().includes(search) ||
            t.merchant?.toLowerCase().includes(search) ||
            t.category?.toLowerCase().includes(search)
          )
        }
        if (filters.minAmount) {
          filtered = filtered.filter(t => Math.abs(t.amount) >= filters.minAmount)
        }
        if (filters.maxAmount) {
          filtered = filtered.filter(t => Math.abs(t.amount) <= filters.maxAmount)
        }

        filtered.sort((a, b) => {
          const aVal = a[sortConfig.key]
          const bVal = b[sortConfig.key]
          if (sortConfig.direction === 'asc') {
            return aVal > bVal ? 1 : -1
          }
          return aVal < bVal ? 1 : -1
        })

        return filtered
      },

      getStats: () => {
        const { transactions } = get()
        const income = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0)
        const expenses = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + Math.abs(t.amount), 0)

        return {
          totalIncome: income,
          totalExpenses: expenses,
          netWorth: income - expenses,
          transactionCount: transactions.length,
          avgTransaction: transactions.length > 0 ? (income + expenses) / transactions.length : 0,
        }
      },
    }),
    {
      name: 'finanalytics-transactions',
      partialize: (state) => ({
        transactions: state.transactions,
        categories: state.categories,
      }),
    }
  )
)
