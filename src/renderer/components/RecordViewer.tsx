import React, { useState, useMemo } from 'react'
import { Modal, Input, Space, Typography, Button, message } from 'antd'
import { CopyOutlined, SearchOutlined } from '@ant-design/icons'

const { Text, Title } = Typography
const { Search } = Input

interface RecordViewerProps {
  visible: boolean
  record: any | null
  contractAccount: string
  onClose: () => void
}

export const RecordViewer: React.FC<RecordViewerProps> = ({
  visible,
  record,
  contractAccount,
  onClose
}) => {
  const [searchTerm, setSearchTerm] = useState('')

  const handleCopyJSON = () => {
    if (record) {
      navigator.clipboard.writeText(JSON.stringify(record, null, 2))
      message.success('JSON copied to clipboard')
    }
  }

  const handleSearch = (value: string) => {
    setSearchTerm(value)
  }

  const highlightJSON = useMemo(() => {
    if (!record) return ''
    
    const jsonString = JSON.stringify(record, null, 2)
    
    if (!searchTerm) {
      return jsonString
    }
    
    // Escape special regex characters
    const escapedSearch = searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    const regex = new RegExp(`(${escapedSearch})`, 'gi')
    
    // Split the JSON string and wrap matches in spans
    const parts = jsonString.split(regex)
    
    return parts.map((part, index) => {
      if (index % 2 === 1) {
        // This is a match
        return `<mark style="background-color: yellow; font-weight: bold;">${part}</mark>`
      }
      return part
    }).join('')
  }, [record, searchTerm])

  return (
    <Modal
      title={
        <Space direction="vertical" style={{ width: '100%' }}>
          <Space>
            <Title level={4} style={{ margin: 0 }}>Record Details</Title>
            <Text type="secondary">Contract Account: {contractAccount}</Text>
          </Space>
          <Space.Compact style={{ width: '100%' }}>
            <Search
              placeholder="Search within record..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              onSearch={handleSearch}
              allowClear
              prefix={<SearchOutlined />}
            />
            <Button 
              icon={<CopyOutlined />}
              onClick={handleCopyJSON}
            >
              Copy JSON
            </Button>
          </Space.Compact>
        </Space>
      }
      open={visible}
      onCancel={onClose}
      width="80%"
      style={{ top: 20 }}
      footer={[
        <Button key="close" onClick={onClose}>
          Close
        </Button>
      ]}
    >
      <div style={{ 
        maxHeight: 'calc(100vh - 200px)', 
        overflowY: 'auto',
        padding: '16px 0',
        backgroundColor: '#f5f5f5',
        borderRadius: 4
      }}>
        <pre 
          style={{ 
            padding: 16,
            margin: 0,
            backgroundColor: 'white',
            border: '1px solid #d9d9d9',
            borderRadius: 4,
            fontSize: 14,
            lineHeight: 1.6,
            fontFamily: 'Consolas, Monaco, "Courier New", monospace'
          }}
          dangerouslySetInnerHTML={{ __html: highlightJSON }}
        />
      </div>
    </Modal>
  )
}