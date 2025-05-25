// Mock Electron API for browser development
export const mockElectronAPI = {
  openFile: async () => {
    // In browser mode, we can't use native file dialogs
    // You would need to use HTML file input instead
    console.log('File dialog not available in browser mode');
    return null;
  },
  getFileInfo: async (filePath: string) => {
    console.log('File info not available in browser mode');
    return { size: 0, sizeInMB: '0' };
  },
  countRecords: async (filePath: string) => {
    console.log('Record counting not available in browser mode');
    return { count: 0, elapsed: 0 };
  },
  indexContractAccounts: async (filePath: string) => {
    console.log('Indexing not available in browser mode');
    return { index: [], totalRecords: 0 };
  },
  onFileProgress: (callback: (progress: any) => void) => {
    console.log('Progress tracking not available in browser mode');
  },
  removeFileProgressListener: () => {
    console.log('Progress listener removal not available in browser mode');
  }
};

// Check if we're running in Electron or browser
export const getElectronAPI = () => {
  if (typeof window !== 'undefined' && window.electronAPI) {
    return window.electronAPI;
  }
  console.warn('Running in browser mode - using mock Electron API');
  return mockElectronAPI;
};