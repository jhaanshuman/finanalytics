const Database = require('better-sqlite3')
const path = require('path')
const { v4: uuidv4 } = require('uuid')

const DB_PATH = process.env.DB_PATH || path.join(__dirname, 'finanalytics.db')

function seed() {
  console.log('\n╔══════════════════════════════════════════╗')
  console.log('║     FinAnalytics Database Seeding        ║')
  console.log('╚══════════════════════════════════════════╝\n')

  const db = new Database(DB_PATH)

  // Seed categories
  const categories = [
    { id: 'cat_income', name: 'Income', type: 'income', color: '#10b981', icon: 'trending-up', is_system: 1 },
    { id: 'cat_food', name: 'Food & Dining', type: 'expense', color: '#f59e0b', icon: 'utensils', is_system: 1 },
    { id: 'cat_transport', name: 'Transportation', type: 'expense', color: '#3b82f6', icon: 'car', is_system: 1 },
    { id: 'cat_shopping', name: 'Shopping', type: 'expense', color: '#ec4899', icon: 'shopping-bag', is_system: 1 },
    { id: 'cat_utilities', name: 'Utilities', type: 'expense', color: '#8b5cf6', icon: 'zap', is_system: 1 },
    { id: 'cat_healthcare', name: 'Healthcare', type: 'expense', color: '#ef4444', icon: 'heart', is_system: 1 },
    { id: 'cat_entertainment', name: 'Entertainment', type: 'expense', color: '#06b6d4', icon: 'film', is_system: 1 },
    { id: 'cat_investment', name: 'Investment', type: 'expense', color: '#84cc16', icon: 'trending-up', is_system: 1 },
    { id: 'cat_education', name: 'Education', type: 'expense', color: '#f97316', icon: 'book', is_system: 1 },
    { id: 'cat_other', name: 'Other', type: 'expense', color: '#6b7280', icon: 'more-horizontal', is_system: 1 },
  ]

  const insertCategory = db.prepare(`
    INSERT OR IGNORE INTO categories (id, name, type, color, icon, is_system, sort_order)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `)

  categories.forEach((cat, i) => {
    insertCategory.run(cat.id, cat.name, cat.type, cat.color, cat.icon, cat.is_system, i)
  })

  console.log(`✅ Seeded ${categories.length} categories`)

  // Seed sample transactions
  const merchants = ['Amazon', 'Uber', 'Netflix', 'Spotify', 'Whole Foods', 'Shell', 'Starbucks', 'CVS', 'Target', 'Apple']
  const descriptions = ['Monthly subscription', 'Ride to office', 'Grocery shopping', 'Gas fill-up', 'Coffee break', 'Pharmacy', 'Online purchase']

  const insertTransaction = db.prepare(`
    INSERT INTO transactions (
      id, user_id, date, amount, type, category, description, merchant,
      status, currency, ai_confidence, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `)

  const now = new Date()
  let seeded = 0

  for (let i = 0; i < 100; i++) {
    const daysAgo = Math.floor(Math.random() * 90)
    const date = new Date(now)
    date.setDate(date.getDate() - daysAgo)

    const isIncome = Math.random() > 0.7
    const category = isIncome ? 'cat_income' : categories[Math.floor(Math.random() * (categories.length - 1)) + 1].id
    const amount = isIncome 
      ? Math.floor(Math.random() * 5000) + 2000
      : Math.floor(Math.random() * 500) + 20

    insertTransaction.run(
      `txn_${uuidv4()}`,
      'user_default',
      date.toISOString(),
      isIncome ? amount : -amount,
      isIncome ? 'income' : 'expense',
      category,
      descriptions[Math.floor(Math.random() * descriptions.length)],
      merchants[Math.floor(Math.random() * merchants.length)],
      'completed',
      'USD',
      Math.round(85 + Math.random() * 14),
      date.toISOString(),
      date.toISOString()
    )
    seeded++
  }

  console.log(`✅ Seeded ${seeded} sample transactions`)

  // Seed goals
  const goals = [
    { id: uuidv4(), name: 'Emergency Fund', target: 15000, current: 10200, deadline: '2024-12-31', priority: 'high', color: '#10b981' },
    { id: uuidv4(), name: 'Dream Home', target: 80000, current: 32500, deadline: '2026-06-30', priority: 'high', color: '#3b82f6' },
    { id: uuidv4(), name: 'New Car', target: 35000, current: 12800, deadline: '2025-03-31', priority: 'medium', color: '#f59e0b' },
  ]

  const insertGoal = db.prepare(`
    INSERT OR IGNORE INTO goals (id, user_id, name, target_amount, current_amount, deadline, priority, color, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `)

  goals.forEach(goal => {
    insertGoal.run(goal.id, 'user_default', goal.name, goal.target, goal.current, goal.deadline, goal.priority, goal.color, 'active')
  })

  console.log(`✅ Seeded ${goals.length} financial goals`)

  db.close()

  console.log('\n✨ Database seeding completed!\n')
}

seed()
