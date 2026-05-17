const { app, BrowserWindow, ipcMain, dialog, Menu, shell } = require('electron')
const path = require('path')
const isDev = process.env.NODE_ENV === 'development'

// Keep a global reference of the window object
let mainWindow
let splashWindow

// Create splash screen
function createSplashWindow() {
  splashWindow = new BrowserWindow({
    width: 500,
    height: 400,
    frame: false,
    transparent: true,
    alwaysOnTop: true,
    resizable: false,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    },
  })

  splashWindow.loadFile(path.join(__dirname, 'splash.html'))

  splashWindow.on('closed', () => {
    splashWindow = null
  })
}

// Create main window
function createMainWindow() {
  const { screen } = require('electron')
  const primaryDisplay = screen.getPrimaryDisplay()
  const { width, height } = primaryDisplay.workAreaSize

  mainWindow = new BrowserWindow({
    width: Math.min(1600, width * 0.9),
    height: Math.min(1000, height * 0.9),
    minWidth: 1200,
    minHeight: 700,
    show: false,
    titleBarStyle: 'hiddenInset',
    trafficLightPosition: { x: 15, y: 15 },
    backgroundColor: '#0a0a0f',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
      preload: path.join(__dirname, 'preload.js'),
      webSecurity: !isDev,
      allowRunningInsecureContent: false,
    },
    icon: path.join(__dirname, '../src/assets/icon.png'),
  })

  // Load the app
  if (isDev) {
    mainWindow.loadURL('http://localhost:5173')
    mainWindow.webContents.openDevTools()
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'))
  }

  // Show window when ready
  mainWindow.once('ready-to-show', () => {
    setTimeout(() => {
      if (splashWindow) {
        splashWindow.close()
      }
      mainWindow.show()
      mainWindow.focus()
    }, 2000)
  })

  // Window events
  mainWindow.on('closed', () => {
    mainWindow = null
  })

  // Handle external links
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url)
    return { action: 'deny' }
  })

  // Create custom menu
  createMenu()
}

// Create application menu
function createMenu() {
  const template = [
    {
      label: 'FinAnalytics',
      submenu: [
        { label: 'About FinAnalytics', role: 'about' },
        { type: 'separator' },
        { label: 'Preferences...', accelerator: 'CmdOrCtrl+,' },
        { type: 'separator' },
        { label: 'Hide FinAnalytics', role: 'hide' },
        { label: 'Hide Others', role: 'hideOthers' },
        { type: 'separator' },
        { label: 'Quit', role: 'quit' },
      ]
    },
    {
      label: 'File',
      submenu: [
        { label: 'Import Data...', accelerator: 'CmdOrCtrl+O' },
        { label: 'Export Data...', accelerator: 'CmdOrCtrl+Shift+S' },
        { type: 'separator' },
        { label: 'New Transaction', accelerator: 'CmdOrCtrl+N' },
        { label: 'Quick Search', accelerator: 'CmdOrCtrl+K' },
      ]
    },
    {
      label: 'Edit',
      submenu: [
        { label: 'Undo', role: 'undo' },
        { label: 'Redo', role: 'redo' },
        { type: 'separator' },
        { label: 'Cut', role: 'cut' },
        { label: 'Copy', role: 'copy' },
        { label: 'Paste', role: 'paste' },
        { label: 'Select All', role: 'selectAll' },
      ]
    },
    {
      label: 'View',
      submenu: [
        { label: 'Reload', role: 'reload' },
        { label: 'Force Reload', role: 'forceReload' },
        { label: 'Toggle Developer Tools', role: 'toggleDevTools' },
        { type: 'separator' },
        { label: 'Actual Size', role: 'resetZoom' },
        { label: 'Zoom In', role: 'zoomIn' },
        { label: 'Zoom Out', role: 'zoomOut' },
        { type: 'separator' },
        { label: 'Toggle Fullscreen', role: 'togglefullscreen' },
      ]
    },
    {
      label: 'Window',
      submenu: [
        { label: 'Minimize', role: 'minimize' },
        { label: 'Close', role: 'close' },
        { type: 'separator' },
        { label: 'New Window', accelerator: 'CmdOrCtrl+Shift+N' },
      ]
    },
    {
      label: 'AI',
      submenu: [
        { label: 'Open AI Copilot', accelerator: 'CmdOrCtrl+Shift+A' },
        { label: 'Generate Insights' },
        { label: 'Anomaly Scan' },
        { type: 'separator' },
        { label: 'Voice Command', accelerator: 'CmdOrCtrl+Shift+V' },
      ]
    },
    {
      label: 'Help',
      submenu: [
        { label: 'Documentation' },
        { label: 'Keyboard Shortcuts' },
        { label: 'Report Issue' },
        { type: 'separator' },
        { label: 'Check for Updates' },
        { type: 'separator' },
        { label: 'About', click: () => {
          dialog.showMessageBox(mainWindow, {
            type: 'info',
            title: 'About FinAnalytics',
            message: 'FinAnalytics v1.0.0',
            detail: 'Next-Generation AI-Powered Financial Intelligence Operating System.\n\nDesigned, Created and Developed by Anshuman Jha.\nBrainchild of Anshuman Kr Jha.',
            buttons: ['OK'],
          })
        }},
      ]
    },
  ]

  const menu = Menu.buildFromTemplate(template)
  Menu.setApplicationMenu(menu)
}

// IPC handlers
ipcMain.handle('app:version', () => {
  return app.getVersion()
})

ipcMain.handle('app:platform', () => {
  return process.platform
})

ipcMain.handle('dialog:openFile', async () => {
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ['openFile', 'multiSelections'],
    filters: [
      { name: 'Financial Data', extensions: ['csv', 'xlsx', 'xls', 'pdf', 'json', 'xml'] },
      { name: 'Images', extensions: ['png', 'jpg', 'jpeg'] },
      { name: 'All Files', extensions: ['*'] },
    ],
  })
  return result
})

ipcMain.handle('dialog:saveFile', async () => {
  const result = await dialog.showSaveDialog(mainWindow, {
    filters: [
      { name: 'CSV', extensions: ['csv'] },
      { name: 'Excel', extensions: ['xlsx'] },
      { name: 'PDF', extensions: ['pdf'] },
      { name: 'JSON', extensions: ['json'] },
    ],
  })
  return result
})

ipcMain.handle('window:minimize', () => {
  mainWindow?.minimize()
})

ipcMain.handle('window:maximize', () => {
  if (mainWindow?.isMaximized()) {
    mainWindow.unmaximize()
  } else {
    mainWindow?.maximize()
  }
})

ipcMain.handle('window:close', () => {
  mainWindow?.close()
})

// App events
app.whenReady().then(() => {
  createSplashWindow()
  createMainWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createMainWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('before-quit', () => {
  // Cleanup and save state
})

// Security: Prevent new window creation
app.on('web-contents-created', (event, contents) => {
  contents.on('new-window', (event, navigationUrl) => {
    event.preventDefault()
    shell.openExternal(navigationUrl)
  })
})
