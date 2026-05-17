import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useDashboardStore = create(
  persist(
    (set, get) => ({
      widgets: [
        { id: 'net-worth', type: 'metric', title: 'Net Worth', position: { x: 0, y: 0, w: 3, h: 2 } },
        { id: 'cash-flow', type: 'chart', title: 'Cash Flow', position: { x: 3, y: 0, w: 6, h: 4 } },
        { id: 'transactions', type: 'list', title: 'Recent Transactions', position: { x: 9, y: 0, w: 3, h: 4 } },
        { id: 'spending', type: 'chart', title: 'Spending Breakdown', position: { x: 0, y: 2, w: 3, h: 4 } },
        { id: 'ai-insights', type: 'ai', title: 'AI Insights', position: { x: 3, y: 4, w: 6, h: 3 } },
        { id: 'goals', type: 'metric', title: 'Financial Goals', position: { x: 9, y: 4, w: 3, h: 3 } },
      ],
      layouts: {},
      selectedDateRange: '30d',
      refreshInterval: 30000,

      addWidget: (widget) => {
        set(state => ({
          widgets: [...state.widgets, { ...widget, id: `widget_${Date.now()}` }]
        }))
      },

      removeWidget: (id) => {
        set(state => ({
          widgets: state.widgets.filter(w => w.id !== id)
        }))
      },

      updateWidgetPosition: (id, position) => {
        set(state => ({
          widgets: state.widgets.map(w => 
            w.id === id ? { ...w, position } : w
          )
        }))
      },

      setDateRange: (range) => set({ selectedDateRange: range }),
      setRefreshInterval: (interval) => set({ refreshInterval: interval }),

      saveLayout: (name, layout) => {
        set(state => ({
          layouts: { ...state.layouts, [name]: layout }
        }))
      },

      loadLayout: (name) => {
        const { layouts } = get()
        if (layouts[name]) {
          set({ widgets: layouts[name] })
        }
      },
    }),
    {
      name: 'finanalytics-dashboard',
      partialize: (state) => ({
        widgets: state.widgets,
        layouts: state.layouts,
        selectedDateRange: state.selectedDateRange,
      }),
    }
  )
)
