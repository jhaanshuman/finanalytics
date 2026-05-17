const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const path = require('path')
const fs = require('fs')

const app = express()
const PORT = process.env.PORT || 3001

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}))

app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['app://.', 'file://', 'http://localhost:5173'] 
    : '*',
  credentials: true,
}))

app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ extended: true, limit: '50mb' }))

// Request logging
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`)
  next()
})

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
  })
})

// API Routes
app.use('/api/auth', require('./routes/auth'))
app.use('/api/transactions', require('./routes/transactions'))
app.use('/api/analytics', require('./routes/analytics'))
app.use('/api/ai', require('./routes/ai'))
app.use('/api/import', require('./routes/import'))
app.use('/api/export', require('./routes/export'))
app.use('/api/settings', require('./routes/settings'))

// Error handling
app.use((err, req, res, next) => {
  console.error('Error:', err)
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  })
})

// In production, serve static files
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../dist')))
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../dist/index.html'))
  })
}

app.listen(PORT, () => {
  console.log(`\n╔══════════════════════════════════════════╗`)
  console.log(`║     FinAnalytics Server v1.0.0           ║`)
  console.log(`║     Port: ${PORT}                          ║`)
  console.log(`║     Mode: ${process.env.NODE_ENV || 'development'}                    ║`)
  console.log(`╚══════════════════════════════════════════╝\n`)
})

module.exports = app
