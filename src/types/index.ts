// FinAnalytics Type Definitions
// Designed, Created and Developed by Anshuman Jha
// Brainchild of Anshuman Kr Jha

// User Types
export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: 'user' | 'admin' | 'superadmin';
  plan: 'free' | 'pro' | 'business' | 'enterprise';
  licenseStatus: 'trial' | 'active' | 'expired' | 'suspended';
  createdAt: string;
  lastLogin: string;
  preferences: UserPreferences;
  deviceFingerprints: string[];
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  accentColor: string;
  language: string;
  currency: string;
  timezone: string;
  dateFormat: string;
  numberFormat: string;
  notifications: NotificationPreferences;
  privacy: PrivacyPreferences;
}

export interface NotificationPreferences {
  email: boolean;
  push: boolean;
  sms: boolean;
  transactionAlerts: boolean;
  budgetWarnings: boolean;
  aiInsights: boolean;
  securityAlerts: boolean;
  billReminders: boolean;
  goalMilestones: boolean;
  marketUpdates: boolean;
  weeklySummary: boolean;
}

export interface PrivacyPreferences {
  shareAnalytics: boolean;
  autoBackup: boolean;
  biometricAuth: boolean;
  twoFactorAuth: boolean;
  dataRetentionDays: number;
}

// Transaction Types
export interface Transaction {
  id: string;
  userId: string;
  date: string;
  amount: number;
  type: 'income' | 'expense' | 'transfer';
  category: string;
  subcategory?: string;
  description: string;
  merchant?: string;
  accountId?: string;
  status: 'pending' | 'completed' | 'cancelled' | 'disputed' | 'refunded';
  currency: string;
  exchangeRate: number;
  tags: string[];
  aiTags: string[];
  aiConfidence: number;
  aiCategorySuggestion?: string;
  isRecurring: boolean;
  recurringPattern?: string;
  parentId?: string;
  splitFromId?: string;
  notes?: string;
  attachments: Attachment[];
  location?: GeoLocation;
  receiptData?: ReceiptData;
  bankReference?: string;
  importedFrom?: string;
  importBatchId?: string;
  isDuplicate: boolean;
  duplicateOfId?: string;
  isFlagged: boolean;
  flagReason?: string;
  isFavorite: boolean;
  isPinned: boolean;
  colorTag?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Attachment {
  id: string;
  filename: string;
  mimeType: string;
  size: number;
  url: string;
  thumbnailUrl?: string;
  uploadedAt: string;
}

export interface GeoLocation {
  latitude: number;
  longitude: number;
  address?: string;
  city?: string;
  country?: string;
}

export interface ReceiptData {
  rawText: string;
  merchant: string;
  date: string;
  items: ReceiptItem[];
  total: number;
  tax: number;
  confidence: number;
}

export interface ReceiptItem {
  name: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  category?: string;
}

// Category Types
export interface Category {
  id: string;
  userId?: string;
  name: string;
  type: 'income' | 'expense' | 'both';
  color: string;
  icon: string;
  parentId?: string;
  children?: Category[];
  budgetAmount?: number;
  budgetPeriod?: 'daily' | 'weekly' | 'monthly' | 'yearly';
  isSystem: boolean;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
}

// Account Types
export interface Account {
  id: string;
  userId: string;
  name: string;
  type: 'checking' | 'savings' | 'credit' | 'investment' | 'loan' | 'cash' | 'crypto' | 'other';
  institution?: string;
  accountNumberMasked?: string;
  currency: string;
  balance: number;
  creditLimit?: number;
  interestRate?: number;
  openingDate?: string;
  isActive: boolean;
  isPrimary: boolean;
  syncEnabled: boolean;
  syncProvider?: string;
  lastSyncAt?: string;
  metadata: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

// Budget Types
export interface Budget {
  id: string;
  userId: string;
  name: string;
  period: 'monthly' | 'quarterly' | 'yearly' | 'custom';
  startDate: string;
  endDate?: string;
  totalBudget: number;
  currency: string;
  isActive: boolean;
  alertThreshold: number;
  items: BudgetItem[];
  createdAt: string;
  updatedAt: string;
}

export interface BudgetItem {
  id: string;
  budgetId: string;
  categoryId: string;
  allocatedAmount: number;
  spentAmount: number;
  alertThreshold?: number;
  isEssential: boolean;
}

// Goal Types
export interface FinancialGoal {
  id: string;
  userId: string;
  name: string;
  description?: string;
  targetAmount: number;
  currentAmount: number;
  currency: string;
  deadline?: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  category?: string;
  status: 'active' | 'completed' | 'paused' | 'cancelled';
  color: string;
  icon: string;
  autoContribute: boolean;
  autoContributeAmount?: number;
  autoContributeFrequency?: 'daily' | 'weekly' | 'monthly';
  milestones: GoalMilestone[];
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
}

export interface GoalMilestone {
  id: string;
  name: string;
  targetAmount: number;
  isCompleted: boolean;
  completedAt?: string;
}

// Dashboard Types
export interface DashboardWidget {
  id: string;
  type: 'metric' | 'chart' | 'list' | 'ai' | 'custom';
  title: string;
  config: Record<string, any>;
  position: WidgetPosition;
  size: WidgetSize;
  dataSource?: string;
  refreshInterval?: number;
  isVisible: boolean;
  isLocked: boolean;
}

export interface WidgetPosition {
  x: number;
  y: number;
}

export interface WidgetSize {
  w: number;
  h: number;
  minW?: number;
  minH?: number;
  maxW?: number;
  maxH?: number;
}

export interface DashboardLayout {
  id: string;
  userId: string;
  name: string;
  widgets: DashboardWidget[];
  isDefault: boolean;
  isShared: boolean;
  sharedWith: string[];
  createdAt: string;
  updatedAt: string;
}

// AI Types
export interface AIInsight {
  id: string;
  type: 'prediction' | 'anomaly' | 'suggestion' | 'optimization' | 'security' | 'goal' | 'pattern';
  title: string;
  message: string;
  confidence: number;
  severity: 'info' | 'warning' | 'critical' | 'success';
  category?: string;
  relatedTransactions?: string[];
  suggestedActions: AISuggestedAction[];
  isRead: boolean;
  isDismissed: boolean;
  createdAt: string;
  expiresAt?: string;
}

export interface AISuggestedAction {
  label: string;
  action: string;
  params?: Record<string, any>;
}

export interface AIChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  type?: string;
  confidence?: number;
  sources?: string[];
  actions?: AISuggestedAction[];
}

export interface AIPrediction {
  id: string;
  type: 'cashflow' | 'spending' | 'income' | 'savings' | 'networth';
  period: string;
  predictions: PredictionDataPoint[];
  confidence: number;
  factors: PredictionFactor[];
  risks: PredictionRisk[];
  opportunities: PredictionOpportunity[];
  createdAt: string;
}

export interface PredictionDataPoint {
  date: string;
  predicted: number;
  lowerBound: number;
  upperBound: number;
  confidence: number;
}

export interface PredictionFactor {
  name: string;
  impact: number; // -1 to 1
  description: string;
}

export interface PredictionRisk {
  name: string;
  probability: number;
  impact: number;
  mitigation?: string;
}

export interface PredictionOpportunity {
  name: string;
  potentialValue: number;
  probability: number;
  action?: string;
}

// Analytics Types
export interface AnalyticsSummary {
  period: string;
  overview: {
    totalIncome: number;
    totalExpenses: number;
    netSavings: number;
    savingsRate: number;
    transactionCount: number;
    avgTransaction: number;
  };
  trends: {
    incomeChange: number;
    expenseChange: number;
    savingsChange: number;
  };
  topCategories: CategorySummary[];
  predictions: {
    nextMonthIncome: number;
    nextMonthExpenses: number;
    nextMonthSavings: number;
    confidence: number;
  };
}

export interface CategorySummary {
  name: string;
  amount: number;
  percentage: number;
  trend: 'up' | 'down' | 'stable';
  transactions: number;
}

export interface TimeSeriesData {
  date: string;
  income: number;
  expenses: number;
  savings: number;
  transactions: number;
}

// Import/Export Types
export interface ImportBatch {
  id: string;
  userId: string;
  filename: string;
  fileType: string;
  fileSize: number;
  source: 'manual' | 'bank_sync' | 'api' | 'email' | 'ocr';
  status: 'processing' | 'completed' | 'failed' | 'partial';
  totalRecords: number;
  processedRecords: number;
  failedRecords: number;
  duplicateRecords: number;
  confidenceAvg: number;
  processingTimeMs: number;
  errorLog?: string;
  metadata: Record<string, any>;
  createdAt: string;
  completedAt?: string;
}

export interface ExportConfig {
  format: 'csv' | 'excel' | 'pdf' | 'json' | 'xml';
  dateRange?: { from: string; to: string };
  categories?: string[];
  accounts?: string[];
  types?: string[];
  includeAttachments: boolean;
  includeNotes: boolean;
  includeTags: boolean;
  password?: string;
}

// Notification Types
export interface Notification {
  id: string;
  userId: string;
  type: 'info' | 'warning' | 'success' | 'error' | 'alert';
  title: string;
  message?: string;
  actionUrl?: string;
  actionLabel?: string;
  isRead: boolean;
  readAt?: string;
  priority: 'low' | 'normal' | 'high' | 'urgent';
  source: 'ai' | 'system' | 'user' | 'bank' | 'security';
  metadata: Record<string, any>;
  createdAt: string;
  expiresAt?: string;
}

// Security Types
export interface Session {
  id: string;
  userId: string;
  token: string;
  refreshToken: string;
  deviceFingerprint: string;
  ipAddress: string;
  userAgent: string;
  createdAt: string;
  expiresAt: string;
  lastActiveAt: string;
  isValid: boolean;
}

export interface AuditLogEntry {
  id: string;
  userId?: string;
  action: string;
  entityType: string;
  entityId?: string;
  oldValue?: string;
  newValue?: string;
  ipAddress?: string;
  userAgent?: string;
  deviceFingerprint?: string;
  sessionId?: string;
  createdAt: string;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: ApiError;
  meta?: ApiMeta;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, any>;
  stack?: string;
}

export interface ApiMeta {
  page?: number;
  limit?: number;
  total?: number;
  pages?: number;
  timestamp: string;
  requestId: string;
  processingTime: number;
}

// Search Types
export interface SearchQuery {
  query: string;
  type: 'natural' | 'semantic' | 'vector' | 'regex';
  filters?: SearchFilters;
  sort?: SearchSort;
  pagination?: SearchPagination;
}

export interface SearchFilters {
  dateFrom?: string;
  dateTo?: string;
  categories?: string[];
  accounts?: string[];
  types?: string[];
  minAmount?: number;
  maxAmount?: number;
  tags?: string[];
  status?: string[];
}

export interface SearchSort {
  field: string;
  direction: 'asc' | 'desc';
}

export interface SearchPagination {
  page: number;
  limit: number;
}

export interface SearchResult<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  pages: number;
  highlights?: Record<string, string[]>;
  suggestions?: string[];
  facets?: SearchFacet[];
}

export interface SearchFacet {
  field: string;
  values: { value: string; count: number }[];
}

// Plugin Types
export interface Plugin {
  id: string;
  name: string;
  description: string;
  version: string;
  author: string;
  icon?: string;
  entryPoint: string;
  permissions: string[];
  configSchema: Record<string, any>;
  isActive: boolean;
  isSystem: boolean;
  installedAt: string;
  updatedAt: string;
}

export interface PluginConfig {
  pluginId: string;
  config: Record<string, any>;
}

// Workspace Types
export interface Workspace {
  id: string;
  userId: string;
  name: string;
  description?: string;
  mode: 'overview' | 'executive' | 'analyst' | 'auditor' | 'custom';
  layout: DashboardLayout;
  panels: WorkspacePanel[];
  isDefault: boolean;
  isShared: boolean;
  sharedWith: string[];
  createdAt: string;
  updatedAt: string;
}

export interface WorkspacePanel {
  id: string;
  type: string;
  title: string;
  position: WidgetPosition;
  size: WidgetSize;
  config: Record<string, any>;
  dataSource?: string;
  refreshInterval?: number;
}

// Report Types
export interface Report {
  id: string;
  userId: string;
  name: string;
  type: 'executive' | 'tax' | 'monthly' | 'risk' | 'fraud' | 'health' | 'cashflow' | 'custom';
  period: string;
  config: ReportConfig;
  status: 'draft' | 'generating' | 'completed' | 'failed';
  content?: ReportContent;
  aiSummary?: string;
  createdAt: string;
  completedAt?: string;
}

export interface ReportConfig {
  dateRange: { from: string; to: string };
  categories?: string[];
  accounts?: string[];
  includeCharts: boolean;
  includeTables: boolean;
  includeAiInsights: boolean;
  format: 'pdf' | 'excel' | 'html' | 'json';
}

export interface ReportContent {
  sections: ReportSection[];
  charts: ReportChart[];
  tables: ReportTable[];
  insights: AIInsight[];
}

export interface ReportSection {
  id: string;
  title: string;
  content: string;
  type: 'text' | 'chart' | 'table' | 'insight';
}

export interface ReportChart {
  id: string;
  type: string;
  title: string;
  data: any;
  config: Record<string, any>;
}

export interface ReportTable {
  id: string;
  title: string;
  headers: string[];
  rows: any[][];
}
