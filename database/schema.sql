-- FinAnalytics Database Schema
-- SQLite / PostgreSQL compatible
-- Designed by Anshuman Jha

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    name TEXT,
    avatar TEXT,
    role TEXT DEFAULT 'user',
    plan TEXT DEFAULT 'trial',
    license_key TEXT,
    license_status TEXT DEFAULT 'trial',
    license_expires_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login_at TIMESTAMP,
    device_fingerprint TEXT,
    preferences TEXT, -- JSON
    is_active BOOLEAN DEFAULT 1,
    is_verified BOOLEAN DEFAULT 0
);

-- Sessions table
CREATE TABLE IF NOT EXISTS sessions (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    token TEXT NOT NULL,
    refresh_token TEXT,
    device_fingerprint TEXT,
    ip_address TEXT,
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP,
    last_active_at TIMESTAMP,
    is_valid BOOLEAN DEFAULT 1,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Transactions table
CREATE TABLE IF NOT EXISTS transactions (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    date TIMESTAMP NOT NULL,
    amount REAL NOT NULL,
    type TEXT NOT NULL, -- 'income', 'expense', 'transfer'
    category TEXT,
    subcategory TEXT,
    description TEXT,
    merchant TEXT,
    account_id TEXT,
    status TEXT DEFAULT 'completed', -- 'pending', 'completed', 'cancelled', 'disputed'
    currency TEXT DEFAULT 'USD',
    exchange_rate REAL DEFAULT 1.0,
    tags TEXT, -- JSON array
    ai_tags TEXT, -- JSON array
    ai_confidence REAL,
    ai_category_suggestion TEXT,
    is_recurring BOOLEAN DEFAULT 0,
    recurring_pattern TEXT,
    parent_id TEXT,
    split_from_id TEXT,
    notes TEXT,
    attachments TEXT, -- JSON array of file paths
    location TEXT, -- JSON {lat, lng, address}
    receipt_data TEXT, -- JSON OCR data
    bank_reference TEXT,
    imported_from TEXT,
    import_batch_id TEXT,
    is_duplicate BOOLEAN DEFAULT 0,
    duplicate_of_id TEXT,
    is_flagged BOOLEAN DEFAULT 0,
    flag_reason TEXT,
    is_favorite BOOLEAN DEFAULT 0,
    is_pinned BOOLEAN DEFAULT 0,
    color_tag TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (parent_id) REFERENCES transactions(id),
    FOREIGN KEY (duplicate_of_id) REFERENCES transactions(id)
);

-- Categories table
CREATE TABLE IF NOT EXISTS categories (
    id TEXT PRIMARY KEY,
    user_id TEXT,
    name TEXT NOT NULL,
    type TEXT NOT NULL, -- 'income', 'expense', 'both'
    color TEXT,
    icon TEXT,
    parent_id TEXT,
    budget_amount REAL,
    budget_period TEXT, -- 'daily', 'weekly', 'monthly', 'yearly'
    is_system BOOLEAN DEFAULT 0,
    is_active BOOLEAN DEFAULT 1,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (parent_id) REFERENCES categories(id)
);

-- Accounts table
CREATE TABLE IF NOT EXISTS accounts (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    name TEXT NOT NULL,
    type TEXT NOT NULL, -- 'checking', 'savings', 'credit', 'investment', 'loan', 'cash', 'crypto', 'other'
    institution TEXT,
    account_number_masked TEXT,
    currency TEXT DEFAULT 'USD',
    balance REAL DEFAULT 0,
    credit_limit REAL,
    interest_rate REAL,
    opening_date TIMESTAMP,
    is_active BOOLEAN DEFAULT 1,
    is_primary BOOLEAN DEFAULT 0,
    sync_enabled BOOLEAN DEFAULT 0,
    sync_provider TEXT,
    last_sync_at TIMESTAMP,
    metadata TEXT, -- JSON
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Budgets table
CREATE TABLE IF NOT EXISTS budgets (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    name TEXT NOT NULL,
    period TEXT NOT NULL, -- 'monthly', 'quarterly', 'yearly'
    start_date TIMESTAMP,
    end_date TIMESTAMP,
    total_budget REAL,
    currency TEXT DEFAULT 'USD',
    is_active BOOLEAN DEFAULT 1,
    alert_threshold REAL DEFAULT 0.8, -- Alert at 80% of budget
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Budget items table
CREATE TABLE IF NOT EXISTS budget_items (
    id TEXT PRIMARY KEY,
    budget_id TEXT NOT NULL,
    category_id TEXT NOT NULL,
    allocated_amount REAL NOT NULL,
    spent_amount REAL DEFAULT 0,
    alert_threshold REAL,
    is_essential BOOLEAN DEFAULT 0,
    FOREIGN KEY (budget_id) REFERENCES budgets(id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES categories(id)
);

-- Goals table
CREATE TABLE IF NOT EXISTS goals (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    target_amount REAL NOT NULL,
    current_amount REAL DEFAULT 0,
    currency TEXT DEFAULT 'USD',
    deadline TIMESTAMP,
    priority TEXT DEFAULT 'medium', -- 'low', 'medium', 'high', 'critical'
    category TEXT,
    status TEXT DEFAULT 'active', -- 'active', 'completed', 'paused', 'cancelled'
    color TEXT,
    icon TEXT,
    auto_contribute BOOLEAN DEFAULT 0,
    auto_contribute_amount REAL,
    auto_contribute_frequency TEXT, -- 'daily', 'weekly', 'monthly'
    milestones TEXT, -- JSON array
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Import batches table
CREATE TABLE IF NOT EXISTS import_batches (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    filename TEXT,
    file_type TEXT,
    file_size INTEGER,
    source TEXT, -- 'manual', 'bank_sync', 'api', 'email'
    status TEXT DEFAULT 'processing', -- 'processing', 'completed', 'failed', 'partial'
    total_records INTEGER DEFAULT 0,
    processed_records INTEGER DEFAULT 0,
    failed_records INTEGER DEFAULT 0,
    duplicate_records INTEGER DEFAULT 0,
    confidence_avg REAL,
    processing_time_ms INTEGER,
    error_log TEXT,
    metadata TEXT, -- JSON
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- AI memory / embeddings table
CREATE TABLE IF NOT EXISTS ai_memory (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    type TEXT NOT NULL, -- 'insight', 'prediction', 'pattern', 'conversation', 'embedding'
    content TEXT NOT NULL,
    embedding TEXT, -- Vector embedding (JSON array)
    metadata TEXT, -- JSON
    confidence REAL,
    is_active BOOLEAN DEFAULT 1,
    expires_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Audit log table
CREATE TABLE IF NOT EXISTS audit_log (
    id TEXT PRIMARY KEY,
    user_id TEXT,
    action TEXT NOT NULL,
    entity_type TEXT, -- 'transaction', 'user', 'setting', 'import', etc.
    entity_id TEXT,
    old_value TEXT,
    new_value TEXT,
    ip_address TEXT,
    user_agent TEXT,
    device_fingerprint TEXT,
    session_id TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Backups table
CREATE TABLE IF NOT EXISTS backups (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    name TEXT,
    type TEXT DEFAULT 'manual', -- 'manual', 'auto', 'scheduled'
    size_bytes INTEGER,
    checksum TEXT,
    encryption_key_hash TEXT,
    status TEXT DEFAULT 'pending', -- 'pending', 'in_progress', 'completed', 'failed'
    error_message TEXT,
    metadata TEXT, -- JSON
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Dashboard layouts table
CREATE TABLE IF NOT EXISTS dashboard_layouts (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    name TEXT NOT NULL,
    layout_config TEXT NOT NULL, -- JSON
    is_default BOOLEAN DEFAULT 0,
    is_shared BOOLEAN DEFAULT 0,
    shared_with TEXT, -- JSON array of user IDs
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Notifications table
CREATE TABLE IF NOT EXISTS notifications (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    type TEXT NOT NULL, -- 'info', 'warning', 'success', 'error', 'alert'
    title TEXT NOT NULL,
    message TEXT,
    action_url TEXT,
    action_label TEXT,
    is_read BOOLEAN DEFAULT 0,
    read_at TIMESTAMP,
    priority TEXT DEFAULT 'normal', -- 'low', 'normal', 'high', 'urgent'
    source TEXT, -- 'ai', 'system', 'user', 'bank'
    metadata TEXT, -- JSON
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_transactions_user_date ON transactions(user_id, date);
CREATE INDEX IF NOT EXISTS idx_transactions_user_category ON transactions(user_id, category);
CREATE INDEX IF NOT EXISTS idx_transactions_user_type ON transactions(user_id, type);
CREATE INDEX IF NOT EXISTS idx_transactions_merchant ON transactions(merchant);
CREATE INDEX IF NOT EXISTS idx_transactions_import_batch ON transactions(import_batch_id);
CREATE INDEX IF NOT EXISTS idx_sessions_token ON sessions(token);
CREATE INDEX IF NOT EXISTS idx_sessions_user ON sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_user ON audit_log(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_entity ON audit_log(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_ai_memory_user_type ON ai_memory(user_id, type);
CREATE INDEX IF NOT EXISTS idx_notifications_user_read ON notifications(user_id, is_read);

-- Full-text search for transactions
CREATE VIRTUAL TABLE IF NOT EXISTS transactions_fts USING fts5(
    description, merchant, notes,
    content='transactions',
    content_rowid='id'
);

-- Triggers to keep FTS index updated
CREATE TRIGGER IF NOT EXISTS transactions_fts_insert AFTER INSERT ON transactions BEGIN
    INSERT INTO transactions_fts(rowid, description, merchant, notes)
    VALUES (new.id, new.description, new.merchant, new.notes);
END;

CREATE TRIGGER IF NOT EXISTS transactions_fts_delete AFTER DELETE ON transactions BEGIN
    INSERT INTO transactions_fts(transactions_fts, rowid, description, merchant, notes)
    VALUES ('delete', old.id, old.description, old.merchant, old.notes);
END;

CREATE TRIGGER IF NOT EXISTS transactions_fts_update AFTER UPDATE ON transactions BEGIN
    INSERT INTO transactions_fts(transactions_fts, rowid, description, merchant, notes)
    VALUES ('delete', old.id, old.description, old.merchant, old.notes);
    INSERT INTO transactions_fts(rowid, description, merchant, notes)
    VALUES (new.id, new.description, new.merchant, new.notes);
END;
