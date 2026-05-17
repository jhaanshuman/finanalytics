const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
  res.json({
    theme: 'dark',
    accentColor: 'cyan',
    language: 'en',
    currency: 'USD',
    timezone: 'UTC',
    dateFormat: 'MM/DD/YYYY',
    numberFormat: '1,234.56',
    notifications: {
      email: true,
      push: true,
      sms: false,
    },
    privacy: {
      shareAnalytics: false,
      autoBackup: true,
      biometricAuth: true,
    },
  })
})

router.put('/', (req, res) => {
  res.json({ success: true, settings: req.body })
})

module.exports = router
