import React, { useState, useEffect } from 'react'
import { Button, Layout, Progress, Card, Statistic, Space, Typography, message, Row, Col } from 'antd'
import { FileOutlined, FolderOpenOutlined } from '@ant-design/icons'
import { getElectronAPI } from './utils/electronAPI'
import { WebFileProcessor } from './utils/webFileProcessor'
import { FileUpload } from './components/FileUpload'
import { SearchPanel, SearchType } from './components/SearchPanel'
import { SearchResults } from './components/SearchResults'
import { RecordViewer } from './components/RecordViewer'
import './styles/App.css'

const { Header, Content } = Layout
const { Title, Text } = Typography

interface FileInfo {
  path: string
  name: string
  size: number
  sizeInMB: string
  file?: File // For web-based file handling
}

interface FileStats {
  recordCount: number
  loadTime: number
  contractAccountIndex: Map<string, number>
}

declare global {
  interface Window {
    electronAPI: {
      openFile: () => Promise<string | null>
      getFileInfo: (filePath: string) => Promise<{ size: number; sizeInMB: string }>
      countRecords: (filePath: string) => Promise<{ count: number; elapsed: number }>
      indexContractAccounts: (filePath: string) => Promise<{ index: [string, number][]; totalRecords: number }>
      onFileProgress: (callback: (progress: any) => void) => void
      removeFileProgressListener: () => void
    }
  }
}

function App() {
  const [fileInfo, setFileInfo] = useState<FileInfo | null>(null)
  const [fileStats, setFileStats] = useState<FileStats | null>(null)
  const [loading, setLoading] = useState(false)
  const [loadingStage, setLoadingStage] = useState<'opening' | 'reading' | 'parsing' | 'counting' | 'indexing' | null>(null)
  const [progress, setProgress] = useState(0)
  const [recordsProcessed, setRecordsProcessed] = useState(0)
  
  // Search state
  const [searching, setSearching] = useState(false)
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [searchTime, setSearchTime] = useState<number | undefined>()
  const [lastSearch, setLastSearch] = useState<{ type: string; term: string } | null>(null)
  
  // Record viewer state
  const [viewerVisible, setViewerVisible] = useState(false)
  const [currentRecord, setCurrentRecord] = useState<any>(null)
  const [currentContractAccount, setCurrentContractAccount] = useState('')
  
  const electronAPI = getElectronAPI()
  const isElectron = window.electronAPI !== undefined

  useEffect(() => {
    // Set up progress listener
    electronAPI.onFileProgress((progress) => {
      setRecordsProcessed(progress.count)
    })

    return () => {
      electronAPI.removeFileProgressListener()
    }
  }, [])

  const handleOpenFile = async () => {
    try {
      setLoading(true)
      setLoadingStage('opening')
      setProgress(0)
      setRecordsProcessed(0)
      
      const filePath = await electronAPI.openFile()
      
      if (filePath) {
        const name = filePath.split(/[\\/]/).pop() || ''
        
        // Get file info
        const info = await electronAPI.getFileInfo(filePath)
        setFileInfo({
          path: filePath,
          name,
          size: info.size,
          sizeInMB: info.sizeInMB
        })
        
        // Count records
        setLoadingStage('counting')
        setProgress(30)
        const recordResult = await electronAPI.countRecords(filePath)
        
        // Index contract accounts
        setLoadingStage('indexing')
        setProgress(60)
        const indexResult = await electronAPI.indexContractAccounts(filePath)
        
        setFileStats({
          recordCount: recordResult.count,
          loadTime: recordResult.elapsed,
          contractAccountIndex: new Map(indexResult.index)
        })
        
        setProgress(100)
        message.success(`Successfully loaded ${recordResult.count.toLocaleString()} records in ${(recordResult.elapsed / 1000).toFixed(1)}s`)
      }
    } catch (error) {
      console.error('Error opening file:', error)
      message.error('Failed to open file: ' + (error as Error).message)
    } finally {
      setLoading(false)
      setLoadingStage(null)
    }
  }

  const handleWebFileSelect = async (file: File) => {
    try {
      setLoading(true)
      setProgress(0)
      setRecordsProcessed(0)
      
      // Set file info
      setFileInfo({
        path: file.name,
        name: file.name,
        size: file.size,
        sizeInMB: (file.size / (1024 * 1024)).toFixed(2),
        file: file
      })
      
      // Process file
      const result = await WebFileProcessor.processFile(file, (progress) => {
        setLoadingStage(progress.stage as any)
        setProgress(Math.round(progress.progress))
        if (progress.recordsProcessed !== undefined) {
          setRecordsProcessed(progress.recordsProcessed)
        }
      })
      
      setFileStats({
        recordCount: result.recordCount,
        loadTime: result.loadTime,
        contractAccountIndex: result.contractAccountIndex
      })
      
      setProgress(100)
      message.success(`Successfully loaded ${result.recordCount.toLocaleString()} records in ${(result.loadTime / 1000).toFixed(1)}s`)
    } catch (error) {
      console.error('Error processing file:', error)
      message.error('Failed to process file: ' + (error as Error).message)
    } finally {
      setLoading(false)
      setLoadingStage(null)
    }
  }

  const handleSearch = async (searchType: SearchType, searchTerm: string, keyName?: string) => {
    if (!fileInfo?.file || !fileStats) {
      message.error('No file loaded')
      return
    }

    try {
      setSearching(true)
      setSearchResults([])
      setLastSearch({ type: searchType, term: searchTerm })

      const result = await WebFileProcessor.searchRecords(
        fileInfo.file,
        searchType,
        searchTerm,
        keyName,
        fileStats.contractAccountIndex
      )

      setSearchResults(result.results)
      setSearchTime(result.searchTime)

      if (result.results.length === 0) {
        message.info('No matching records found')
      }
    } catch (error) {
      console.error('Search error:', error)
      message.error('Search failed: ' + (error as Error).message)
    } finally {
      setSearching(false)
    }
  }

  const handleViewRecord = async (recordIndex: number, contractAccount: string) => {
    if (!fileInfo?.file) {
      message.error('No file loaded')
      return
    }

    try {
      const record = await WebFileProcessor.getRecord(fileInfo.file, recordIndex)
      setCurrentRecord(record)
      setCurrentContractAccount(contractAccount)
      setViewerVisible(true)
    } catch (error) {
      console.error('Error loading record:', error)
      message.error('Failed to load record: ' + (error as Error).message)
    }
  }

  const handleCloseViewer = () => {
    setViewerVisible(false)
    setCurrentRecord(null)
    setCurrentContractAccount('')
  }

  return (
    <Layout className="app">
      <Header className="app-header">
        <Title level={2} style={{ color: 'white', margin: 0 }}>JSON Content Viewer</Title>
      </Header>
      
      <Content className="app-content">
        {!fileInfo ? (
          <div className="welcome-screen">
            <Space direction="vertical" align="center" size="large" style={{ width: '100%', maxWidth: 600 }}>
              <FileOutlined style={{ fontSize: 64, color: '#1890ff' }} />
              <Title level={3}>Welcome to JSON Viewer</Title>
              <Text type="secondary">Open a JSON file to begin exploring your data</Text>
              
              {isElectron ? (
                <Button 
                  type="primary"
                  size="large"
                  icon={<FolderOpenOutlined />}
                  onClick={handleOpenFile} 
                  loading={loading}
                >
                  Open JSON File
                </Button>
              ) : (
                <div style={{ width: '100%' }}>
                  <FileUpload onFileSelect={handleWebFileSelect} loading={loading} />
                  <Text type="secondary" style={{ display: 'block', marginTop: 16, textAlign: 'center' }}>
                    Running in browser mode - drag and drop or click to upload
                  </Text>
                </div>
              )}
            </Space>
          </div>
        ) : (
          <div>
            <Card 
              className="file-info-card"
              extra={
                <Button 
                  type="default" 
                  icon={<FolderOpenOutlined />}
                  onClick={() => {
                    // Clear all state to load a new file
                    setFileInfo(null)
                    setFileStats(null)
                    setSearchResults([])
                    setSearchTime(undefined)
                    setLastSearch(null)
                    setProgress(0)
                    setRecordsProcessed(0)
                  }}
                >
                  Load Another File
                </Button>
              }
            >
              <Space direction="vertical" style={{ width: '100%' }}>
                <Title level={4}>{fileInfo.name}</Title>
                <Text type="secondary">{fileInfo.path}</Text>
                
                {loading && (
                  <div style={{ marginTop: 20 }}>
                    <Progress percent={progress} status="active" />
                    <Text>
                      {loadingStage === 'opening' && 'Opening file...'}
                      {loadingStage === 'reading' && 'Reading file...'}
                      {loadingStage === 'parsing' && 'Parsing JSON...'}
                      {loadingStage === 'counting' && `Counting records... ${recordsProcessed.toLocaleString()} processed`}
                      {loadingStage === 'indexing' && `Building search index... ${recordsProcessed.toLocaleString()} records indexed`}
                    </Text>
                  </div>
                )}
                
                {fileStats && (
                  <div style={{ marginTop: 20 }}>
                    <Space size="large">
                      <Statistic title="File Size" value={fileInfo.sizeInMB} suffix="MB" />
                      <Statistic title="Total Records" value={fileStats.recordCount.toLocaleString()} />
                      <Statistic title="Load Time" value={(fileStats.loadTime / 1000).toFixed(1)} suffix="s" />
                      <Statistic title="Indexed Accounts" value={fileStats.contractAccountIndex.size.toLocaleString()} />
                    </Space>
                  </div>
                )}
              </Space>
            </Card>

            {fileStats && (
              <Row gutter={16} style={{ marginTop: 16 }}>
                <Col xs={24} lg={8}>
                  <SearchPanel
                    onSearch={handleSearch}
                    loading={searching}
                    contractAccountCount={fileStats.contractAccountIndex.size}
                  />
                </Col>
                <Col xs={24} lg={16}>
                  <SearchResults
                    results={searchResults}
                    loading={searching}
                    searchTime={searchTime}
                    searchType={lastSearch?.type}
                    searchTerm={lastSearch?.term}
                    onViewRecord={handleViewRecord}
                  />
                </Col>
              </Row>
            )}
          </div>
        )}
      </Content>

      <RecordViewer
        visible={viewerVisible}
        record={currentRecord}
        contractAccount={currentContractAccount}
        onClose={handleCloseViewer}
      />
    </Layout>
  )
}

export default App