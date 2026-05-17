import React from 'react'

const Reports = () => {
  return (
    <div className="min-h-screen bg-fin-dark text-white p-6">
      <h1 className="text-3xl font-bold mb-4">Reports</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="fin-card p-6">
          <h2 className="text-lg font-semibold mb-2">Financial Summary</h2>
          <p className="text-white/50">
            Quarterly and yearly financial insights.
          </p>
        </div>

        <div className="fin-card p-6">
          <h2 className="text-lg font-semibold mb-2">Expense Analysis</h2>
          <p className="text-white/50">
            Categorized expense breakdown reports.
          </p>
        </div>

        <div className="fin-card p-6">
          <h2 className="text-lg font-semibold mb-2">AI Forecasts</h2>
          <p className="text-white/50">
            Predictive analytics and AI-based projections.
          </p>
        </div>
      </div>
    </div>
  )
}

export default Reports