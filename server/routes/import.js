const express = require('express')
const router = express.Router()
const multer = require('multer')
const path = require('path')

const upload = multer({ 
  dest: 'uploads/',
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB
})

// Upload and process files
router.post('/upload', upload.array('files', 10), async (req, res) => {
  try {
    const files = req.files || []
    const results = []

    for (const file of files) {
      const ext = path.extname(file.originalname).toLowerCase()

      // Mock processing based on file type
      const result = {
        filename: file.originalname,
        size: file.size,
        type: ext,
        status: 'processed',
        transactionsExtracted: Math.floor(Math.random() * 50) + 10,
        confidence: Math.round(85 + Math.random() * 10),
        warnings: ext === '.pdf' ? ['Some text may be OCR-extracted'] : [],
      }

      results.push(result)
    }

    res.json({
      success: true,
      processed: results.length,
      results,
      totalTransactions: results.reduce((s, r) => s + r.transactionsExtracted, 0),
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Get import history
router.get('/history', (req, res) => {
  res.json({
    imports: [
      {
        id: 'imp_001',
        date: '2024-05-15T10:30:00Z',
        filename: 'bank_statement_may.pdf',
        type: 'pdf',
        transactions: 45,
        status: 'completed',
      },
      {
        id: 'imp_002',
        date: '2024-05-10T14:20:00Z',
        filename: 'transactions.csv',
        type: 'csv',
        transactions: 128,
        status: 'completed',
      },
    ]
  })
})

module.exports = router
