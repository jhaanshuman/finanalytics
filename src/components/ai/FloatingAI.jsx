import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Bot, X, Send, Mic, Sparkles, Brain, TrendingUp,
  AlertTriangle, Lightbulb, ChevronUp, Minimize2, Maximize2
} from 'lucide-react'

const FloatingAI = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      role: 'assistant',
      content: 'Hello! I am FinAI, your intelligent financial copilot. I can analyze your data, detect anomalies, predict trends, and answer any financial questions. How can I help you today?',
      timestamp: new Date(),
      type: 'greeting',
    }
  ])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  const generateAIResponse = (userMessage) => {
    const lowerMsg = userMessage.toLowerCase()

    if (lowerMsg.includes('overspend') || lowerMsg.includes('spending too much')) {
      return {
        content: `Based on your transaction analysis, you're overspending in these categories:

🍔 **Food & Dining**: $1,240 (42% above monthly average)
🛍️ **Shopping**: $890 (28% above average)
🎮 **Entertainment**: $340 (15% above average)

**Recommendation**: Set category budgets to reduce discretionary spending by 20%. This could save you ~$480/month.`,
        type: 'analysis',
        confidence: 94,
      }
    }

    if (lowerMsg.includes('unusual') || lowerMsg.includes('anomaly') || lowerMsg.includes('suspicious')) {
      return {
        content: `🔍 **Anomaly Detection Results**:

1. **May 15**: $1,200 at "Electronics Store" - 340% above category average
2. **May 12**: $450 at "Unknown Merchant XYZ" - New merchant, verify transaction
3. **May 10**: 3 identical $99 charges to "Streaming Service" - Possible duplicate billing

All flagged transactions require your review. Would you like me to initiate a dispute for any of these?`,
        type: 'alert',
        confidence: 91,
      }
    }

    if (lowerMsg.includes('compare') || lowerMsg.includes('last month') || lowerMsg.includes('6 month')) {
      return {
        content: `📊 **6-Month Comparison Analysis**:

| Metric | Current | Previous | Change |
|--------|---------|----------|--------|
| Income | $8,420 | $7,890 | +6.7% ↑ |
| Expenses | $5,230 | $5,890 | -11.2% ↓ |
| Savings | $3,190 | $2,000 | +59.5% ↑ |
| Net Worth | $52,400 | $48,200 | +8.7% ↑ |

**Key Insight**: Your savings rate improved dramatically. Keep this momentum!`,
        type: 'comparison',
        confidence: 98,
      }
    }

    if (lowerMsg.includes('predict') || lowerMsg.includes('forecast') || lowerMsg.includes('next quarter')) {
      return {
        content: `🔮 **Q3 2024 Financial Forecast** (AI Confidence: 87%)

**Projected Income**: $25,500 (+4.2%)
**Projected Expenses**: $15,800 (-2.1%)
**Projected Savings**: $9,700 (+18.3%)
**Projected Net Worth**: $58,200 (+11.1%)

**Risk Factors**:
• Subscription costs trending up (+$45/month)
• Seasonal utility increase expected (+$120)

**Opportunities**:
• Tax-loss harvesting potential: $2,400
• Cashback optimization: +$85/quarter`,
        type: 'prediction',
        confidence: 87,
      }
    }

    if (lowerMsg.includes('tax') || lowerMsg.includes('save tax') || lowerMsg.includes('deduction')) {
      return {
        content: `💰 **Tax Optimization Opportunities** (Potential Savings: $3,200)

1. **Max out 401(k)**: Contribute additional $4,200 → Save $1,260 in taxes
2. **HSA Contribution**: Max out $4,150 → Save $1,245 in taxes
3. **Charitable Donations**: $500 documented → Save $150 in taxes
4. **Home Office Deduction**: $1,200 estimated → Save $360 in taxes
5. **Student Loan Interest**: $2,400 paid → Save $720 in taxes

**Action Required**: You have until December 31st to make these contributions.`,
        type: 'tax',
        confidence: 96,
      }
    }

    if (lowerMsg.includes('budget') || lowerMsg.includes('plan')) {
      return {
        content: `📋 **AI-Generated Budget Plan**

**50/30/20 Rule Applied to your $8,420 income**:

🏠 **Needs (50%)**: $4,210
   - Rent: $2,400
   - Utilities: $280
   - Groceries: $520
   - Insurance: $340
   - Transport: $420
   - Healthcare: $250

🎯 **Wants (30%)**: $2,526
   - Dining: $600
   - Entertainment: $400
   - Shopping: $800
   - Travel: $400
   - Subscriptions: $326

💎 **Savings (20%)**: $1,684
   - Emergency Fund: $500
   - Investments: $684
   - Goals: $500

**Current Gap**: You're overspending on Wants by $340. I recommend reducing Dining and Shopping budgets.`,
        type: 'budget',
        confidence: 92,
      }
    }

    return {
      content: `I understand you're asking about: "${userMessage}"

As your AI Financial Copilot, I can help you with:

• 📊 Spending analysis and pattern detection
• 🔍 Anomaly and fraud detection
• 📈 Cash flow forecasting and predictions
• 💰 Tax optimization strategies
• 📋 Budget planning and recommendations
• 🎯 Financial goal tracking
• 📉 Investment insights
• 🔔 Smart alerts and notifications

Try asking me something specific like:
- "Where am I overspending?"
- "Show unusual transactions"
- "Compare last 6 months"
- "Predict next quarter"
- "Find tax optimization opportunities"`,
      type: 'help',
      confidence: 100,
    }
  }

  const handleSend = async () => {
    if (!input.trim()) return

    const userMsg = input.trim()
    setInput('')
    setMessages(prev => [...prev, {
      id: `user_${Date.now()}`,
      role: 'user',
      content: userMsg,
      timestamp: new Date(),
      type: 'user',
    }])

    setIsTyping(true)

    // Simulate AI processing
    await new Promise(r => setTimeout(r, 1500 + Math.random() * 1000))

    const response = generateAIResponse(userMsg)

    setMessages(prev => [...prev, {
      id: `ai_${Date.now()}`,
      role: 'assistant',
      content: response.content,
      timestamp: new Date(),
      type: response.type,
      confidence: response.confidence,
    }])

    setIsTyping(false)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const quickActions = [
    { label: 'Where am I overspending?', icon: TrendingUp },
    { label: 'Show unusual transactions', icon: AlertTriangle },
    { label: 'Compare last 6 months', icon: Sparkles },
    { label: 'Predict next quarter', icon: Brain },
  ]

  return (
    <>
      {/* Floating Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-gradient-to-br from-fin-accent to-fin-purple flex items-center justify-center shadow-lg shadow-fin-accent/30 hover:shadow-xl hover:shadow-fin-accent/40 transition-shadow"
          >
            <Bot className="w-6 h-6 text-white" />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-fin-emerald rounded-full border-2 border-fin-dark animate-pulse" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ 
              opacity: 1, 
              y: 0, 
              scale: 1,
              height: isMinimized ? 60 : 600,
            }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed bottom-6 right-6 z-50 w-96 bg-fin-panel/95 backdrop-blur-2xl rounded-2xl border border-white/10 shadow-2xl shadow-black/50 overflow-hidden flex flex-col"
            style={{ maxHeight: 'calc(100vh - 100px)' }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-white/5 bg-white/5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-fin-accent to-fin-purple flex items-center justify-center relative">
                  <Bot className="w-5 h-5 text-white" />
                  <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-fin-emerald rounded-full border-2 border-fin-panel" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white">FinAI Copilot</h3>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-fin-emerald rounded-full animate-pulse" />
                    <span className="text-xs text-fin-emerald">Online</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button 
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="p-1.5 rounded-lg hover:bg-white/10 text-white/40 hover:text-white/70 transition-all"
                >
                  {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
                </button>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded-lg hover:bg-white/10 text-white/40 hover:text-white/70 transition-all"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {!isMinimized && (
              <>
                {/* Messages */}
                <div className="flex-1 overflow-y-auto fin-scrollbar p-4 space-y-4">
                  {messages.map((msg, i) => (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i === messages.length - 1 ? 0 : 0 }}
                      className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-[85%] ${
                        msg.role === 'user' 
                          ? 'bg-fin-accent/20 border border-fin-accent/20 rounded-2xl rounded-tr-sm' 
                          : 'bg-white/5 border border-white/5 rounded-2xl rounded-tl-sm'
                      } p-3`}>
                        {msg.role === 'assistant' && msg.confidence && (
                          <div className="flex items-center gap-1.5 mb-2">
                            <Brain className="w-3 h-3 text-fin-purple" />
                            <span className="text-xs text-fin-purple">AI Confidence: {msg.confidence}%</span>
                          </div>
                        )}
                        <div className="text-sm text-white/90 whitespace-pre-line leading-relaxed">
                          {msg.content}
                        </div>
                        <p className="text-xs text-white/20 mt-2 text-right">
                          {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </motion.div>
                  ))}

                  {isTyping && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex justify-start"
                    >
                      <div className="bg-white/5 border border-white/5 rounded-2xl rounded-tl-sm p-3">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-fin-accent rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                          <div className="w-2 h-2 bg-fin-accent rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                          <div className="w-2 h-2 bg-fin-accent rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                          <span className="text-xs text-white/30 ml-1">Analyzing your financial data...</span>
                        </div>
                      </div>
                    </motion.div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Quick Actions */}
                {messages.length < 3 && (
                  <div className="px-4 pb-2 flex flex-wrap gap-2">
                    {quickActions.map((action, i) => (
                      <motion.button
                        key={i}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 + i * 0.1 }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                          setInput(action.label)
                          setTimeout(() => handleSend(), 100)
                        }}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/5 text-xs text-white/60 hover:text-white/90 hover:bg-white/10 hover:border-white/10 transition-all"
                      >
                        <action.icon className="w-3 h-3" />
                        {action.label}
                      </motion.button>
                    ))}
                  </div>
                )}

                {/* Input */}
                <div className="p-4 border-t border-white/5">
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => setIsListening(!isListening)}
                      className={`p-2 rounded-lg transition-all ${
                        isListening 
                          ? 'bg-fin-rose/20 text-fin-rose animate-pulse' 
                          : 'bg-white/5 text-white/40 hover:text-white/70 hover:bg-white/10'
                      }`}
                    >
                      <Mic className="w-4 h-4" />
                    </button>
                    <div className="flex-1 relative">
                      <input
                        ref={inputRef}
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Ask me anything about your finances..."
                        className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-white/30 focus:outline-none focus:border-fin-accent/30 focus:ring-1 focus:ring-fin-accent/10 transition-all"
                      />
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={handleSend}
                      disabled={!input.trim() || isTyping}
                      className={`p-2.5 rounded-xl transition-all ${
                        input.trim() && !isTyping
                          ? 'bg-fin-accent text-white hover:bg-fin-accent/80'
                          : 'bg-white/5 text-white/20 cursor-not-allowed'
                      }`}
                    >
                      <Send className="w-4 h-4" />
                    </motion.button>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default FloatingAI
