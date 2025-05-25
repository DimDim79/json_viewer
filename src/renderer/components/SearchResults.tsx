import React from 'react'
import { Card, List, Button, Empty, Space, Typography, Tag, Spin } from 'antd'
import { EyeOutlined } from '@ant-design/icons'

const { Text, Title } = Typography

interface SearchResult {
  contractAccount: string
  recordIndex: number
  matchedKeys?: string[]
  matchedValues?: any[]
}

interface SearchResultsProps {
  results: SearchResult[]
  loading?: boolean
  searchTime?: number
  searchType?: string
  searchTerm?: string
  onViewRecord: (recordIndex: number, contractAccount: string) => void
}

export const SearchResults: React.FC<SearchResultsProps> = ({
  results,
  loading,
  searchTime,
  searchType,
  searchTerm,
  onViewRecord
}) => {
  if (loading) {
    return (
      <Card title="Search Results">
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <Spin size="large" />
          <Text style={{ display: 'block', marginTop: 16 }}>Searching...</Text>
        </div>
      </Card>
    )
  }

  if (!results.length && searchTerm) {
    return (
      <Card 
        title="Search Results"
        extra={searchTime && <Text type="secondary">Search completed in {(searchTime / 1000).toFixed(2)}s</Text>}
      >
        <Empty 
          description={
            <Space direction="vertical">
              <Text>No records found matching your search criteria</Text>
              <Text type="secondary">
                Search type: {searchType} | Term: "{searchTerm}"
              </Text>
            </Space>
          }
        />
      </Card>
    )
  }

  if (!results.length) {
    return null
  }

  return (
    <Card 
      title={
        <Space>
          <span>Search Results</span>
          <Tag color="blue">{results.length} matches</Tag>
        </Space>
      }
      extra={searchTime && <Text type="secondary">Found in {(searchTime / 1000).toFixed(2)}s</Text>}
      style={{ marginTop: 16 }}
    >
      <List
        dataSource={results}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showTotal: (total) => `Total ${total} results`,
          pageSizeOptions: ['10', '20', '50', '100']
        }}
        renderItem={(result) => (
          <List.Item
            actions={[
              <Button 
                type="primary"
                icon={<EyeOutlined />}
                onClick={() => onViewRecord(result.recordIndex, result.contractAccount)}
              >
                View Record
              </Button>
            ]}
          >
            <List.Item.Meta
              title={
                <Space>
                  <Text strong>Contract Account:</Text>
                  <Text code>{result.contractAccount}</Text>
                  <Text type="secondary">(Record #{result.recordIndex + 1})</Text>
                </Space>
              }
              description={
                result.matchedKeys && result.matchedKeys.length > 0 && (
                  <Space direction="vertical" size="small">
                    {result.matchedKeys.map((key, index) => (
                      <Text key={index} type="secondary">
                        Matched in: <Text code>{key}</Text>
                        {result.matchedValues && result.matchedValues[index] !== undefined && (
                          <> = <Text code>{JSON.stringify(result.matchedValues[index])}</Text></>
                        )}
                      </Text>
                    ))}
                  </Space>
                )
              }
            />
          </List.Item>
        )}
      />
    </Card>
  )
}