import { app, BrowserWindow, ipcMain, dialog } from 'electron'
import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs'
import { pipeline } from 'stream/promises'
import { parser } from 'stream-json'
import { streamArray } from 'stream-json/streamers/StreamArray.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

let mainWindow: BrowserWindow | null = null

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
    icon: path.join(__dirname, '../../public/icon.png'),
  })

  if (process.env.NODE_ENV === 'development') {
    mainWindow.loadURL('http://localhost:3000')
    mainWindow.webContents.openDevTools()
  } else {
    mainWindow.loadFile(path.join(__dirname, '../../dist/renderer/index.html'))
  }

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

// IPC handlers
ipcMain.handle('dialog:openFile', async () => {
  const result = await dialog.showOpenDialog({
    properties: ['openFile'],
    filters: [
      { name: 'JSON Files', extensions: ['json'] },
      { name: 'All Files', extensions: ['*'] }
    ]
  })
  
  if (!result.canceled && result.filePaths.length > 0) {
    return result.filePaths[0]
  }
  return null
})

ipcMain.handle('file:getInfo', async (event, filePath: string) => {
  try {
    const stats = await fs.promises.stat(filePath)
    return {
      size: stats.size,
      sizeInMB: (stats.size / (1024 * 1024)).toFixed(2)
    }
  } catch (error) {
    console.error('Error getting file info:', error)
    throw error
  }
})

ipcMain.handle('file:countRecords', async (event, filePath: string) => {
  return new Promise((resolve, reject) => {
    let count = 0
    const startTime = Date.now()
    
    const readStream = fs.createReadStream(filePath)
    const jsonStream = readStream.pipe(parser()).pipe(streamArray())
    
    jsonStream.on('data', () => {
      count++
      // Send progress updates every 1000 records
      if (count % 1000 === 0) {
        mainWindow?.webContents.send('file:progress', {
          count,
          elapsed: Date.now() - startTime
        })
      }
    })
    
    jsonStream.on('end', () => {
      resolve({
        count,
        elapsed: Date.now() - startTime
      })
    })
    
    jsonStream.on('error', reject)
  })
})

ipcMain.handle('file:indexContractAccounts', async (event, filePath: string) => {
  return new Promise((resolve, reject) => {
    const index = new Map<string, number>()
    let position = 0
    
    const readStream = fs.createReadStream(filePath)
    const jsonStream = readStream.pipe(parser()).pipe(streamArray())
    
    jsonStream.on('data', (data: any) => {
      const record = data.value
      if (record.contractAccount) {
        index.set(record.contractAccount, position)
      }
      position++
    })
    
    jsonStream.on('end', () => {
      resolve({
        index: Array.from(index.entries()),
        totalRecords: position
      })
    })
    
    jsonStream.on('error', reject)
  })
})