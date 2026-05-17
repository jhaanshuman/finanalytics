// FinAnalytics Utility Functions
// Designed, Created and Developed by Anshuman Jha
// Brainchild of Anshuman Kr Jha

/**
 * Format currency with proper locale and symbol
 */
export const formatCurrency = (amount, currency = 'USD', locale = 'en-US') => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)
}

/**
 * Format number with locale
 */
export const formatNumber = (num, locale = 'en-US', decimals = 0) => {
  return new Intl.NumberFormat(locale, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(num)
}

/**
 * Format percentage
 */
export const formatPercentage = (value, decimals = 1) => {
  return `${value >= 0 ? '+' : ''}${value.toFixed(decimals)}%`
}

/**
 * Format date with locale
 */
export const formatDate = (date, format = 'medium', locale = 'en-US') => {
  const d = new Date(date)
  return new Intl.DateTimeFormat(locale, {
    dateStyle: format,
  }).format(d)
}

/**
 * Format relative time (e.g., "2 hours ago")
 */
export const formatRelativeTime = (date, locale = 'en-US') => {
  const now = new Date()
  const d = new Date(date)
  const diff = now - d

  const seconds = Math.floor(diff / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)
  const weeks = Math.floor(days / 7)
  const months = Math.floor(days / 30)
  const years = Math.floor(days / 365)

  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' })

  if (years > 0) return rtf.format(-years, 'year')
  if (months > 0) return rtf.format(-months, 'month')
  if (weeks > 0) return rtf.format(-weeks, 'week')
  if (days > 0) return rtf.format(-days, 'day')
  if (hours > 0) return rtf.format(-hours, 'hour')
  if (minutes > 0) return rtf.format(-minutes, 'minute')
  return rtf.format(-seconds, 'second')
}

/**
 * Generate unique ID
 */
export const generateId = (prefix = '') => {
  const timestamp = Date.now().toString(36)
  const random = Math.random().toString(36).substr(2, 9)
  return `${prefix}${timestamp}${random}`
}

/**
 * Deep clone object
 */
export const deepClone = (obj) => {
  if (obj === null || typeof obj !== 'object') return obj
  if (obj instanceof Date) return new Date(obj.getTime())
  if (Array.isArray(obj)) return obj.map(deepClone)
  const cloned = {}
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      cloned[key] = deepClone(obj[key])
    }
  }
  return cloned
}

/**
 * Debounce function
 */
export const debounce = (fn, delay) => {
  let timeoutId
  return (...args) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => fn(...args), delay)
  }
}

/**
 * Throttle function
 */
export const throttle = (fn, limit) => {
  let inThrottle
  return (...args) => {
    if (!inThrottle) {
      fn(...args)
      inThrottle = true
      setTimeout(() => inThrottle = false, limit)
    }
  }
}

/**
 * Calculate CAGR (Compound Annual Growth Rate)
 */
export const calculateCAGR = (beginningValue, endingValue, years) => {
  if (beginningValue <= 0 || years <= 0) return 0
  return ((endingValue / beginningValue) ** (1 / years) - 1) * 100
}

/**
 * Calculate simple moving average
 */
export const calculateSMA = (data, period) => {
  if (data.length < period) return []
  const result = []
  for (let i = period - 1; i < data.length; i++) {
    const sum = data.slice(i - period + 1, i + 1).reduce((a, b) => a + b, 0)
    result.push(sum / period)
  }
  return result
}

/**
 * Calculate exponential moving average
 */
export const calculateEMA = (data, period) => {
  if (data.length < period) return []
  const multiplier = 2 / (period + 1)
  const result = [data.slice(0, period).reduce((a, b) => a + b, 0) / period]

  for (let i = period; i < data.length; i++) {
    result.push((data[i] - result[result.length - 1]) * multiplier + result[result.length - 1])
  }
  return result
}

/**
 * Calculate standard deviation
 */
export const calculateStdDev = (data) => {
  if (data.length === 0) return 0
  const mean = data.reduce((a, b) => a + b, 0) / data.length
  const squaredDiffs = data.map(value => (value - mean) ** 2)
  const avgSquaredDiff = squaredDiffs.reduce((a, b) => a + b, 0) / data.length
  return Math.sqrt(avgSquaredDiff)
}

/**
 * Detect outliers using IQR method
 */
export const detectOutliers = (data) => {
  if (data.length < 4) return []
  const sorted = [...data].sort((a, b) => a - b)
  const q1Index = Math.floor(sorted.length * 0.25)
  const q3Index = Math.floor(sorted.length * 0.75)
  const q1 = sorted[q1Index]
  const q3 = sorted[q3Index]
  const iqr = q3 - q1
  const lowerBound = q1 - 1.5 * iqr
  const upperBound = q3 + 1.5 * iqr

  return data.map((value, index) => ({
    index,
    value,
    isOutlier: value < lowerBound || value > upperBound,
  }))
}

/**
 * Group transactions by time period
 */
export const groupByPeriod = (transactions, period = 'month') => {
  const grouped = {}

  transactions.forEach(txn => {
    const date = new Date(txn.date)
    let key

    switch (period) {
      case 'day':
        key = date.toISOString().split('T')[0]
        break
      case 'week':
        const weekStart = new Date(date)
        weekStart.setDate(date.getDate() - date.getDay())
        key = weekStart.toISOString().split('T')[0]
        break
      case 'month':
        key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
        break
      case 'quarter':
        const quarter = Math.floor(date.getMonth() / 3) + 1
        key = `${date.getFullYear()}-Q${quarter}`
        break
      case 'year':
        key = String(date.getFullYear())
        break
      default:
        key = date.toISOString().split('T')[0]
    }

    if (!grouped[key]) {
      grouped[key] = []
    }
    grouped[key].push(txn)
  })

  return grouped
}

/**
 * Calculate financial health score
 */
export const calculateHealthScore = (metrics) => {
  const {
    savingsRate = 0,
    debtToIncome = 0,
    emergencyFundMonths = 0,
    investmentRatio = 0,
    expenseStability = 0,
  } = metrics

  // Weighted scoring (0-100)
  const scores = {
    savings: Math.min(savingsRate * 5, 25), // Max 25 points
    debt: Math.max(25 - debtToIncome * 2.5, 0), // Max 25 points
    emergency: Math.min(emergencyFundMonths * 5, 25), // Max 25 points
    investment: Math.min(investmentRatio * 2.5, 15), // Max 15 points
    stability: Math.min(expenseStability * 10, 10), // Max 10 points
  }

  const total = Object.values(scores).reduce((a, b) => a + b, 0)

  return {
    total: Math.round(total),
    breakdown: scores,
    grade: total >= 90 ? 'A+' : total >= 80 ? 'A' : total >= 70 ? 'B' : total >= 60 ? 'C' : 'D',
    status: total >= 70 ? 'healthy' : total >= 50 ? 'fair' : 'needs_attention',
  }
}

/**
 * Encrypt data (client-side)
 */
export const encryptData = async (data, key) => {
  const encoder = new TextEncoder()
  const dataBuffer = encoder.encode(JSON.stringify(data))

  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    encoder.encode(key.padEnd(32, '0').slice(0, 32)),
    { name: 'AES-GCM' },
    false,
    ['encrypt']
  )

  const iv = crypto.getRandomValues(new Uint8Array(12))
  const encrypted = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    cryptoKey,
    dataBuffer
  )

  return {
    iv: Array.from(iv),
    data: Array.from(new Uint8Array(encrypted)),
  }
}

/**
 * Decrypt data (client-side)
 */
export const decryptData = async (encrypted, key) => {
  const encoder = new TextEncoder()

  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    encoder.encode(key.padEnd(32, '0').slice(0, 32)),
    { name: 'AES-GCM' },
    false,
    ['decrypt']
  )

  const decrypted = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv: new Uint8Array(encrypted.iv) },
    cryptoKey,
    new Uint8Array(encrypted.data)
  )

  const decoder = new TextDecoder()
  return JSON.parse(decoder.decode(decrypted))
}

/**
 * Generate color palette for charts
 */
export const generateColorPalette = (count, baseHue = 200) => {
  const colors = []
  const step = 360 / count

  for (let i = 0; i < count; i++) {
    const hue = (baseHue + i * step) % 360
    colors.push(`hsl(${hue}, 70%, 55%)`)
  }

  return colors
}

/**
 * Parse natural language date queries
 */
export const parseNaturalDate = (query) => {
  const now = new Date()
  const lower = query.toLowerCase()

  if (lower.includes('today')) {
    return { from: now, to: now }
  }
  if (lower.includes('yesterday')) {
    const yesterday = new Date(now)
    yesterday.setDate(yesterday.getDate() - 1)
    return { from: yesterday, to: yesterday }
  }
  if (lower.includes('this week')) {
    const start = new Date(now)
    start.setDate(start.getDate() - start.getDay())
    return { from: start, to: now }
  }
  if (lower.includes('last week')) {
    const end = new Date(now)
    end.setDate(end.getDate() - end.getDay() - 1)
    const start = new Date(end)
    start.setDate(start.getDate() - 6)
    return { from: start, to: end }
  }
  if (lower.includes('this month')) {
    const start = new Date(now.getFullYear(), now.getMonth(), 1)
    return { from: start, to: now }
  }
  if (lower.includes('last month')) {
    const end = new Date(now.getFullYear(), now.getMonth(), 0)
    const start = new Date(now.getFullYear(), now.getMonth() - 1, 1)
    return { from: start, to: end }
  }
  if (lower.includes('this year')) {
    const start = new Date(now.getFullYear(), 0, 1)
    return { from: start, to: now }
  }
  if (lower.includes('last year')) {
    const start = new Date(now.getFullYear() - 1, 0, 1)
    const end = new Date(now.getFullYear() - 1, 11, 31)
    return { from: start, to: end }
  }

  // Default: last 30 days
  const start = new Date(now)
  start.setDate(start.getDate() - 30)
  return { from: start, to: now }
}

/**
 * Validate email format
 */
export const isValidEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

/**
 * Validate password strength
 */
export const validatePassword = (password) => {
  const checks = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /\d/.test(password),
    special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
  }

  const score = Object.values(checks).filter(Boolean).length

  return {
    isValid: score >= 4,
    score,
    strength: score <= 2 ? 'weak' : score <= 3 ? 'fair' : score <= 4 ? 'good' : 'strong',
    checks,
  }
}

/**
 * Generate device fingerprint
 */
export const generateDeviceFingerprint = () => {
  const components = [
    navigator.userAgent,
    navigator.language,
    screen.colorDepth,
    screen.width + 'x' + screen.height,
    new Date().getTimezoneOffset(),
    !!window.sessionStorage,
    !!window.localStorage,
    navigator.hardwareConcurrency,
  ]

  const str = components.join('###')
  let hash = 0

  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash
  }

  return Math.abs(hash).toString(36)
}

/**
 * Export data to CSV
 */
export const exportToCSV = (data, headers) => {
  const csvRows = [headers.join(',')]

  for (const row of data) {
    const values = headers.map(header => {
      const value = row[header]
      const escaped = String(value).replace(/"/g, '\"')
      return `"${escaped}"`
    })
    csvRows.push(values.join(','))
  }

  return csvRows.join('\n')
}

/**
 * Download file
 */
export const downloadFile = (content, filename, mimeType = 'text/plain') => {
  const blob = new Blob([content], { type: mimeType })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

/**
 * Read file as text
 */
export const readFileAsText = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => resolve(e.target.result)
    reader.onerror = (e) => reject(e)
    reader.readAsText(file)
  })
}

/**
 * Parse CSV text
 */
export const parseCSV = (text) => {
  const lines = text.trim().split('\n')
  const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''))

  return lines.slice(1).map(line => {
    const values = line.split(',').map(v => v.trim().replace(/^"|"$/g, ''))
    const obj = {}
    headers.forEach((header, i) => {
      obj[header] = values[i]
    })
    return obj
  })
}

/**
 * Memoize function
 */
export const memoize = (fn) => {
  const cache = new Map()
  return (...args) => {
    const key = JSON.stringify(args)
    if (cache.has(key)) return cache.get(key)
    const result = fn(...args)
    cache.set(key, result)
    return result
  }
}

/**
 * Sleep utility
 */
export const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms))

/**
 * Retry function with exponential backoff
 */
export const retry = async (fn, maxRetries = 3, delay = 1000) => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn()
    } catch (error) {
      if (i === maxRetries - 1) throw error
      await sleep(delay * (2 ** i))
    }
  }
}

/**
 * Chunk array
 */
export const chunk = (array, size) => {
  const chunks = []
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size))
  }
  return chunks
}

/**
 * Remove duplicates from array
 */
export const unique = (array, keyFn = (x) => x) => {
  const seen = new Set()
  return array.filter(item => {
    const key = keyFn(item)
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })
}

/**
 * Sort array by key
 */
export const sortBy = (array, key, direction = 'asc') => {
  return [...array].sort((a, b) => {
    const aVal = a[key]
    const bVal = b[key]
    if (aVal < bVal) return direction === 'asc' ? -1 : 1
    if (aVal > bVal) return direction === 'asc' ? 1 : -1
    return 0
  })
}

/**
 * Filter object by keys
 */
export const pick = (obj, keys) => {
  const result = {}
  keys.forEach(key => {
    if (key in obj) result[key] = obj[key]
  })
  return result
}

/**
 * Omit keys from object
 */
export const omit = (obj, keys) => {
  const result = { ...obj }
  keys.forEach(key => delete result[key])
  return result
}

/**
 * Merge objects deeply
 */
export const merge = (...objects) => {
  const result = {}
  objects.forEach(obj => {
    Object.keys(obj).forEach(key => {
      if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
        result[key] = merge(result[key] || {}, obj[key])
      } else {
        result[key] = obj[key]
      }
    })
  })
  return result
}
