const express = require('express')
const router = express.Router()

// AI Copilot chat endpoint
router.post('/chat', async (req, res) => {
  try {
    const { message, context = {} } = req.body

    // Mock AI response based on message content
    const lowerMsg = message.toLowerCase()
    let response = {
      content: '',
      type: 'general',
      confidence: 95,
      sources: [],
      actions: [],
    }

    if (lowerMsg.includes('overspend') || lowerMsg.includes('spending too much')) {
      response = {
        content: `Based on your transaction analysis, you're overspending in these categories:\n\n🍔 **Food & Dining**: $1,240 (42% above monthly average)\n🛍️ **Shopping**: $890 (28% above average)\n🎮 **Entertainment**: $340 (15% above average)\n\n**Recommendation**: Set category budgets to reduce discretionary spending by 20%. This could save you ~$480/month.`,
        type: 'analysis',
        confidence: 94,
        sources: ['transaction_history', 'category_analysis'],
        actions: [
          { label: 'Set Budget', action: 'set_budget' },
          { label: 'View Details', action: 'view_category' },
        ],
      }
    } else if (lowerMsg.includes('predict') || lowerMsg.includes('forecast')) {
      response = {
        content: `🔮 **Q3 2024 Financial Forecast** (AI Confidence: 87%)\n\n**Projected Income**: $25,500 (+4.2%)\n**Projected Expenses**: $15,800 (-2.1%)\n**Projected Savings**: $9,700 (+18.3%)\n**Projected Net Worth**: $58,200 (+11.1%)\n\n**Risk Factors**:\n• Subscription costs trending up (+$45/month)\n• Seasonal utility increase expected (+$120)\n\n**Opportunities**:\n• Tax-loss harvesting potential: $2,400\n• Cashback optimization: +$85/quarter`,
        type: 'prediction',
        confidence: 87,
        sources: ['historical_data', 'trend_analysis', 'seasonal_patterns'],
        actions: [
          { label: 'View Full Report', action: 'view_report' },
          { label: 'Adjust Budget', action: 'adjust_budget' },
        ],
      }
    } else {
      response = {
        content: `I understand you're asking about: "${message}"\n\nAs your AI Financial Copilot, I can help you with:\n\n• 📊 Spending analysis and pattern detection\n• 🔍 Anomaly and fraud detection\n• 📈 Cash flow forecasting and predictions\n• 💰 Tax optimization strategies\n• 📋 Budget planning and recommendations\n• 🎯 Financial goal tracking\n\nTry asking me something specific like:\n- "Where am I overspending?"\n- "Show unusual transactions"\n- "Compare last 6 months"\n- "Predict next quarter"`,
        type: 'help',
        confidence: 100,
        sources: [],
        actions: [
          { label: 'View Dashboard', action: 'navigate_dashboard' },
          { label: 'Get Started', action: 'show_tutorial' },
        ],
      }
    }

    res.json({
      success: true,
      response,
      processingTime: 1200,
      tokensUsed: 245,
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// AI categorization
router.post('/categorize', (req, res) => {
  try {
    const { description, merchant, amount } = req.body

    const patterns = {
      food: /restaurant|food|grocery|meal|dining|cafe|coffee|pizza|burger/,
      transport: /uber|taxi|gas|fuel|transport|transit|parking|toll/,
      shopping: /amazon|shop|store|mall|purchase|retail|clothing/,
      utilities: /electric|water|gas|bill|utility|internet|phone/,
      healthcare: /doctor|hospital|pharmacy|health|medical|dental/,
      entertainment: /netflix|spotify|movie|game|entertainment|theater/,
      income: /salary|income|deposit|payment received|wage/,
      investment: /invest|stock|crypto|dividend|brokerage/,
      education: /school|course|book|education|tuition|university/,
    }

    const text = `${description} ${merchant}`.toLowerCase()
    let category = 'other'
    let confidence = 50

    for (const [cat, pattern] of Object.entries(patterns)) {
      if (pattern.test(text)) {
        category = cat
        confidence = Math.round(75 + Math.random() * 20)
        break
      }
    }

    res.json({
      category,
      confidence,
      aiTags: [category, merchant?.toLowerCase()],
      suggestedCategory: category,
      reasoning: `Matched pattern for ${category} category`,
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Anomaly detection
router.post('/anomalies', (req, res) => {
  try {
    const { transactions = [] } = req.body

    // Mock anomaly detection
    const anomalies = [
      {
        id: 'anom_1',
        transactionId: 'txn_001',
        type: 'amount_spike',
        severity: 'high',
        description: 'Transaction amount is 340% above category average',
        confidence: 91,
        suggestedAction: 'review',
      },
      {
        id: 'anom_2',
        transactionId: 'txn_002',
        type: 'duplicate_risk',
        severity: 'medium',
        description: 'Similar transaction detected within 24 hours',
        confidence: 85,
        suggestedAction: 'verify',
      },
      {
        id: 'anom_3',
        transactionId: 'txn_003',
        type: 'new_merchant',
        severity: 'low',
        description: 'First transaction with this merchant',
        confidence: 78,
        suggestedAction: 'monitor',
      },
    ]

    res.json({ anomalies, totalScanned: transactions.length || 150 })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Smart reconciliation
router.post('/reconcile', (req, res) => {
  try {
    const { transactions, bankStatement } = req.body

    res.json({
      matched: Math.floor(Math.random() * 50) + 100,
      unmatched: Math.floor(Math.random() * 10) + 5,
      suggestions: [
        { transactionId: 'txn_001', suggestion: 'Match with bank entry #4521', confidence: 96 },
        { transactionId: 'txn_002', suggestion: 'Possible duplicate - verify', confidence: 88 },
      ],
      discrepancies: [
        { amount: 12.50, reason: 'Bank fee not recorded', type: 'fee' },
      ],
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

module.exports = router
