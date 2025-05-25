import React, { useState } from 'react'
import { Card, Input, Select, Space, Button, Radio, Form, Row, Col, Tag } from 'antd'
import { SearchOutlined } from '@ant-design/icons'

const { Option } = Select

export type SearchType = 'contractAccount' | 'key' | 'value' | 'keyValue'

interface SearchPanelProps {
  onSearch: (searchType: SearchType, searchTerm: string, keyName?: string) => void
  loading?: boolean
  contractAccountCount: number
}

export const SearchPanel: React.FC<SearchPanelProps> = ({ 
  onSearch, 
  loading,
  contractAccountCount 
}) => {
  const [searchType, setSearchType] = useState<SearchType>('contractAccount')
  const [searchTerm, setSearchTerm] = useState('')
  const [keyName, setKeyName] = useState('')
  const [form] = Form.useForm()

  const handleSearch = () => {
    if (searchType === 'keyValue' && !keyName) {
      form.setFields([{
        name: 'keyName',
        errors: ['Please enter a key name for key-value search']
      }])
      return
    }

    if (!searchTerm.trim()) {
      form.setFields([{
        name: 'searchTerm',
        errors: ['Please enter a search term']
      }])
      return
    }

    onSearch(searchType, searchTerm.trim(), keyName.trim())
  }

  const handleSearchTypeChange = (type: SearchType) => {
    setSearchType(type)
    // Clear errors when changing search type
    form.setFields([
      { name: 'keyName', errors: [] },
      { name: 'searchTerm', errors: [] }
    ])
  }

  return (
    <Card title="Search Records" className="search-panel">
      <Form form={form} layout="vertical" onFinish={handleSearch}>
        <Form.Item label="Search Type">
          <Radio.Group 
            value={searchType} 
            onChange={(e) => handleSearchTypeChange(e.target.value)}
            style={{ width: '100%' }}
          >
            <Space direction="vertical" style={{ width: '100%' }}>
              <Radio value="contractAccount">
                Contract Account 
                <Tag color="green" style={{ marginLeft: 8 }}>
                  Indexed - Fast ({contractAccountCount.toLocaleString()} accounts)
                </Tag>
              </Radio>
              <Radio value="key">Search by Key Name</Radio>
              <Radio value="value">Search by Value</Radio>
              <Radio value="keyValue">Search by Key-Value Pair</Radio>
            </Space>
          </Radio.Group>
        </Form.Item>

        {searchType === 'keyValue' && (
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item 
                name="keyName"
                label="Key Name"
                rules={[{ required: true, message: 'Please enter a key name' }]}
              >
                <Input 
                  placeholder="e.g., behKPIrange"
                  value={keyName}
                  onChange={(e) => setKeyName(e.target.value)}
                  disabled={loading}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item 
                name="searchTerm"
                label="Value"
                rules={[{ required: true, message: 'Please enter a value' }]}
              >
                <Input 
                  placeholder="e.g., 0.0"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onPressEnter={handleSearch}
                  disabled={loading}
                />
              </Form.Item>
            </Col>
          </Row>
        )}

        {searchType !== 'keyValue' && (
          <Form.Item 
            name="searchTerm"
            label={
              searchType === 'contractAccount' ? 'Contract Account' :
              searchType === 'key' ? 'Key Name' : 'Value'
            }
            rules={[{ required: true, message: 'Please enter a search term' }]}
          >
            <Input 
              placeholder={
                searchType === 'contractAccount' ? 'e.g., 300013144585' :
                searchType === 'key' ? 'e.g., restructuringKPI' : 'e.g., Active'
              }
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onPressEnter={handleSearch}
              disabled={loading}
            />
          </Form.Item>
        )}

        <Form.Item>
          <Button 
            type="primary" 
            icon={<SearchOutlined />}
            onClick={handleSearch}
            loading={loading}
            block
          >
            Search
          </Button>
        </Form.Item>
      </Form>
    </Card>
  )
}