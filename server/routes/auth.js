const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { v4: uuidv4 } = require('uuid')

const JWT_SECRET = process.env.JWT_SECRET || 'finanalytics-secret-key-change-in-production'

// Mock user database (replace with SQLite in production)
const users = new Map()

// Device fingerprinting middleware
const deviceFingerprint = (req, res, next) => {
  const fingerprint = req.headers['x-device-fingerprint'] || 
    `${req.ip}-${req.headers['user-agent']}-${Date.now()}`
  req.deviceFingerprint = fingerprint
  next()
}

// Register
router.post('/register', async (req, res) => {
  try {
    const { email, password, name } = req.body

    if (users.has(email)) {
      return res.status(400).json({ error: 'User already exists' })
    }

    const hashedPassword = await bcrypt.hash(password, 12)
    const userId = uuidv4()

    const user = {
      id: userId,
      email,
      name,
      password: hashedPassword,
      createdAt: new Date().toISOString(),
      role: 'user',
      plan: 'trial',
      deviceFingerprints: [],
      sessions: [],
    }

    users.set(email, user)

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    )

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        plan: user.plan,
      },
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Login
router.post('/login', deviceFingerprint, async (req, res) => {
  try {
    const { email, password } = req.body
    const user = users.get(email)

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' })
    }

    const isValid = await bcrypt.compare(password, user.password)
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid credentials' })
    }

    // Update device fingerprint
    if (!user.deviceFingerprints.includes(req.deviceFingerprint)) {
      user.deviceFingerprints.push(req.deviceFingerprint)
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email, fingerprint: req.deviceFingerprint },
      JWT_SECRET,
      { expiresIn: '7d' }
    )

    const refreshToken = jwt.sign(
      { userId: user.id, type: 'refresh' },
      JWT_SECRET,
      { expiresIn: '30d' }
    )

    user.sessions.push({
      token,
      refreshToken,
      deviceFingerprint: req.deviceFingerprint,
      createdAt: new Date().toISOString(),
      lastActive: new Date().toISOString(),
    })

    res.json({
      success: true,
      token,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        plan: user.plan,
      },
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Google OAuth mock
router.post('/google', deviceFingerprint, async (req, res) => {
  try {
    const { token, email, name, picture } = req.body

    let user = users.get(email)

    if (!user) {
      const userId = uuidv4()
      user = {
        id: userId,
        email,
        name,
        password: await bcrypt.hash(uuidv4(), 12),
        createdAt: new Date().toISOString(),
        role: 'user',
        plan: 'trial',
        deviceFingerprints: [req.deviceFingerprint],
        sessions: [],
        googleId: token,
        avatar: picture,
      }
      users.set(email, user)
    }

    const jwtToken = jwt.sign(
      { userId: user.id, email: user.email, fingerprint: req.deviceFingerprint },
      JWT_SECRET,
      { expiresIn: '7d' }
    )

    res.json({
      success: true,
      token: jwtToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        plan: user.plan,
        avatar: user.avatar,
      },
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Refresh token
router.post('/refresh', async (req, res) => {
  try {
    const { refreshToken } = req.body
    const decoded = jwt.verify(refreshToken, JWT_SECRET)

    const user = Array.from(users.values()).find(u => u.id === decoded.userId)
    if (!user) {
      return res.status(401).json({ error: 'Invalid refresh token' })
    }

    const newToken = jwt.sign(
      { userId: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    )

    res.json({ success: true, token: newToken })
  } catch (error) {
    res.status(401).json({ error: 'Invalid refresh token' })
  }
})

// Verify token middleware
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.replace('Bearer ', '')
  if (!token) {
    return res.status(401).json({ error: 'No token provided' })
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET)
    req.user = decoded
    next()
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' })
  }
}

// Get current user
router.get('/me', verifyToken, (req, res) => {
  const user = Array.from(users.values()).find(u => u.id === req.user.userId)
  if (!user) {
    return res.status(404).json({ error: 'User not found' })
  }

  res.json({
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    plan: user.plan,
    avatar: user.avatar,
  })
})

// Logout
router.post('/logout', verifyToken, (req, res) => {
  const user = Array.from(users.values()).find(u => u.id === req.user.userId)
  if (user) {
    user.sessions = user.sessions.filter(s => s.token !== req.headers.authorization?.replace('Bearer ', ''))
  }
  res.json({ success: true })
})

// License validation
router.post('/license/validate', verifyToken, (req, res) => {
  const { licenseKey } = req.body

  // Mock license validation
  const isValid = licenseKey && licenseKey.startsWith('FIN-')

  res.json({
    valid: isValid,
    plan: isValid ? 'enterprise' : 'trial',
    expiresAt: isValid ? '2025-12-31' : null,
    features: isValid 
      ? ['all', 'ai-copilot', 'advanced-analytics', 'multi-user', 'api-access']
      : ['basic', 'limited-ai'],
  })
})

module.exports = router
