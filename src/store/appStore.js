import { create } from 'zustand'

export const useAppStore = create((set, get) => ({
  isAppReady: false,
  activeWorkspace: 'default',
  sidebarCollapsed: false,
  activePanel: 'overview',
  notifications: [],
  modalStack: [],

  setAppReady: (ready) => set({ isAppReady: ready }),
  setActiveWorkspace: (workspace) => set({ activeWorkspace: workspace }),
  toggleSidebar: () => set(state => ({ sidebarCollapsed: !state.sidebarCollapsed })),
  setActivePanel: (panel) => set({ activePanel: panel }),

  addNotification: (notification) => {
    const id = Date.now().toString()
    set(state => ({
      notifications: [...state.notifications, { ...notification, id }]
    }))

    // Auto-dismiss after 5s
    setTimeout(() => {
      get().removeNotification(id)
    }, 5000)

    return id
  },

  removeNotification: (id) => {
    set(state => ({
      notifications: state.notifications.filter(n => n.id !== id)
    }))
  },

  pushModal: (modal) => {
    set(state => ({
      modalStack: [...state.modalStack, modal]
    }))
  },

  popModal: () => {
    set(state => ({
      modalStack: state.modalStack.slice(0, -1)
    }))
  },
}))
