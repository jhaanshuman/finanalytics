const express = require('express')
const router = express.Router()
const { v4: uuidv4 } = require('uuid')

// Mock transaction database (replace with SQLite)
const transactions = new Map()

// Get all transactions with filters
router.get('/', (req, res) => {
  try {
    const { 
      category, type, dateFrom, dateTo, 
      minAmount, maxAmount, search, sortBy = 'date', 
      sortOrder = 'desc', page = 1, limit = 50 
    } = req.query

    let results = Array.from(transactions.values())

    // Apply filters
    if (category) results = results.filter(t => t.category === category)
    if (type) results = results.filter(t => t.type === type)
    if (dateFrom) results = results.filter(t => new Date(t.date) >= new Date(dateFrom))
    if (dateTo) results = results.filter(t => new Date(t.date) <= new Date(dateTo))
    if (minAmount) results = results.filter(t => Math.abs(t.amount) >= Number(minAmount))
    if (maxAmount) results = results.filter(t => Math.abs(t.amount) <= Number(maxAmount))
    if (search) {
      const q = search.toLowerCase()
      results = results.filter(t => 
        t.description?.toLowerCase().includes(q) ||
        t.merchant?.toLowerCase().includes(q) ||
        t.category?.toLowerCase().includes(q)
      )
    }

    // Sort
    results.sort((a, b) => {
      const aVal = a[sortBy]
      const bVal = b[sortBy]
      return sortOrder === 'asc' 
        ? (aVal > bVal ? 1 : -1)
        : (aVal < bVal ? 1 : -1)
    })

    // Paginate
    const start = (page - 1) * limit
    const paginated = results.slice(start, start + Number(limit))

    res.json({
      transactions: paginated,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total: results.length,
        pages: Math.ceil(results.length / limit),
      },
      stats: {
        totalIncome: results.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0),
        totalExpenses: results.filter(t => t.type === 'expense').reduce((s, t) => s + Math.abs(t.amount), 0),
        count: results.length,
      }
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Create transaction
router.post('/', (req, res) => {
  try {
    const transaction = {
      id: `txn_${uuidv4()}`,
      ...req.body,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    transactions.set(transaction.id, transaction)
    res.status(201).json({ success: true, transaction })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Update transaction
router.put('/:id', (req, res) => {
  try {
    const { id } = req.params
    const existing = transactions.get(id)
    if (!existing) {
      return res.status(404).json({ error: 'Transaction not found' })
    }

    const updated = {
      ...existing,
      ...req.body,
      id,
      updatedAt: new Date().toISOString(),
    }
    transactions.set(id, updated)
    res.json({ success: true, transaction: updated })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Delete transaction
router.delete('/:id', (req, res) => {
  try {
    const { id } = req.params
    if (!transactions.has(id)) {
      return res.status(404).json({ error: 'Transaction not found' })
    }
    transactions.delete(id)
    res.json({ success: true })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Bulk operations
router.post('/bulk/delete', (req, res) => {
  try {
    const { ids } = req.body
    let deleted = 0
    ids.forEach(id => {
      if (transactions.has(id)) {
        transactions.delete(id)
        deleted++
      }
    })
    res.json({ success: true, deleted })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// AI categorization
router.post('/categorize', (req, res) => {
  try {
    const { description, merchant } = req.body

    // Mock AI categorization
    const categories = {
      'restaurant|food|grocery|meal': 'food',
      'uber|taxi|gas|fuel|transport': 'transport',
      'amazon|shop|store|mall|purchase': 'shopping',
      'electric|water|gas|bill|utility': 'utilities',
      'doctor|hospital|pharmacy|health': 'healthcare',
      'netflix|spotify|movie|game|entertainment': 'entertainment',
      'salary|income|deposit|payment received': 'income',
      'invest|stock|crypto|dividend': 'investment',
      'school|course|book|education': 'education',
    }

    const text = `${description} ${merchant}`.toLowerCase()
    let category = 'other'

    for (const [pattern, cat] of Object.entries(categories)) {
      if (new RegExp(pattern).test(text)) {
        category = cat
        break
      }
    }

    res.json({
      category,
      confidence: Math.round(70 + Math.random() * 25),
      aiTags: [category, text.split(' ')[0]],
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

module.exports = router
