import React from 'react'
import { Upload, message } from 'antd'
import { InboxOutlined } from '@ant-design/icons'
import type { UploadProps } from 'antd'

const { Dragger } = Upload

interface FileUploadProps {
  onFileSelect: (file: File) => void
  loading?: boolean
}

export const FileUpload: React.FC<FileUploadProps> = ({ onFileSelect, loading }) => {
  const uploadProps: UploadProps = {
    name: 'file',
    multiple: false,
    accept: '.json',
    showUploadList: false,
    beforeUpload: (file) => {
      const isJSON = file.type === 'application/json' || file.name.endsWith('.json')
      if (!isJSON) {
        message.error('You can only upload JSON files!')
        return false
      }

      const isLt300M = file.size / 1024 / 1024 < 300
      if (!isLt300M) {
        message.error('File must be smaller than 300MB!')
        return false
      }

      onFileSelect(file)
      return false // Prevent default upload behavior
    },
    disabled: loading,
  }

  return (
    <Dragger {...uploadProps} style={{ padding: '40px' }}>
      <p className="ant-upload-drag-icon">
        <InboxOutlined />
      </p>
      <p className="ant-upload-text">Click or drag JSON file to this area</p>
      <p className="ant-upload-hint">
        Support for large JSON files up to 250MB. Files must contain an array of objects with contractAccount fields.
      </p>
    </Dragger>
  )
}