const Database = require('better-sqlite3')
const fs = require('fs')
const path = require('path')

const DB_PATH = process.env.DB_PATH || path.join(__dirname, 'finanalytics.db')

function migrate() {
  console.log('\n╔══════════════════════════════════════════╗')
  console.log('║     FinAnalytics Database Migration      ║')
  console.log('╚══════════════════════════════════════════╝\n')

  try {
    const db = new Database(DB_PATH)

    // Enable WAL mode for better concurrency
    db.pragma('journal_mode = WAL')
    db.pragma('foreign_keys = ON')

    // Read and execute schema
    const schema = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8')
    const statements = schema.split(';').filter(s => s.trim())

    let executed = 0
    for (const statement of statements) {
      try {
        db.exec(statement)
        executed++
      } catch (err) {
        if (!err.message.includes('already exists')) {
          console.warn(`Warning: ${err.message}`)
        }
      }
    }

    // Create version table
    db.exec(`
      CREATE TABLE IF NOT EXISTS schema_migrations (
        version INTEGER PRIMARY KEY,
        applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        description TEXT
      )
    `)

    // Record migration
    const version = 1
    const existing = db.prepare('SELECT version FROM schema_migrations WHERE version = ?').get(version)
    if (!existing) {
      db.prepare('INSERT INTO schema_migrations (version, description) VALUES (?, ?)')
        .run(version, 'Initial schema creation')
    }

    // Verify tables
    const tables = db.prepare(`
      SELECT name FROM sqlite_master WHERE type='table' ORDER BY name
    `).all()

    console.log(`✅ Migration completed successfully`)
    console.log(`📊 Database: ${DB_PATH}`)
    console.log(`📋 Tables: ${tables.length} created`)
    console.log(`📄 Statements executed: ${executed}`)
    console.log(`\nTables:`)
    tables.forEach(t => console.log(`  • ${t.name}`))

    db.close()

    console.log('\n✨ Database is ready!\n')

  } catch (error) {
    console.error('❌ Migration failed:', error.message)
    process.exit(1)
  }
}

migrate()
