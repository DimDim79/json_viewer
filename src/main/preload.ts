import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('electronAPI', {
  openFile: () => ipcRenderer.invoke('dialog:openFile'),
  getFileInfo: (filePath: string) => ipcRenderer.invoke('file:getInfo', filePath),
  countRecords: (filePath: string) => ipcRenderer.invoke('file:countRecords', filePath),
  indexContractAccounts: (filePath: string) => ipcRenderer.invoke('file:indexContractAccounts', filePath),
  onFileProgress: (callback: (progress: any) => void) => {
    ipcRenderer.on('file:progress', (event, progress) => callback(progress))
  },
  removeFileProgressListener: () => {
    ipcRenderer.removeAllListeners('file:progress')
  }
})