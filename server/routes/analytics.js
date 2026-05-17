const express = require('express')
const router = express.Router()

// Get analytics summary
router.get('/summary', (req, res) => {
  try {
    const { period = '30d' } = req.query

    // Mock analytics data
    res.json({
      period,
      overview: {
        totalIncome: 84200,
        totalExpenses: 52300,
        netSavings: 31900,
        savingsRate: 37.9,
        transactionCount: 2456,
        avgTransaction: 55.20,
      },
      trends: {
        incomeChange: 6.7,
        expenseChange: -3.2,
        savingsChange: 18.3,
      },
      topCategories: [
        { name: 'Food & Dining', amount: 12400, percentage: 23.7, trend: 'up' },
        { name: 'Transportation', amount: 8900, percentage: 17.0, trend: 'stable' },
        { name: 'Shopping', amount: 7600, percentage: 14.5, trend: 'down' },
        { name: 'Utilities', amount: 5200, percentage: 9.9, trend: 'up' },
        { name: 'Entertainment', amount: 4100, percentage: 7.8, trend: 'stable' },
      ],
      predictions: {
        nextMonthIncome: 28500,
        nextMonthExpenses: 16800,
        nextMonthSavings: 11700,
        confidence: 87,
      },
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Get time-series data
router.get('/timeseries', (req, res) => {
  try {
    const { metric = 'cashflow', granularity = 'daily' } = req.query

    // Generate mock time series data
    const data = []
    const now = new Date()
    const days = granularity === 'daily' ? 30 : granularity === 'weekly' ? 12 : 12

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(now)
      if (granularity === 'daily') date.setDate(date.getDate() - i)
      else if (granularity === 'weekly') date.setDate(date.getDate() - i * 7)
      else date.setMonth(date.getMonth() - i)

      data.push({
        date: date.toISOString().split('T')[0],
        income: Math.round(2000 + Math.random() * 3000),
        expenses: Math.round(1500 + Math.random() * 2000),
        savings: Math.round(500 + Math.random() * 1500),
      })
    }

    res.json({ metric, granularity, data })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Get category breakdown
router.get('/categories', (req, res) => {
  try {
    res.json({
      categories: [
        { id: 'food', name: 'Food & Dining', amount: 12400, percentage: 23.7, color: '#f59e0b', transactions: 456 },
        { id: 'transport', name: 'Transportation', amount: 8900, percentage: 17.0, color: '#3b82f6', transactions: 234 },
        { id: 'shopping', name: 'Shopping', amount: 7600, percentage: 14.5, color: '#ec4899', transactions: 178 },
        { id: 'utilities', name: 'Utilities', amount: 5200, percentage: 9.9, color: '#8b5cf6', transactions: 89 },
        { id: 'healthcare', name: 'Healthcare', amount: 4100, percentage: 7.8, color: '#ef4444', transactions: 67 },
        { id: 'entertainment', name: 'Entertainment', amount: 4100, percentage: 7.8, color: '#06b6d4', transactions: 123 },
        { id: 'investment', name: 'Investment', amount: 3400, percentage: 6.5, color: '#84cc16', transactions: 45 },
        { id: 'education', name: 'Education', amount: 2800, percentage: 5.4, color: '#f97316', transactions: 34 },
        { id: 'other', name: 'Other', amount: 3800, percentage: 7.3, color: '#6b7280', transactions: 156 },
      ]
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Get AI insights
router.get('/insights', (req, res) => {
  try {
    res.json({
      insights: [
        {
          id: 1,
          type: 'prediction',
          title: 'Cash Flow Prediction',
          message: 'Based on your spending patterns, you are projected to save $2,400 next month.',
          confidence: 94,
          severity: 'info',
        },
        {
          id: 2,
          type: 'anomaly',
          title: 'Unusual Transaction',
          message: 'A $1,200 charge at Electronics Store is 340% above your monthly average.',
          confidence: 89,
          severity: 'warning',
        },
        {
          id: 3,
          type: 'optimization',
          title: 'Tax Optimization',
          message: 'You could save approximately $3,200 in taxes by maximizing retirement contributions.',
          confidence: 97,
          severity: 'success',
        },
        {
          id: 4,
          type: 'pattern',
          title: 'Subscription Creep',
          message: 'Monthly subscriptions grew from $127 to $247 over 6 months.',
          confidence: 99,
          severity: 'warning',
        },
      ]
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

module.exports = router
